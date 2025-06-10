import React, { use, useEffect ,useState} from 'react'
import {FaFilter} from "react-icons/fa"
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductsGrid from '../components/Products/ProductsGrid';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';

const CollectionPage=()=> {
  const {collection}=useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const {products, loading, error}=useSelector((state) => state.products);
  const queryParams = Object.fromEntries(searchParams);
  

  //  const [products,setProducts]=useState([]);
    const sidebarRef= useRef(null);
    const [isSidebarOpen, setIsSideOpen]=useState(false);

    useEffect(()=>{
        //Dispatch action to fetch products based on collection and query params
        dispatch(fetchProductsByFilters({collection, ...queryParams}));
    },[dispatch, collection, searchParams]);
    const toggleSidebar=()=>{
        setIsSideOpen(!isSidebarOpen);
    };

    const handleClickOutside =(e)=>{
        //close sidebar if clicked outside
        if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
            setIsSideOpen(false);
        }
    }

    useEffect(()=>{
        //Add Event listner for clicks
        document.addEventListener("mousedown",handleClickOutside);
        //clean event listener
        return()=>{
          document.removeEventListener('mousedown',handleClickOutside)

        }

    },[]);

    // useEffect(()=>{
    //     setTimeout(()=>{
    //         const fetchedProducts=[
    //             {
    //               _id: 1,
    //               name: "Product 7",
    //               price: 100,
    //               images: [{ url: "https://picsum.photos/500/500?random=7" }],
    //             },
    //             {
    //               _id: 2,
    //               name: "Product 8",
    //               price: 100,
    //               images: [{ url: "https://picsum.photos/500/500?random=8" }],
    //             },
    //             {
    //               _id: 3,
    //               name: "Product 9",
    //               price: 100,
    //               images: [{ url: "https://picsum.photos/500/500?random=9" }],
    //             },
    //             {
    //               _id: 4,
    //               name: "Product 10",
    //               price: 100,
    //               images: [{ url: "https://picsum.photos/500/500?random=10" }],
    //             }
    //             ,{
    //               _id: 1,
    //               name: "Product 11",
    //               price: 100,
    //               images: [{ url: "https://picsum.photos/500/500?random=11" }],
    //             },
    //             {
    //               _id: 2,
    //               name: "Product 12",
    //               price: 100,
    //               images: [{ url: "https://picsum.photos/500/500?random=12" }],
    //             },
    //             {
    //               _id: 3,
    //               name: "Product 13",
    //               price: 100,
    //               images: [{ url: "https://picsum.photos/500/500?random=13" }],
    //             },
    //             {
    //               _id: 4,
    //               name: "Product 14",
    //               price: 100,
    //               images: [{ url: "https://picsum.photos/500/500?random=14" }],
    //             }
    //           ];
    //           setProducts(fetchedProducts);

            
    //     },1000);

    // },[]);
  return (
    <div className='flex flex-col lg:flex-row'>
        {/* Mobile Filter button */}
        <button 
         onClick={toggleSidebar} className='lg:hidden border p-2 flex justify-center items-center'>
            <FaFilter className='mr-2' />Filters
        </button>
        {/* Filter sidebar */}
        <div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0":"-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
            <FilterSidebar />
        </div>
        <div className='flex-grow p-4'>
            <h2 className='text-2xl uppercase mb-4'>All Collection</h2>
            {/* Sort Options */}
            <SortOptions />

            {/* Product Grid */}
            <ProductsGrid products={products}  loading={loading} error={error} />

           
        </div>
    </div>
  )
}

export default CollectionPage;