'use client'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import useGetAllOrdersData from '@/hooks/useGetAllOrdersData'
import { motion } from 'framer-motion'
import Image from 'next/image'

function UserOrders() {
  useGetAllOrdersData()

  const { allOrdersData } = useSelector((state: RootState) => state.user)

  const formatDate = (date: string) => {
    if (!date) return;
    const d = new Date(date)
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className='w-full px-3 sm:px-6 lg:px-10 py-6 text-white'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold'>Vendor Orders</h1>
        <p className='text-gray-300'>{allOrdersData.length} Orders</p>
      </div>
      
      {/* desktop table - Matched to image_fa46ef.png columns */}
      <div className='hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead className='bg-white/10'>
            <tr>
              <th className='p-4'>OrderId</th>
              <th className='p-4'>Buyer</th>
              <th className='p-4'>Vendor</th>
              <th className='p-4'>Product</th>
              <th className='p-4'>Amount</th>
              <th className='p-4'>Payment</th>
              <th className='p-4 text-center'>Status</th>
              <th className='p-4 text-center'>Date</th>
            </tr>
          </thead>
          <tbody>
            {allOrdersData.length === 0 ? (
              <tr>
                <td colSpan={7} className='p-6 text-center text-gray-400'>No Orders found</td>
              </tr>
            ) : (
              allOrdersData.map((order, index) => (
                <tr key={index} className='border-t border-white/10 hover:bg-white/5' >
                  <td className='p-4'>#{String(order._id).slice(-8)}</td>
                  <td className='p-4'>
                    {order.address?.name}
                    <div className='text-xs text-gray-400'>{order.address?.phone}</div>
                  </td>
                  <td className='p-4'>{order.productVendor?.shopName}</td>
                  <td className='p-4'>
                    {order.products.map((p: any, i: number) => (
                      <div key={i} className='text-sm'>
                        {p.product?.title || "Deleted Product"} x {p.quantity}
                      </div>
                    ))}
                  </td>
                  <td className='p-4'>
                    {order.paymentMethod?.toUpperCase()}
                    <div className='text-xs text-gray-400'>{order.isPaid ? "Paid" : "Pending"}</div>
                  </td>
                  <td className='p-4 capitalize'>{order.orderStatus}</td>
                  <td className='p-4 text-center'>
                    {/* Update Column Content matched to your original status logic */}
                    {order.orderStatus === "cancelled" && <span className="text-red-400 font-semibold capitalize">Cancelled</span>}
                    {order.orderStatus === "confirmed" && <span className="text-indigo-300 font-semibold capitalize">Confirmed</span>}
                   {order.orderStatus === "pending" && <span className="text-indigo-300 font-semibold capitalize">Pending</span>}
                    {order.orderStatus === "shipped" && <span className="text-indigo-300 font-semibold capitalize">Shipped</span>}
                    {order.orderStatus === "delivered" && <span className="text-green-400 font-semibold capitalize">Delivered</span>}
                    {order.orderStatus === "returned" && <span className="text-orange-400 font-semibold capitalize">Returned</span>}
                  </td>

                    <td className='p-4'>
                    {formatDate(String(order.createdAt))}
                    </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile view - Matched to card layout in image_fa46d2.jpg */}
      <div className='md:hidden flex flex-col gap-6'>
        {allOrdersData.length === 0 ? (
          <div className='text-center text-gray-400 mt-10'>No Orders found</div>
        ) : (
          allOrdersData.map((order, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-xl'
            >
              <div className='relative w-full h-40 bg-black'>
                {order.productVendor?.image ? (
                  <Image src={order.productVendor.image} alt='shop' fill className='object-cover opacity-60' />
                ) : (
                  <div className='flex items-center justify-center h-full text-gray-500'>No image found</div>
                )}
                <div className='absolute bottom-3 left-4'>
                   <h2 className='font-bold text-lg leading-tight'>{order.productVendor?.shopName}</h2>
                   <p className='text-xs text-gray-300'>#{String(order._id).slice(-8)}</p>
                </div>
              </div>

              <div className='p-4 space-y-3'>
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='text-xs text-gray-400 uppercase tracking-wider'>Buyer</p>
                    <p className='font-medium'>{order.address?.name}</p>

                <p className='font-medium'><b>Vendor:</b>{order.productVendor.shopName}</p>

                  </div>
                  <div className='text-right'>
                    <p className='text-xs text-gray-400 uppercase tracking-wider'>Amount</p>
                    <p className='text-green-400 font-bold'>₹{order.totalAmount}</p>
                  </div>
                </div>

                <div>
                  <p className='text-xs text-gray-400 uppercase tracking-wider mb-1'>Items</p>
                  <div className='bg-white/5 rounded-lg p-2'>
                    {order.products.map((p: any, i: number) => (
                      <p key={i} className='text-sm'>
                        {p.product?.title || "Deleted Product"} <span className='text-gray-500 font-bold'>×{p.quantity}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className='flex justify-between items-center pt-2 border-t border-white/10'>
                  <div className='text-sm'>
                    {order.orderStatus === "cancelled" && <span className="text-red-400 font-semibold capitalize">Cancelled</span>}
                    {order.orderStatus === "delivered" && <span className="text-green-400 font-semibold capitalize">Delivered</span>}
                    {order.orderStatus === "returned" && <span className="text-orange-400 font-semibold capitalize">Returned</span>}
                      {order.orderStatus === "shipped" && <span className="text-orange-400 font-semibold capitalize">Shipped</span>}
                        {order.orderStatus === "confirmed" && <span className="text-orange-400 font-semibold capitalize">Confirmed</span>}
                          {order.orderStatus === "pending" && <span className="text-orange-400 font-semibold capitalize">Pending</span>}
                  </div>
                  <div>{formatDate(String(order.createdAt))}</div>
                  <div className='text-xs px-2 py-1 bg-white/10 rounded uppercase'>
                    {order.paymentMethod}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default UserOrders