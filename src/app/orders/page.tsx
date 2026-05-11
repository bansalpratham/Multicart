'use client'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { motion } from 'motion/react'
import useGetAllOrdersData from '@/hooks/useGetAllOrdersData'
import useGetCurrentUser from '@/hooks/useGetCurrentUser'
import { FiTruck, FiX } from 'react-icons/fi'
import { setAllOrdersData } from '@/redux/userSlice'
import axios from 'axios'

function Orders() {
  useGetAllOrdersData()
  useGetCurrentUser()
  
  const dispatch = useDispatch<AppDispatch>()
  
  const { userData } = useSelector((state: RootState) => state.user)
  const { allOrdersData } = useSelector((state: RootState) => state.user)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [trackOrderModel, setTrackOrderModel] = useState<any | null>(null)

  const orders = Array.isArray(allOrdersData) ?
    allOrdersData.filter((o) => String(o.buyer._id) === String(userData?._id)) : []

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

  const isCancelDisable = (order: any) => order.isPaid === true && order.paymentMethod === "stripe"

  const statusSteps = ["pending", "confirmed", "shipped", "delivered"];

  const renderTrackStep = (currentStatus: string) => {
    return (
      <div className='relative pl-2 mt-4'>
        {/* Vertical Line */}
        <div className='absolute top-0 left-3.75 w-px h-[calc(100%-24px)] bg-gray-600'></div>
        {statusSteps.map((s, i) => {
          const active = currentStatus === s;
          const currentIndex = statusSteps.indexOf(currentStatus);
          const isCompleted = statusSteps.indexOf(s) <= currentIndex;

          return (
            <div key={i} className='relative mb-6 flex items-center z-10'>
              {/* dot */}
              <div className={`w-4 h-4 rounded-full border-2 border-[#061526] ${isCompleted ? "bg-blue-500 shadow-lg shadow-blue-500/50" : "bg-gray-500"}`}></div>
              <div className={`ml-4 text-sm font-medium ${isCompleted ? "text-blue-400" : "text-gray-500"}`}>
                {s.toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleCancel = async (orderId: string) => {
    try {
      await axios.post("/api/order/cancelOrder", { orderId })
      
      const updatedOrder = allOrdersData.map((o: any) => 
        o._id === orderId ? { ...o, orderStatus: "cancelled" } : o
      )

      dispatch(setAllOrdersData(updatedOrder))
      alert("Order Cancelled")
      setSelectedOrder(null)
      
    } catch (error) {
      console.log(error)
      alert("Order Cancel error")
    }
  }

  const isEligibleReturn = (deliveryDate:string , replacementDays:number)=>{
        if (!deliveryDate || !replacementDays) return false;

      const deliveredAt = new Date(deliveryDate).getTime();
      const expiry = deliveredAt + replacementDays*24*60*60*1000;

      return Date.now() <= expiry;

  }

  const remainingDays = (deliveryDate:string , replacementDays:number)=>{
    if (!deliveryDate || !replacementDays) return 0;

      const deliveredAt = new Date(deliveryDate).getTime();
      const expiry = deliveredAt + replacementDays*24*60*60*1000;

    const diff = expiry - Date.now();
    if (diff<=0) return 0;

      return Math.ceil(diff/(24*60*60*1000));
  }

  const ReturnEndDate = (deliveryDate:string , replacementDays:number)=>{
    if (!deliveryDate || !replacementDays) return null;

      const deliveredAt = new Date(deliveryDate);
      deliveredAt.setDate(deliveredAt.getDate() + replacementDays);
      
      return deliveredAt;
  }

  const returnOrder = async (orderId:string) => {
    try {
     const result = await axios.post("/api/order/return" , {orderId})
      const updatedOrder = allOrdersData.map((o:any) => o._id === orderId ? {...o , orderStatus:"returned" , returnedAmount: result.data.returnedAmount }:o)
      dispatch(setAllOrdersData(updatedOrder))
      alert("Order returned")
      setSelectedOrder(null)
    } catch (error) {
      console.log(error)
      alert("Order returned error")
    }
  }

  return (
    <div className='min-h-screen p-6 bg-linear-to-br from-black via-gray-900 to-black text-white'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>My Orders</h1>
            <p className='text-sm text-gray-300'>All orders placed by you</p>
          </div>
          <div className='text-sm text-gray-300'>
            {orders.length} Orders
          </div>
        </div>

        {/* Desktop Device Table */}
        <div className='hidden lg:block bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-xl shadow-black/40'>
          <table className='w-full text-left'>
            <thead className='text-xs bg-white/5 border-b border-white/10 text-gray-300 uppercase tracking-wider'>
              <tr>
                <th className='px-4 py-4'>Order ID</th>
                <th className='px-4 py-4'>Date</th>
                <th className='px-4 py-4'>Products</th>
                <th className='px-4 py-4'>Vendor</th>
                <th className='px-4 py-4'>Payment</th>
                <th className='px-4 py-4'>Status</th>
                <th className='px-4 py-4 text-right'>Total</th>
                <th className='px-4 py-4 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length !== 0 ? (orders.map((order, index) => (
                <tr key={index} className='border-t border-white/5 hover:bg-white/10 transition-all duration-200'>
                  <td className='px-4 py-4 text-sm'>#{String(order._id).slice(-8)}</td>
                  <td className='px-4 py-4 text-sm'>{formatDate(String(order.createdAt))}</td>
                  <td className='px-4 py-4 text-sm'>{order.products.map((p: any, i: number) => (
                    <div key={i} className='text-gray-200'>
                      {p.product.title} * {p.quantity}
                    </div>
                  ))}</td>
                  <td className='px-4 py-4 text-sm'>{order.productVendor?.shopName || "N/A"}</td>
                  <td className='px-4 py-4 text-sm'>{order.paymentMethod.toUpperCase()}
                    <div className={`text-xs ${order.isPaid ? "text-green-300" : "text-yellow-300"}`}>
                      {order.isPaid ? "paid" : "pending"}
                    </div>
                  </td>
                  <td className='px-4 py-4 text-sm '>{order.orderStatus.toUpperCase()}</td>
                  <td className='px-4 py-4 text-right text-green-300 font-semibold'>₹{order.totalAmount}</td>
                  <td className='px-4 py-4'>
                    <div className='flex justify-center items-center gap-2'>
                      {order.orderStatus === "cancelled" ? (
                        <span className='text-red-400 font-semibold'>Cancelled</span>
                      ) : order.orderStatus === "returned" ? (
                        <span className='text-orange-400 font-semibold'>Returned <span className='text-nowrap text-white'>Returned Amount: {order.returnedAmount}</span> </span>
                      ) : (
                        <>
                          <button onClick={() => setSelectedOrder(order)} className='px-3 py-1 bg-white/10 rounded hover:bg-white/20 transition text-sm'>Check Details</button>
                          <button disabled={order.orderStatus === "delivered"} onClick={() => setTrackOrderModel(order)} className={`px-3 py-1 rounded flex items-center gap-2 transition text-sm text-nowrap ${order.orderStatus === "delivered" ? "bg-green-500/20 text-green-400 cursor-not-allowed" : "bg-white/10 hover:bg-white/20"} `} ><FiTruck /> {order.orderStatus === "delivered" ? "Delivered" : "Track Order"}</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td className='text-center text-gray-400 p-6' colSpan={8}>No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Device Cards */}
        <div className='lg:hidden space-y-4'>
          {orders.length !== 0 ? (
            orders.map((order, index) => (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                key={index} className='bg-white/5 border border-white/10 p-4 rounded-xl shadow-lg'>
                <div className='flex justify-between'>
                  <div>
                    <div className='text-sm text-gray-300'>#{String(order._id).slice(-8)}</div>
                    <div className='font-semibold'>{formatDate(String(order.createdAt))}</div>
                    <div className='text-sm text-gray-300 mt-1'>{order.productVendor?.shopName || "N/A"}</div>
                  </div>
                  <div className='text-green-300 font-bold text-right'>₹{order.totalAmount}</div>
                </div>
                <div className='mt-3 flex justify-between'>
                  <div>
                    <div className='text-xs text-gray-400'>Payment {order.paymentMethod.toUpperCase()}</div>
                    <div className={`text-sm font-semibold ${order.isPaid ? "text-green-400" : "text-yellow-400"}`}>{order.isPaid ? "paid" : "pending"}</div>
                  </div>
                  <div className='text-right'>
                    <div className='text-xs text-gray-400'>Status</div>
                    <div className='text-sm font-semibold'>{order.orderStatus.toUpperCase()}</div>
                  </div>
                </div>
                <div className='mt-3 space-y-1'>
                  {order.products.map((p: any, i: number) => (
                    <div key={i} className='text-gray-200 text-sm'>
                      {p.product.title} * {p.quantity}
                    </div>
                  ))}
                </div>
                <div className='mt-3 flex gap-2'>
                  {order.orderStatus === "cancelled" ? (
                    <span className='text-red-400 font-semibold'>Cancelled</span>
                  ) : order.orderStatus === "returned" ? (
                    <span className='text-orange-400 flex flex-col gap-1 font-semibold'>Returned <span className='text-nowrap text-white'>Returned Amount: {order.returnedAmount}</span> </span>
                  ) : (
                    <>
                      <button onClick={() => setSelectedOrder(order)} className='flex-1 py-2 bg-white/10 rounded'>Check Details</button>
                      <button disabled={order.orderStatus === "delivered"} onClick={() => setTrackOrderModel(order)} className={`flex-1 py-2 rounded flex items-center justify-center gap-2 transition text-nowrap ${order.orderStatus === "delivered" ? "bg-green-500/20 text-green-400 cursor-not-allowed" : "bg-white/10 hover:bg-white/20"} `} ><FiTruck /> {order.orderStatus === "delivered" ? "Delivered" : "Track"}</button>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className='text-center text-xl text-white bg-white/5 border border-white/10 p-4 rounded-xl'>No Orders found</motion.div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder &&
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm' onClick={() => setSelectedOrder(null)}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className='relative z-10 w-full max-w-2xl bg-[#061526] border border-white/10 p-6 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]'
          >
            <div className='flex justify-between items-center mb-2'>
              <h2 className='text-lg font-semibold'>Order Details: #{String(selectedOrder._id).slice(-8)}</h2>
              <button onClick={() => setSelectedOrder(null)} className='p-1 hover:bg-white/10 rounded-full'><FiX size={20} /></button>
            </div>
            <p className='text-sm text-gray-300'>{formatDate(String(selectedOrder.createdAt))}</p>
            <hr className='my-4 border-white/10' />

            <h3 className='font-semibold mb-2'>Products</h3>
            {selectedOrder.products.map((p: any, i: any) => (
              <div key={i} className='flex justify-between bg-white/5 p-3 rounded mb-2'>
                <div>
                  <div className='font-medium text-gray-100'>{p.product.title}</div>
                  <div className='text-xs text-gray-400'>Qty: {p.quantity} × Price: ₹{p.price}</div>
                </div>
              </div>
            ))}

            <hr className='my-4 border-white/10' />
            <h3 className='font-semibold mb-2'>Invoice</h3>
            <div className='text-sm space-y-1 text-gray-300'>
              <div className='flex justify-between'>
                <span>Product Total</span>
                <span>₹{selectedOrder.productsTotal}</span>
              </div>
              <div className='flex justify-between'>
                <span>Delivery Charge</span>
                <span>₹{selectedOrder.deliveryCharge}</span>
              </div>
              <div className='flex justify-between'>
                <span>Service Charge</span>
                <span>₹{selectedOrder.serviceCharge}</span>
              </div>
            </div>

            <hr className='my-4 border-white/10' />
            <div className='flex justify-between font-semibold text-green-300 text-lg'>
              <span>Final Total</span>
              <span>₹{selectedOrder.totalAmount}</span>
            </div>

            {selectedOrder.orderStatus === "delivered" && selectedOrder.deliveryDate && (
              <div className="mt-3 text-sm text-green-400 font-medium">
                Delivered on: {new Date(selectedOrder.deliveryDate).toLocaleDateString("en-IN")}
              </div>
            )}

            {selectedOrder.isPaid === true && selectedOrder.paymentMethod === "stripe" && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs rounded-lg p-3 mt-4">
                <p className="font-semibold mb-1">Important Note:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Order cancellation is <b>not available for Stripe payments</b>.</li>
                  <li>You can only <b>return the product</b> after delivery.</li>
                  <li>On return, you will receive only the <b>product amount</b>.</li>
                  <li><b>Delivery & service charges are non-refundable.</b></li>
                </ul>
              </div>
            )}

            <div className='mt-6 flex justify-end gap-3'>
              <button onClick={() => setSelectedOrder(null)} className='px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition'>Close</button>
              <button disabled={selectedOrder.orderStatus === "delivered"} onClick={() => setTrackOrderModel(selectedOrder)} className={`flex-1 py-2 rounded flex items-center justify-center gap-2 transition text-nowrap ${selectedOrder.orderStatus === "delivered" ? "bg-green-500/20 text-green-400 cursor-not-allowed" : "bg-white/10 hover:bg-white/20"} `} ><FiTruck /> {selectedOrder.orderStatus === "delivered" ? "Delivered" : "Track"}</button>
            {selectedOrder.orderStatus !== "delivered" ? (
  <button
    onClick={() => handleCancel(selectedOrder._id)}
    disabled={isCancelDisable(selectedOrder) || selectedOrder.orderStatus === "cancelled"}
    className={`px-4 py-2 rounded transition ${
      isCancelDisable(selectedOrder) || selectedOrder.orderStatus === "cancelled"
        ? "bg-white/10 text-gray-500 cursor-not-allowed"
        : "bg-red-600 hover:bg-red-700"
    }`}
  >
    Cancel Order
  </button>
) : (
  selectedOrder.products.map((p: any, i: number) => {

    const replacementDays = p.product.replacementDays || 0;
    const eligible = isEligibleReturn(selectedOrder.deliveryDate, replacementDays);
    const remaining = remainingDays(selectedOrder.deliveryDate, replacementDays);
    const returnEndDate = ReturnEndDate(selectedOrder.deliveryDate, replacementDays);

    return (
      <div key={i} className=" flex gap-1 md:flex-row flex-col items-center justify-between bg-white/5 px-3 py-2 rounded ml-2">
       <p className='text-xs text-gray-300'>
          {p.product.title}
       </p>

        {eligible ? (
          <>
          <p className='text-xs text-yellow-400'>
            Return available for {remaining} day
            {remaining > 1 ? "s" : ""}
          </p>
          {returnEndDate && (
            <p className='text-[11px] text-gray-400'>
              Return till:{" "}
              {returnEndDate.toLocaleDateString()}
            </p>
          )}
          </>
        ):(
<p className='text-xs text-red-400'>
            Return window closed
</p>
        )}

{eligible && (
  <button 
  onClick={()=>returnOrder(selectedOrder._id)}
  
  className='mx-3 px-3 py-1 bg-yellow-600 rounded text-sm'>
  Return
  </button>
)}
      </div>


    );
  })
)}
            </div>
          </motion.div>
        </div>
      }
      

      {/* Track Order Modal */}
      {trackOrderModel && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm' onClick={() => setTrackOrderModel(null)}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className='relative z-10 w-full max-w-md bg-[#061526] border border-white/10 p-6 rounded-xl shadow-2xl space-y-4' >
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>Track Order</h2>
              <button onClick={() => setTrackOrderModel(null)} className='p-1 hover:bg-white/10 rounded-full'><FiX size={20} /></button>
            </div>
            
            <div className='text-sm text-gray-300 space-y-2 leading-relaxed bg-white/5 p-4 rounded-lg'>
              <h4 className='text-md font-semibold text-white mb-2'>Delivery Address</h4>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Buyer:</span>
                <span className='text-gray-100'>{trackOrderModel.address.name}</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-gray-400'>Address:</span>
                <span className='text-gray-100'>{trackOrderModel.address.address}, {trackOrderModel.address.city} - {trackOrderModel.address.pincode}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Mobile:</span>
                <span className='text-gray-100'>{trackOrderModel.address.phone}</span>
              </div>
            </div>

            {renderTrackStep(trackOrderModel.orderStatus)}

            <div className='pt-4'>
              <button onClick={() => setTrackOrderModel(null)} className='w-full px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition'>Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Orders;