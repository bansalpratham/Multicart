import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/model/user.model";

export async function POST(req: NextRequest) {

  try {

    await connectDb();

    const session = await auth();

    if (!session || !session.user?.id) {

      return NextResponse.json(
        {
          message: "Unauthorized User"
        },
        {
          status: 401
        }
      );

    }

    const senderId = session.user.id;

    const body = await req.json();

    const { receiverId, text } = body;

    if (!receiverId || !text || !text.trim()) {

      return NextResponse.json(
        {
          message: "receiverId and text required"
        },
        {
          status: 400
        }
      );

    }

    const senderObjectId = new mongoose.Types.ObjectId(senderId);

    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    const newMessage = {
      sender: senderObjectId,
      text,
      createdAt: new Date(),
    };

    // ================== SENDER ==================

    const senderChat = await User.findOne({
      _id: senderObjectId,
      "chats.with": receiverObjectId,
    });

    if (senderChat) {

      const updateSender = await User.updateOne(
        {
          _id: senderObjectId,
          "chats.with": receiverObjectId,
        },
        {
          $push: {
            "chats.$.messages": newMessage,
          },
        }
      );

    } else {

      const createSenderChat = await User.updateOne(
        {
          _id: senderObjectId,
        },
        {
          $push: {
            chats: {
              with: receiverObjectId,
              messages: [newMessage],
            },
          },
        }
      );

    }

    // ================== RECEIVER ================

    const receiverChat = await User.findOne({
      _id: receiverObjectId,
      "chats.with": senderObjectId,
    });

    if (receiverChat) {

      const updateReceiver = await User.updateOne(
        {
          _id: receiverObjectId,
          "chats.with": senderObjectId,
        },
        {
          $push: {
            "chats.$.messages": newMessage,
          },
        }
      );

    } else {

      const createReceiverChat = await User.updateOne(
        {
          _id: receiverObjectId,
        },
        {
          $push: {
            chats: {
              with: senderObjectId,
              messages: [newMessage],
            },
          },
        }
      );

    }

    return NextResponse.json(
      {
        success: true,
        message: newMessage
      }
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        message: "Server error"
      },
      {
        status: 500
      }
    );

  }

}