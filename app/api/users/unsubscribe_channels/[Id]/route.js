import User from "@/model/User";
import mongoose from "mongoose";
import Channel from "@/model/Channel";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB.js";
import { StatusCodes } from "http-status-codes";

export async function PUT(request, { params }) {
  try {
    const expectedURLKEY = process.env.SUBSCRIBERS_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_SUBSCRIBERS_API_KEY");
    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const id = params?.Id;
      if (!id || !mongoose.isValidObjectId(id)) {
        return NextResponse.json(
          { Message: "Invalid request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const findUser = await User.findOne({ _id: id });
      if (!findUser) {
        return NextResponse.json(
          { Message: "User not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      if (findUser.status === "inactive") {
        return NextResponse.json(
          { Message: "This user is banned from the system." },
          { status: StatusCodes.UNAUTHORIZED }
        );
      }

      const { subscribedChannels } = await request.json();

      if (
        !subscribedChannels ||
        !mongoose.isValidObjectId(subscribedChannels)
      ) {
        return NextResponse.json(
          { Message: "Invalid request" },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      const findChannel = await Channel.findOne({ _id: subscribedChannels });
      if (!findChannel) {
        return NextResponse.json(
          { Message: "Channel not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      if (findUser.subscribedChannels.includes(subscribedChannels)) {
        await User.updateOne(
          { _id: id },
          { $pull: { subscribedChannels: subscribedChannels } },
          { new: true }
        );

        findChannel.subscribers -= 1;
        await findChannel.save();

        return NextResponse.json(
          { Message: "Channel is unsubscribed." },
          { status: StatusCodes.OK }
        );
      } else {
        return NextResponse.json(
          { Message: "Channel is not unsubscribed." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
    } else {
      const redirectUrl = new URL("/not-found", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Network error " + error?.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
