import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
import { clearCart } from '../redux/slices/cartSlice';
// const checkout = {
//   _id: "12323",
//   createdAt: new Date(),
//   checkoutItems: [
//     {
//       productId: "1",
//       name: "Jacket",
//       color: "black",
//       size: "M",
//       price: 150,
//       quantity: 1,
//       image: "https://picsum.photos/150?random=1",
//     },
//     {
//       productId: "2",
//       name: "T-shirt",
//       color: "black",
//       size: "M",
//       price: 120,
//       quantity: 2,
//       image: "https://picsum.photos/150?random=2",
//     },
//   ],
//   shippingAddress: {
//     address: "123 Fashion Street",
//     city: "New York",
//     country: "USA",
//   },
// };

const OrderConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkout = useSelector((state) => state.checkout.checkout);


  // clear the cart when the order is confirmed
  useEffect(()=>{
    if(checkout && checkout._id){
      dispatch(clearCart());
      localStorage.removeItem('cartItems');
    }else{
      navigate('/my-orders');
    }
  },[checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // Add 10 days to the order date
    return orderDate.toLocaleDateString();
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white'>
      <h1 className='text-4xl font-bold text-center text-emerald-700 mb-8'>
        Thank You for Your Order!
      </h1>

      {checkout && (
        <div className='p-6 rounded-lg border'>
          {/* Order ID and Date */}
          <div className='mb-6'>
            <h2 className='text-xl font-semibold'>Order ID: {checkout._id}</h2>
            <p className='text-gray-500'>
              Order date: {new Date(checkout.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Estimated Delivery */}
          <div>
            <p className='text-emerald-700 text-sm'>
              Estimated Delivery: {calculateEstimatedDelivery(checkout.createdAt)}
            </p>
          </div>

          {/* Ordered Items */}
          <div className='mb-6'>
            {checkout.checkoutItems.map((item) => (
              <div key={item.productId} className='flex items-center mb-4 border-b pb-2'>
                <img
                  src={item.image}
                  alt={item.name} // ✅ Fixed alt attribute
                  className='w-16 h-16 object-cover rounded-md mr-4'
                />
                <div className='flex-1'>
                  <p className='text-md font-medium'>{item.name}</p>
                  <p className='text-sm text-gray-500'>Color: {item.color} | Size: {item.size}</p>
                </div>
                <div className='ml-auto text-right'>
                  <p className='text-md font-semibold'>${item.price * item.quantity}</p>
                  <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment and Delivery Info */}
          <div className='grid grid-cols-2 gap-8 mt-6'>
            {/* Payment Info */}
            <div>
              <h4 className='text-lg font-semibold mb-2'>Payment</h4>
              <p className='text-gray-600'>Paypal</p>
            </div>

            {/* Delivery Info */}
            <div>
              <h4 className='text-lg font-semibold mb-2'>Delivery</h4>
              <p className='text-gray-600'>{checkout.shippingAddress.address}</p>
              <p className='text-gray-600'>
                {checkout.shippingAddress.city}, {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
