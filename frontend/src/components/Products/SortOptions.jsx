import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SortOptions=()=> {
  const [searchParams, setsearchParams]=useSearchParams();

  const handleSortChange=(e)=>{
    const sortBy=e.target.value;
    searchParams.set("sortBy",sortBy)
    setsearchParams(searchParams)
  }


  return (
    <div className='mb-4 flex items-center justify-end'>
      <select id="sort" onChange={handleSortChange} value={searchParams.get("sortBy") || ""} className='border p-2 rounded-md focus:outline-none'>
        <option value="">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  )
}

export default SortOptions