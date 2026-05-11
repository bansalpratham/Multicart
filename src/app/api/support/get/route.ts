import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  try {

    await connectDb();

    const session = await auth();

    if (!session || !session.user?.id) {

      return NextResponse.json(
        {
          message: "Unauthorized User",
        },
        {
          status: 401,
        }
      );

    }

    const body = await req.json();

    const { withUserId } = body;

    if (!withUserId) {

      return NextResponse.json(
        {
          message: "withUserId is required",
        },
        {
          status: 400,
        }
      );

    }

    const user = await User.findById(session.user.id);

    if (!user) {

      console.log("User not found");

      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );

    }

    const chat = user.chats?.find(
      (c: any) =>
        String(c.with?._id || c.with) === String(withUserId)
    );

    return NextResponse.json(chat?.messages || []);

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        message: "Failed to get chat",
      },
      {
        status: 500,
      }
    );

  }

}