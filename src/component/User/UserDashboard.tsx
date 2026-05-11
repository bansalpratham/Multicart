'use client'
import React from 'react'
import Slider from './Slider'
import CategorySlider from './CategorySlider'
import ProductCardPage from './ProductCardPage'
import ShopPage from '@/app/shop/page'

function UserDashboard() {
  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 font-sans flex-col'>
      <Slider/>
      <CategorySlider/>
      <ProductCardPage/>
      <ShopPage/>
    </div>
  )
}

export default UserDashboard
