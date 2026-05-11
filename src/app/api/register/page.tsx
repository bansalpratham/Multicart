'use client'
import React, { useState } from 'react'
import {AnimatePresence, motion} from "motion/react"
import { TbPlayerTrackNext } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { signIn } from 'next-auth/react';

function Register() {
    const [step,setStep] = useState<1 | 2>(1)
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [showPassword,setShowPassword] = useState(false)
    const [loading,setLoading] = useState(false)
    const router = useRouter()

    const handleSignUp = async (e:React.FormEvent)=>{
        e.preventDefault()
        setLoading(true)
        try {
            const result = await axios.post("/api/auth/register" , {name,email,password})
            console.log(result.data)
            setLoading(false)
            setEmail("")
            setName("")
            setPassword("")
            router.push("/login")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-white p-6'>
      

    <AnimatePresence mode='wait' >

    {/* for step1 Ui */}
    {step == 1 && 
<motion.div 
initial={{opacity:0 , y:40}}
animate={{opacity:1 , y:0}}
exit={{opacity:0 , y:-40}}
transition={{duration:0.5}}
className='w-full max-w-lg text-center bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/10'
>

  {/* Logo */}
  <div className='w-20 h-20 mx-auto rounded-2xl bg-blue-500/20 flex items-center justify-center text-4xl shadow-lg mb-6'>
    🛒
  </div>

  {/* Heading */}
  <h1 className='text-4xl font-bold mb-3 bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'>
    Welcome to MultiCart
  </h1>

  {/* Subtitle */}
  <p className='text-gray-300 leading-relaxed mb-8'>
    Your all-in-one multi-vendor marketplace where users can explore products,
    vendors can manage stores, and admins can control the platform seamlessly.
  </p>

  {/* Features */}
  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>

    <div className='bg-white/5 border border-white/10 rounded-2xl p-4'>
      <div className='text-3xl mb-2'>👤</div>
      <h3 className='font-semibold text-white'>Users</h3>
      <p className='text-xs text-gray-400 mt-1'>
        Shop products from multiple vendors easily.
      </p>
    </div>

    <div className='bg-white/5 border border-white/10 rounded-2xl p-4'>
      <div className='text-3xl mb-2'>🏪</div>
      <h3 className='font-semibold text-white'>Vendors</h3>
      <p className='text-xs text-gray-400 mt-1'>
        Manage your products and orders efficiently.
      </p>
    </div>

    <div className='bg-white/5 border border-white/10 rounded-2xl p-4'>
      <div className='text-3xl mb-2'>🛠️</div>
      <h3 className='font-semibold text-white'>Admin</h3>
      <p className='text-xs text-gray-400 mt-1'>
        Control users, vendors and platform activity.
      </p>
    </div>

  </div>

  {/* Buttons */}
  <div className='flex flex-col gap-4'>

    <motion.button
      onClick={() => setStep(2)}
      whileHover={{scale:1.02}}
      whileTap={{scale:0.97}}
      className='w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-medium flex items-center justify-center gap-2'
    >
      Create Account
      <TbPlayerTrackNext size={20} />
    </motion.button>

  </div>

</motion.div>
}
    {/* for step2 Ui */}
    {step == 2 && 
    <motion.div className='w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20'
    initial = {{opacity:0 , y:40}}
    animate = {{opacity:1 , y:40}}
    exit={{opacity:0 , y:40}}
    transition={{duration:0.5}}
    
    >

        <h1 className='text-2xl font-semibold text-center mb-6 text-blue-300'>Create your Account</h1>

        <form onSubmit={handleSignUp} className='flex flex-col gap-4' >

            <input type="text" 
            required
            placeholder='Full Name'
            className='bg-white/10 border border-white/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={(e)=>setName(e.target.value)} value={name}
            />

         <input type="text" 
            required
            placeholder='Email'
            className='bg-white/10 border border-white/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={(e)=>setEmail(e.target.value)} value={email}
            />

         <input type={showPassword ? "text" : "password"} 
            required
            placeholder='Password'
            className='bg-white/10 relative border border-white/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={(e)=>setPassword(e.target.value)} value={password}
            />
        <button 
        type='button'
        onClick={()=>setShowPassword(!showPassword)}
        className='absolute right-12 top-61 -translate-1/2 text-gray-400 hover:text-white transition'>
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} /> }
        </button>

           <motion.button
           disabled={loading}
            type='submit'
    whileHover={{scale: 1.03}}
    whileTap={{ scale: 0.95}}
    className='mt-4 px-8 py-3 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium w-full '
   >
    {loading ? <ClipLoader size={20} color='white' />:"Register Now"}
    </motion.button>

    <div className='flex items-center my-3'>
        <div className='flex-1 h-px bg-gray-600'></div>
        <span className='px-3 text-sm text-gray-400'>or</span>
        <div className='flex-1 h-px bg-gray-600'></div>
    </div>

    <motion.button
    onClick={()=>signIn("google", {callbackUrl:"/"})}
    whileHover={{scale: 1.03}}
    whileTap={{ scale: 0.95}}
    className='flex items-center justify-center gap-3 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition'
   ><FaGoogle className='w-5 h-5' />
    <span className='font-medium'>Continue with Google</span>
    </motion.button>
    <p className='text-center text-sm mt-4 text-gray-400'>
            Already have an account{" "}
             <span onClick={()=>router.push("/login")} className='text-blue-400 hover:underline hover:text-blue-300 transition'>SignIn</span>
    </p>

        </form>

    </motion.div>}

    </AnimatePresence>

    </div>
  )
}

export default Register
