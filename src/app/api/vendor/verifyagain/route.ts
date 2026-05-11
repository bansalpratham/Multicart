import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { shopName, shopAddress, gstNumber } = await req.json()

         if (!shopName || !shopAddress || !gstNumber) {
            return NextResponse.json({
                message: "All fields are required"
            }, { status: 400 })
        }

        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({
                message: "Unauthorized access"
            }, { status: 401 })
        }

       const UpdatedVendor = await User.findOneAndUpdate(
    { _id: session?.user?.id }, {
            shopName,
            shopAddress,
            gstNumber,
            verificationStatus: "pending",
            requestAt: new Date(),
            rejectedReason: null,
            isApproved: false
        }, { new: true })

        if (!UpdatedVendor) {
            return NextResponse.json({
                message: "Vendor is not found"
            }, { status: 400 })
        }

        return NextResponse.json({
            message: "Vendor Again successfully", UpdatedVendor
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: `Verify Again error ${error}`
        }, { status: 500 })
    }
}