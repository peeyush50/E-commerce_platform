import React, { useEffect } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductsDetail from '../components/Products/ProductsDetail'
import ProductsGrid from '../components/Products/ProductsGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturedSection from '../components/Products/FeaturedSection'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByFilters } from '../redux/slices/productsSlice'
import axios from 'axios'
import { useState } from 'react';

// const placeholderProducts=[
//   {
//     _id: 1,
//     name: "Product 7",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=7" }],
//   },
//   {
//     _id: 2,
//     name: "Product 8",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=8" }],
//   },
//   {
//     _id: 3,
//     name: "Product 9",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=9" }],
//   },
//   {
//     _id: 4,
//     name: "Product 10",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=10" }],
//   }
//   ,{
//     _id: 1,
//     name: "Product 11",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=11" }],
//   },
//   {
//     _id: 2,
//     name: "Product 12",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=12" }],
//   },
//   {
//     _id: 3,
//     name: "Product 13",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=13" }],
//   },
//   {
//     _id: 4,
//     name: "Product 14",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=14" }],
//   }
// ];


const Home=()=> {
  const dispatch = useDispatch();
  const {products, loading, error}= useSelector((state) => state.products);
  const [bestSellerProducts, setBestSellerProducts] = useState(null);

  useEffect(() => {
    // Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender:"Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );
    // Fetch best seller products
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        
      } catch (error) {
        console.error(error);
      }
    };
  
  },[dispatch]);
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best Seller */}
      <h2 className='text-3xl text-center font-bold mb-4'>
        Best Seller
      </h2>

      {bestSellerProducts ? (<ProductsDetail productId={bestSellerProducts._id}/>):(
        <p className='text-center text-gray-500'>Loading best seller products...</p>
      )}

      <div className='container mx-auto'>
        <h2 className='text-3xl text-center font-bold mb-4'>
          Top Wears for Women
        </h2>
        <ProductsGrid products={products } loading={loading} error={error} />
      </div>
      <FeaturedCollection />
      <FeaturedSection />

    </div>
    
  )
}

export default Home