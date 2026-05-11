'use client'
import axios from 'axios'
import {motion ,  AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { AiOutlineFileText, AiOutlineHome, AiOutlineShop } from 'react-icons/ai'
import { ClipLoader } from 'react-spinners'

function EditVendorDetails() {
    const [shopName , setShopName] = useState("")
  const [shopAddress , setShopAddress] = useState("")
  const [gstNumber , setGSTNumber] = useState("")
  const [loading,setLoading] = useState(false)

  const router = useRouter()

    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault()
        if (!shopName || !shopAddress || !gstNumber)
        {
            alert("Fill all field")
        }
        setLoading(true)
        try {
            const result = await axios.post("/api/vendor/editDetails" , {shopName , shopAddress , gstNumber})
            alert("Vendor Shop Details added Successfully")
            setLoading(false)
            router.push("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

  return (
   <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-white p-6'>
      <AnimatePresence>
        <motion.div
        initial = {{opacity: 0 , y:40}}
        animate = {{opacity :1 , y:40}}
        exit={{opacity: 0 , y:-40}}
        transition={{duration: 0.5}}
        className='w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/10'>

            <h3 className='text-3xl font-semibold text-center mb-4'>Complete Your Shop Details</h3>
            <p className='text-center text-gray-300 mb-6 text-sm'>
                Enter your business information to activate your vendor account.
            </p>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <div className='relative'>

        <AiOutlineShop className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={22} />
        <input type="text"
        placeholder='Shop Name'
        required
        className='w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500' 
        onChange={(e)=>setShopName(e.target.value)} value={shopName}
        />
            </div>

          <div className='relative'>

        <AiOutlineHome className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={22} />
        <input type="text"
        placeholder='Shop Address'
        required
        className='w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500' 
        onChange={(e)=>setShopAddress(e.target.value)} value={shopAddress}
        />
            </div>

              <div className='relative'>

        <AiOutlineFileText className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={22} />
        <input type="text"
        placeholder='GSTIN'
        required
        className='w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500' 
        onChange={(e)=>setGSTNumber(e.target.value)} value={gstNumber}
        />
            </div>

                  <motion.button
                               disabled={loading}
                                type='submit'
                        whileHover={{scale: 1.03}}
                        whileTap={{ scale: 0.95}}
                        className='mt-4 px-8 py-3 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium w-full '
                       >
                        {loading ? <ClipLoader size={20} color='white' />:"Submit Now"}
                        </motion.button>

            </form>

        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default EditVendorDetails
