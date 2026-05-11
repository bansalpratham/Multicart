import { auth } from "@/auth";
import AdminDashboard from "@/component/Admin/AdminDashboard";
import EditRoleandPhone from "@/component/EditRoleandPhone";
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import UserDashboard from "@/component/User/UserDashboard";
import EditVendorDetails from "@/component/Vendor/EditVendorDetails";
import VendorPage from "@/component/Vendor/VendorPage";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { redirect } from "next/navigation";
import React from "react";

export default async function Home() {
    await connectDb()
      const session = await auth()
      const user = await User.findById(session?.user?.id)
      if (!user)
      {
        redirect("/login")
      }

      const inComplete = !user.role || !user.phone || (!user.phone && user.role == "user")
      if (inComplete)
      {
        return <EditRoleandPhone/>
      }

      if (user?.role == "vendor")
      {
        const isCompleteDetails = !user.shopName || !user.shopAddress || !user.gstNumber
        if (isCompleteDetails)
{
  const plainUser = JSON.parse(JSON.stringify(user))

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      <Navbar user={plainUser} />
      <EditVendorDetails />
      <Footer user={plainUser} />
    </div>
  )
}
      }

      const plainUser = JSON.parse(JSON.stringify(user))

    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 font-sans flex-col">
        <Navbar user={plainUser} />
        {user?.role == "user" ? (<UserDashboard/> ): user?.role == "vendor" ? (<VendorPage user={plainUser} />) : (<AdminDashboard/>)}
        <Footer user={plainUser} />
      </div>
    )

}