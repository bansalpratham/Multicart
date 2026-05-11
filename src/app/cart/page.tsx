'use client'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Page() {
    const [cart, setCart] = useState<any[]>([])
    const router = useRouter()

    const getCart = async () => {
        try {
            const result = await axios.get("/api/user/cart/get")
            // Filter out items where the product object is missing/null
            const validCart = (result.data.cart || []).filter((item: any) => item.product !== null)
            setCart(validCart)
        } catch (error) {
            console.log(error)
            alert("failed to get cart")
        }
    }

    useEffect(() => {
        getCart()
    }, [])

    if (cart.length === 0) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-white text-4xl'>
                Cart Empty
            </div>
        )
    }

    const handleUpdateCard = async (productId: string, quantity: number) => {
        try {
            await axios.post("/api/user/cart/update", { productId, quantity })
            getCart()
        } catch (error) {
            console.log(error)
            alert("failed to update quantity")
        }
    }

    const handleRemoveCard = async (productId: string) => {
        setCart((prev) => prev.filter((i) => i.product?._id !== productId))
        await axios.post("/api/user/cart/remove", { productId })
    }

    return (
        <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white p-6'>
            <div className='w-full max-w-4xl mx-auto space-y-4'>
                {cart.map((item, index) => (
                    <div key={index} className='bg-white/10 p-4 rounded-lg flex flex-col md:flex-row gap-4'>
                        {/* Added optional chaining to src and alt */}
                        <Image
                            alt={item.product?.title || "Product"}
                            width={80}
                            height={80}
                            src={item.product?.image1 || "/placeholder.png"} 
                            className='rounded'
                        />

                        <div className='flex-1'>
                            <h3 className='font-bold'>{item.product?.title || "Unknown Product"}</h3>
                            <p className='text-green-500'>₹ {item.product?.price || 0}</p>
                            <div className='flex gap-2 mt-2'>
                                <button onClick={() => handleUpdateCard(item.product?._id, item.quantity - 1)} className='border border-gray-600 px-2 rounded'>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleUpdateCard(item.product?._id, item.quantity + 1)} className='border border-gray-600 px-2 rounded'>+</button>
                            </div>
                            <div className='w-full flex flex-col md:flex-row md:items-center items-start justify-start gap-2 md:gap-4'>
                                <button onClick={() => router.push(`/checkout/${item.product?._id}`)} className='mt-3 text-nowrap bg-blue-600 px-4 py-2 rounded'>Checkout this product</button>
                                <button onClick={() => handleRemoveCard(item.product?._id)} className='mt-3 bg-red-200 text-red-500 px-4 py-2 rounded'>Remove</button>
                            </div>
                        </div>
                        <div className='font-bold'>
                            ₹ {(item.product?.price || 0) * item.quantity}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Page