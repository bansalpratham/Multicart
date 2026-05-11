import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb()
        const product = await Product.find().populate("vendor" , "name email shopName").populate({
            path: "reviews.user" , 
            select: "name email image"
        }).sort({createdAt : -1})
    
            return NextResponse.json(product , {status: 200})

    } catch (error) {
       return NextResponse.json({
        message:`failed to getAllproducts ${error}`
       },{status: 500})
    }
}