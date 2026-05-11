'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useRouter } from 'next/navigation';

function CategorySlider() {
    const [startIndex,setStartIndex] = useState(0)
    const router = useRouter()
    const categories = [
      { label: "Fashion & Lifestyle", icon: "👗" },
      { label: "Electronics & Gadgets", icon: "📱" },
      { label: "Home & Living", icon: "🏠" },
      { label: "Beauty & Personal Care", icon: "💄" },
      { label: "Toys, Kids & Baby", icon: "🧸" },
      { label: "Food & Grocery", icon: "🛒" },
      { label: "Sports & Fitness", icon: "🏋️" },
      { label: "Automotive Accessories", icon: "🚗" },
      { label: "Gifts & Handcrafts", icon: "🎁" },
      { label: "Books & Stationery", icon: "📚" },
    ];

    const NextSlice = ()=> {
        setStartIndex((prev)=>(prev + 5) % categories.length)
    }

    const PrevSlice = ()=>{
        setStartIndex((prev)=>prev - 5 < 0 ? categories.length - 5 : prev - 5 )
    }

    useEffect(()=>{
        const interval = setInterval(NextSlice,5000)
        return ()=> clearInterval(interval)
    },[])

  return (
    <motion.div 
    initial={{opacity: 0 , y:60}}
    whileInView={{opacity: 1 , y:0}}
    transition={{duration : 0.8}}
    viewport={{once: true}}
    className='w-full mx-auto p-8 text-center bg-linear-to-br from-black via-gray-900 to-black relative'>

    <h2 className='text-3xl font-semibold mb-6 text-white'>Shop by Categories</h2>

    <div className='relative overflow-hidden'>

        <motion.div 
        animate={{ x: `-${(startIndex / 5) * 100}%` }}
        transition={{ duration: 0.6 }}
        className='flex gap-4'>

            {
                categories.map((item , index)=>(
                    <motion.div
                    onClick={()=>router.push(`/category?category=${encodeURIComponent(item.label)}`)}
                    key={index}
                    whileHover={{scale:1.03}}
                    className='min-w-[20%] bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer text-white'>
                        
                    <span className='text-4xl mb-2 block'>{item.icon}</span>
                    <p className='text-sm font-medium'>{item.label}</p>

                    </motion.div>
                ))
            }

        </motion.div>

        <button onClick={PrevSlice} className='absolute left-0 top-1/2 -translate-y-1/2 border border-gray-500 bg-gray-800/60 text-white p-2 rounded-full'>
            <FaAngleLeft />
        </button>

        <button onClick={NextSlice} className='absolute right-0 top-1/2 -translate-y-1/2 border border-gray-500 bg-gray-800/60 text-white p-2 rounded-full'>
            <FaAngleRight />
        </button>

    </div>

    </motion.div>
  )
}

export default CategorySlider