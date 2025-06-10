const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
//Helper function to get the cart based on userId or guestId
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId: guestId });
    } else {
        return null; // No userId or guestId provided
    }
};

//@route POST /api/cart
//@desc Add a product to the cart for a guest or a logged-in user
//@access Public
router.post('/', async (req, res) => {
    const { productId, quantity,size,color ,guestId,userId } = req.body;
    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product)  return res.status(404).json({ message: 'Product not found' });

        //Determine if the user is logged in or a guest
        let cart=await getCart(userId,guestId);

        //if the cart exists, update it
        if (cart) {
            // Check if the product is already in the cart
            const ProductIndex = cart.products.findIndex(item => item.productId.toString() === productId && item.size === size && item.color === color);
            if (ProductIndex > -1) {
                // Update the quantity if the product already exists in the cart
                cart.products[ProductIndex].quantity += quantity;
            } else {
                // Add new product to the cart
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size:size,
                    color:color,
                    quantity: quantity,
                });
            }

            // Recalculate the total price
            cart.totalPrice = cart.products.reduce((total, item) => total + (item.price * item.quantity), 0);
            await cart.save();  
            return res.status(200).json(cart);
        } else {
            // Create a new cart for the user or guest
            const newCart = await Cart.create({
                user: userId ? userId: undefined,
                guestId: guestId ?guestId: "guest_" + new Date().getTime(),
                products: [{
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size:size,
                    color:color,
                    quantity: quantity,
                }],
                totalPrice: product.price * quantity,
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });


        }
    });


    //@route PUT /api/cart
//@desc Update the quantity in the cart for a guest or logged-in user
//@access Public
router.put('/', async (req, res) => {
    const { productId, quantity,size,color,guestId,userId } = req.body;
    try{
        let cart=await getCart(userId,guestId); 
        if(!cart) return res.status(404).json({ message: 'Cart not found' });
        // Check if the product is in the cart
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId && item.size === size && item.color === color);
        console.log("Incoming product:", productId, size, color);

        if(productIndex > -1) {
            console.log("Found match:", cart.products[productIndex]);
            //update quantity
            if(quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                // Remove product from cart if quantity is 0
                cart.products.splice(productIndex, 1);//Remove product if quantity is 0

            }

            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

        

        await cart.save();
        return res.status(200).json(cart);
        }else{
        return res.status(404).json({ message: 'Product not found in cart' });
    }
    }catch(error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' })
    }
});


//@route DELETE /api/cart
//@desc Remove a product from the cart 
//@access Public
router.delete('/', async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        // Check if the product is in the cart
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId && item.size === size && item.color === color);
        if (productIndex > -1) {
            // Remove product from cart
            cart.products.splice(productIndex, 1);
            // Recalculate total price
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

//@route GET /api/cart
//@desc Get logged-in user's or guest's user cart
//@access Public
router.get('/', async (req, res) => {
    const { guestId, userId } = req.query;
    try {
        const cart = await getCart(userId, guestId);
       
        
        if (cart) {
            res.json(cart);
          } else {
            res.status(404).json({message:"Cart Not Found"});
          }
          
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
   
   // @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post('/merge', protect, async (req, res) => {
    const { guestId } = req.body; // Get the guestId from the request body
    try {
        // Find the guest cart and user cart
        const guestCart = await Cart.findOne({ guestId});
        const userCart = await Cart.findOne({ user: req.user._id });
        if (guestCart) {
            if(guestCart.products.length === 0){
                return res.status(404).json({ message: 'Guest cart is empty' });
            } 
            if (userCart) {
                // Merge guest cart into user cart
                guestCart.products.forEach((guestItem)=>{
                    const productIndex = userCart.products.findIndex(item => item.productId.toString() === guestItem.productId.toString() && item.size === guestItem.size && item.color === guestItem.color);
                    if (productIndex > -1) {
                        // If the items exists in the user cart, update the quantity
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        // Otherewise, add the guest item to the cart
                        userCart.products.push(guestItem);
                    }
                });

                userCart.totalPrice =userCart.products.reduce((acc,item)=>acc+item.price * item.quantity,0);
                await userCart.save();
                // Remove the guest cart after merging
                try{
                    await Cart.findOneAndDelete({ guestId });

                }catch(error){
                    console.error("Error deleting guest cart:", error);
                   
                }
                res.status(200).json(userCart);}
                else{
                    //if the user has no existing cart, assign the guest cart to the user
                    guestCart.user = req.user._id;
                    guestCart.guestId = undefined; // Remove guestId
                    await guestCart.save();

                    res.status(200).json(guestCart);
                }
            }else{
                if(userCart) {
                    // Guest cart has already been merged,return user cart
                    return res.status(200).json(userCart);
                }
                res.status(404).json({ message: 'Guest cart not found' });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    
    
    module.exports = router;
