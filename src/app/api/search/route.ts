import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category");

        const shop = searchParams.get("shop");


    const filter: any = {
      isActive: true,
      verificationStatus: "approved",
    };

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }

    /* CATEGORY FILTER */
    if (category && category !== "all") {
      filter.category = {
        $regex: `^${category}$`,
        $options: "i",
      };
    }

    if (shop && shop !== "all") {
      filter.vendpr = shop;
    }

    const products = await Product.find(filter).populate("vendor" , "shopName image").sort({createdAt:-1})

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `failed to find product in category section ${error}`,
      },
      { status: 500 }
    );
  }
}