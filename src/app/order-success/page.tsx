'use client'
import React from 'react'
import { motion } from 'motion/react'
import { FaCheckCircle, FaShoppingBag, FaArrowRight } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function OrderSuccess() {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-linear-to-br from-[#020617] via-black to-[#020617] flex items-center justify-center px-4 py-12'>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className='w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.1)] p-8 md:p-12 text-center'
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className='flex justify-center mb-6'
        >
          <div className='relative'>
            <div className='absolute inset-0 bg-green-500 blur-2xl opacity-20 rounded-full'></div>
            <FaCheckCircle className='text-7xl md:text-8xl text-green-500 relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]' />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='text-3xl md:text-4xl font-extrabold text-white mb-4'
        >
          Order Successful!
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='text-gray-400 mb-8 text-lg'
        >
          Thank you for your purchase. Your order has been placed successfully and is now being processed.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='flex flex-col sm:flex-row gap-4 justify-center'
        >
          <Link href="/orders" className='flex-1'>
            <button className='w-full py-4 px-6 rounded-2xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/5 transition-all flex items-center justify-center gap-2 group'>
              <FaShoppingBag className='text-gray-400 group-hover:text-white transition-colors' />
              View Orders
            </button>
          </Link>

          <Link href="/" className='flex-1'>
            <button className='w-full py-4 px-6 rounded-2xl font-bold text-white bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2 group'>
              Continue Shopping
              <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
            </button>
          </Link>
        </motion.div>

      </motion.div>
    </div>
  )
}

export default OrderSuccess
