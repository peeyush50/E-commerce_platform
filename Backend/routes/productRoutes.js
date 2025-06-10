const express=require("express");
const Product=require("../models/Product");

const {protect, admin}=require("../middleware/authMiddleware");

const router=express.Router();

//@route POST/api/products
//@desc Create a new Product
//@accesss Private/Admin

router.post("/", protect,admin, async(req,res)=>{
    try{
        const{
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,





        }=req.body;

        const product=new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user.id, //Reference to the admin user who created it

        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);

    } catch(error){
        console.log(error);
        res.status(500).send("Server Error");
    }
})


//@route PUT/api/products/:id
//@desc Update an existing product ID
//@access Private/Admin

router.put("/:id", protect,admin,async(req,res)=>{
    try{
        const{
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,





        }=req.body;
       //Find product by ID
       const product = await Product.findById(req.params.id);
       if(product){
        //update product fields
        product.name =name || product.name;
        product.description =description || product.description;
        product.price =price || product.price;
        product.discountPrice =discountPrice || product.discountPrice;
        product.countInStock =countInStock || product.countInStock;
        product.category =category || product.category;
        product.brand =brand  || product.brand ;
        product.sizes=sizes || product.sizes;
        product.colors =colors || product.colors;
        product.collections =collections || product.collections;
        product.material =material || product.material;
        product.gender =gender || product.gender;
        product.images =images || product.images;
        product.isFeatured =isFeatured  !== undefined ? isFeatured : product.isFeatured ;
        product.isPublished =isPublished  !== undefined ? isPublished : product.isPublished;
        product.tags =tags || product.tags;
        product.dimensions =dimensions || product.dimensions;
        product.weight =weight || product.weight;
        product.sku =sku || product.sku;


        // Save the updated product
        const updatedProduct= await product.save();
        res.json(updatedProduct);
       }
       else{
        res.status(404).json({message: "Product not found"});
       }
    }
    catch(error){
        console.error(error);
        res.status(500).send("Server Error");


    }
})


//@route DELETE/api/products/:id
//@desc Delete a product by ID
//@access Private/Admin
router.delete("/:id", protect,admin,async(req,res)=>{
    try{
        //Find product by ID
        const product = await Product.findById(req.params.id);
        if(product){
            //Remove product from DB
            await product.deleteOne();
            res.json({message: "Product removed"});
        }else{
            res.status(404).json({message: "Product not found"});
        }
    }catch(error){
        console.error(error);
        res.status(500).send("Server Error");
    }
})

//@route GET/api/products/:id
//@desc Get ALL product with optional query fiters
//@access Public
router.get("/", async(req,res)=>{
    try{
        const {collection,size,color,gender,minPrice,maxPrice,sortBy,search,category,material,brand,limit}=req.query;
        let query={};

        // Filter logic
        if(collection && collection.toLocaleLowerCase !== "all"){
            query.collections = collection;
        }
        if(category && category.toLocaleLowerCase !== "all"){
            query.category = category;
        }

        if(material){
            query.material = { $in: material.split(",") };
            
        }

        if(brand){
            query.material = { $in: brand.split(",") };
            
        }

        if(size){
            query.sizes = { $in: size.split(",") };
            
        }

        if(color){
            query.colors = { $in: [color] };
        }

        if(gender){
            query.gender=gender;
        }
        if(minPrice || maxPrice){
            query.price = {};
            if(minPrice){
                query.price.$gte = minPrice;
            }
            if(maxPrice){
                query.price.$gte = maxPrice;
            }
        }

        if(search){
            query.$or = [
                {name: {$regex: search, $options: "i"}},
                {description: {$regex: search, $options: "i"}},
                {tags: {$regex: search, $options: "i"}},
            ];
        }

        //Sorting logic
        let sort={};
        if(sortBy){
            switch(sortBy){
                case "priceAsc":
                    sort = {price: 1};
                    break;
                case "priceDesc":
                    sort = "price: -1";
                    break;
                case "popularity":
                    sort = "rating: -1";

                    break;
            
                default:
                    break;
            }
        }

        //Fetch products and apply sorting and limiting
        let products=await Product.find(query).sort(sort).limit(Number(limit)||0);
        res.json(products);

    }
    catch(error){
        console.error(error);
        res.status(500).send("Server Error");
    }
});


//@route GET/api/products/best-sellers
//@desc Retrieve the products with the highest rating
//@access Public

router.get("/best-seller", async(req,res)=>{
    try{
        const bestSeller = await Product.findOne().sort({rating: -1});
        if(bestSeller){
            res.json(bestSeller);
        }
        else{
            res.status(404).json({message: "No best seller found"});
        }
        
    }
    catch(error){
        console.error(error);
        res.status(500).send("Server Error");
    }
})


//@route GET/api/products/new-arrivals
//@desc Retrieve the latest  8 products-by creation date
//@access Public
router.get("/new-arrivals", async(req,res)=>{
    try{
        const newArrivals = await Product.find().sort({createdAt: -1}).limit(8);
        if(newArrivals){
            res.json(newArrivals);
        }
        else{
            res.status(404).json({message: "No new arrivals found"});
        }
        
    }
    catch(error){
        console.error(error);
        res.status(500).send("Server Error");
    }
})


//@route GET/api/products/:id
//@desc Get product by single product by ID
//@access Public
router.get("/:id", async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }else{
            res.status(404).json({message: "Product not found"});
        }
    }
    catch(error){
        console.error(error);
        res.status(500).send("Server Error");
    }
})

//@route GET/api/products/similar/:id
//@desc Retrieve similar products based on the current product's gender and category
//@access Public
router.get("/similar/:id", async(req,res)=>{
    const {id}=req.params;
    try{
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }

        const similarProducts = await Product.find({
            _id: {$ne: id},//Exclude the current product ID
            gender: product.gender,
            category: product.category,
        }).limit(4); // Limit to 4 similar products

        res.json(similarProducts);
    }
    catch(error){
        console.error(error);
        res.status(500).send("Server Error");
    }
})





  
module.exports=router;

