'use client'
import axios from 'axios';
import { motion } from 'motion/react'
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaStripe } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

function Checkout() {
  const params = useParams()
  const productId = params.id as string;
  const [item,setItem] = useState<any>(null)

  const [paymentMethod , setPaymentMethod] = useState<"cod" | "stripe">("cod")
  const [name,setName] = useState("")
  const [phone,setPhone] = useState("")
  const [address,setAddress] = useState("")
  const [city,setCity] = useState("")
  const [pincode,setPincode] = useState("")
  const [loading , setLoading] = useState(false)
  const [showVirtualStripe, setShowVirtualStripe] = useState(false)

  const router = useRouter()

  useEffect(()=>{
    if (!productId)
    {
      return;
    }

    const loadItem = async ()=>{
     try {
       const result = await axios.get(`/api/user/cart/get`)
       const foundItem = result.data.cart.find((i:any)=>i.product._id === productId)

       if (!foundItem)
       {
          router.replace("/cart")
       }
       setItem(foundItem)

       if (!foundItem.product.payOnDelivery)
       {
        setPaymentMethod("stripe")
       }
      
     } catch (error) {
        console.log(error)
        alert("failed to get item")
     }
    }

    loadItem()

  },[productId,router])

  
  if (!item)
    {
      return <div className='min-h-screen text-4xl bg-linear-to-br from-[#020617] via-black to-[#020617] flex items-center justify-center px-4 py-12'>
        Loading...
    </div>
  }
  
  const productTotal = item.product.price * item.quantity
  
  const deliveryCharge = item.product.freeDelivery ? 0: 50
  const serviceCharge = 30;
  const finalCharge = productTotal + deliveryCharge +  serviceCharge

    const codDisable = !item.product.payOnDelivery

      const handlePlaceOrder = async ()=>{
      if (!name || !phone || !address || !city || !pincode)
      {
        alert("Please fill all address fields");
        return;
      }

      const payload = {
        productId,
        quantity: item.quantity,
        address:{name,phone,address,city,pincode},
        amount: finalCharge,
        deliveryCharge,
        serviceCharge,
      };

      setLoading(true)

      try {
        if (paymentMethod === "cod")
        {
          const result = await axios.post("/api/order/cod" ,payload)
          router.push("/order-success")
          console.log(result)
          setLoading(false)
        } else if (paymentMethod === "stripe") {
          setLoading(false);
          setShowVirtualStripe(true);
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
        router.push("/order-failed")
      }

      }

      const handleVirtualPayment = async () => {
        setLoading(true);
        const payload = {
          productId,
          quantity: item.quantity,
          address: { name, phone, address, city, pincode },
          amount: finalCharge,
          deliveryCharge,
          serviceCharge,
        };
    
        try {
          const result = await axios.post("/api/order/stripe-mock", payload);
          router.push("/order-success");
          console.log(result);
          setLoading(false);
          setShowVirtualStripe(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
          setShowVirtualStripe(false);
          router.push("/order-failed");
        }
      };

  return (
    <div className='min-h-screen bg-linear-to-br from-[#020617] via-black to-[#020617] flex items-center justify-center px-4 py-12'>
      <motion.div
      initial={{opacity:0 , y:40}}
      animate={{opacity:1 , y:0}}
      transition={{duration:0.5}}
      className='w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-10 grid md:grid-cols-2 gap-8'
      >

      <div className='space-y-5'>
           <h2 className='text-2xl font-bold text-white'> 
                Delivery Address
           </h2>
           <input type="text" placeholder='Full Name' className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition' onChange={(e)=>setName(e.target.value)} value={name} />
           <input type="text" placeholder='Phone Number' className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition' onChange={(e)=>setPhone(e.target.value)} value={phone} />
     <textarea  placeholder='Complete Address' className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition' onChange={(e)=>setAddress(e.target.value)} value={address} />
      <div className='grid grid-cols-2 gap-4'>
      <input type="text" placeholder='City' className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition' onChange={(e)=>setCity(e.target.value)} value={city} />
           <input type="text" placeholder='PinCode' className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition' onChange={(e)=>setPincode(e.target.value)} value={pincode} />
      </div>
      </div>

      <div className='space-y-5'>
        <h2 className='text-2xl font-bold text-white'>
          Order Summary
        </h2>
        <div className='flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10'>
        <Image src={item.product.image1} alt='img' width={120} height={120} className='w-20 h-20 object-contain rounded-lg bg-white' />
        <div className='flex-1'>
          <p className='font-semibold text-gray-100'>{item.product.title}</p>
      <p className='text-sm text-gray-400'>Qty: {item.quantity}</p>
        </div>
        <p className='font-bold text-green-400'>
          ₹ {productTotal}
        </p>
        </div>

      <div className='space-y-2 text-sm text-gray-300'>
        <div className='flex justify-between'>
          <span>Delivery Charge</span>
          <span>₹{deliveryCharge}</span>
        </div>
         <div className='flex justify-between'>
          <span>Service Charge</span>
          <span>₹{serviceCharge}</span>
        </div>
         <div className='flex justify-betwee text-lg font-bold border-t border-white/20 pt-3 text-white'>
          <span>Total</span>
          <span className='text-green-400'>₹{finalCharge}</span>
        </div>
      </div>

      <div className='space-y-4'>
        <p className='font-semibold text-white'>Payment Method</p>
        <div className='flex flex-row gap-4'>
          {/* Cash on Delivery Button */}
          <motion.button 
      whileHover={{scale:1.03}}
      whileTap={{scale:0.97}} 
            onClick={() => setPaymentMethod("cod")} 
            disabled={codDisable} 
            className={`flex-1 py-4 rounded-2xl font-semibold text-white transition-all 
              ${paymentMethod === "cod" ? "bg-[#2563eb]" : "bg-[#262626]"} 
              ${codDisable ? "opacity-40 cursor-not-allowed" : "hover:bg-zinc-700"}`}
          >
            Cash on Delivery
          </motion.button>

          {/* Stripe Button */}
          <motion.button 
      whileHover={{scale:1.03}}
      whileTap={{scale:0.97}}
            onClick={() => setPaymentMethod("stripe")} 
            className={`flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all 
              ${paymentMethod === "stripe" ? "bg-[#2563eb]" : "bg-[#262626]"} 
              text-white hover:bg-zinc-700`}
          >
            <div className='bg-[#63e6be] p-0.5 rounded'>
              <FaStripe className='text-2xl text-[#0a0a0a]' />
            </div>
            <span>Stripe</span>
          </motion.button>
        </div>
      </div>

      <motion.button 
      whileHover={{scale:1.03}}
      whileTap={{scale:0.97}}
      onClick={handlePlaceOrder}
      disabled={loading}
      className='text-white w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 py-4 rounded-2xl font-semibold text-lg transition'>
                {loading ? <ClipLoader size={20} color='white' /> : paymentMethod === "cod" ? "Place Order" : "Proceed to Secure Payment"}
      </motion.button>

      </div>

      </motion.div>

      {/* Virtual Stripe Modal */}
      {showVirtualStripe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-[#63e6be] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaStripe className="text-4xl text-[#0a0a0a]" />
                <span className="text-[#0a0a0a] font-bold text-lg">Test Mode</span>
              </div>
              <button onClick={() => setShowVirtualStripe(false)} className="text-[#0a0a0a] hover:text-gray-700 text-xl font-bold">
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-gray-500 text-sm">Amount due</p>
                <p className="text-3xl font-bold text-gray-900">₹ {finalCharge}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
                  <div className="border border-gray-300 rounded-md shadow-sm">
                    <div className="p-3 border-b border-gray-300 bg-gray-50 text-gray-500 text-sm font-mono tracking-widest">
                      4242 4242 4242 4242
                    </div>
                    <div className="flex bg-gray-50 text-gray-500 text-sm font-mono tracking-widest">
                      <div className="p-3 border-r border-gray-300 flex-1">
                        12 / 24
                      </div>
                      <div className="p-3 flex-1">
                        123
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Use any dummy card details for this virtual development test.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name on card</label>
                  <input type="text" value={name} readOnly className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700 focus:outline-none" />
                </div>
              </div>

              <button 
                onClick={handleVirtualPayment}
                disabled={loading}
                className="w-full bg-[#0a0a0a] text-white py-4 rounded-xl font-semibold text-lg hover:bg-black transition-all flex justify-center items-center gap-2"
              >
                {loading ? <ClipLoader size={20} color='white' /> : `Pay ₹${finalCharge}`}
              </button>
              
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-4">
                <span>🔒 Powered by</span>
                <span className="font-bold">Virtual Stripe (Dev Mode)</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Checkout
