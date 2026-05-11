'use client'
import React from 'react'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import useGetAllVendors from './hooks/useGetAllVendors'
import useGetAllProducts from './hooks/useGetAllProducts'
import useGetAllOrdersData from './hooks/useGetAllOrdersData'


function InitUser() {
  useGetCurrentUser()
  useGetAllVendors()
  useGetAllProducts()
  useGetAllOrdersData()
  return null
}

export default InitUser
