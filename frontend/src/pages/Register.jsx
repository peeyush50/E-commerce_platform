import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Import animation library
import register from "../assets/register.webp"
import { Link } from 'react-router-dom';
import { registerUser } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation for navigation
import { useEffect } from 'react';
import { mergeCart } from '../redux/slices/cartSlice';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state

const Register = () => {
    const [name,setName]=useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch(); // Import useDispatch from react-redux
  const navigate = useNavigate(); // Import useNavigate from react-router-dom
  const location = useLocation(); // Import useLocation to get the current location
  const {user, guestId ,loading} = useSelector((state)=>state.auth);
  const {cart}=useSelector((state)=>state.cart);


  //Get redirect parameter and check if it is's chheckout or something else
  const redirect =new URLSearchParams(location.search).get('redirect') || '/';
  const isCheckoutRedirect = redirect.includes("checkout");


  useEffect(() => {
    if(user){
      if(cart?.products.length > 0 && guestId){
        dispatch(mergeCart({guestId, user})).then(()=>{
          navigate(isCheckoutRedirect ? "/checkout" : "/");

        });
      }else{
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    

  }},[user, guestId,cart, navigate, isCheckoutRedirect,dispatch]); 

  const handleSubmit=(e)=>{
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
    console.log("User Registered: ",{ name, email, password});

  }

  return (

    <div className='flex '>
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
        <form  onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
          <div className='flex justify-center mb-6'>
            <h2 className='text-xl font-medium'>Rabbit</h2>
          </div>
          <h2 className='text-2xl font-bold text-center mb-6 flex items-center justify-center'>
            Hey there!
            <motion.span
              className="text-yellow-500 text-3xl ml-2"
              animate={{ rotate: [0, 20, 0, -20, 0] }} // Waving motion
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              👋
            </motion.span>
          </h2>
          <p className='text-center mb-6'>
            Enter your username and password to Login.
          </p>
          <div className='mb-4'>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input type="text"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder='Enter your Name'
             />

          </div>
          <div className='mb-4'>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input type="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder='Enter your email address'
             />
             </div>

          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Password</label>
            <input type="password"
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
              className='w-full p-2 border rounded' 
              placeholder='Enter your password'/>
          </div>
          <button 
          type='submit'
          className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition'>
           {loading? "loading..." : " Sign Up"}
          </button>
          <p className='mt-6 text-center text-sm'>
            Don't have an account?{" "}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500">
            Login</Link>
          </p>
        </form>
      </div>
      <div className='hidden md:block w-1/2 bg-gray-800'>
      <div className='h-full flex flex-col justify-center items-center'>
        <img src={register} alt="Login to Account "
        className='h-[750px] w-full object-cover' /></div></div>
    </div>
  );
};

export default Register;
