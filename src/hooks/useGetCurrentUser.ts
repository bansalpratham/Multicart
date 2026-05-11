'use client'
import { AppDispatch } from '@/redux/store'
import { setUserData } from '@/redux/userSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSession } from 'next-auth/react'

function useGetCurrentUser() {
    const dispatch = useDispatch<AppDispatch>()
    const { status } = useSession()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get("/api/user/currentUser", {
                    withCredentials: true
                })
                dispatch(setUserData(result.data.user))
            } catch (error) {
                console.log(error)
                dispatch(setUserData(null))
            }
        }

        if (status === "authenticated") {
            fetchUser()
        }

    }, [dispatch, status])
}

export default useGetCurrentUser