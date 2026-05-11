'use client'
import { AppDispatch } from '@/redux/store'
import { setAllProductsData, setAllVendorsData } from '@/redux/vendorSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

function useGetAllProducts() {
    const dispatch = useDispatch<AppDispatch>()
useEffect(() => {
    const fetchAllVendor = async () => {

        try {
            const result = await axios.get("/api/vendor/allProduct")
            dispatch(setAllProductsData(result.data))
        } catch (error) {
            dispatch(setAllProductsData([]))
        }
    }

    fetchAllVendor()
}, [dispatch])
}

export default useGetAllProducts
