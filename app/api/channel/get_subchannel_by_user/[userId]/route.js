import User from "@/model/User";
import mongoose from "mongoose";
import Channel from "@/model/Channel";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB.js";
import { StatusCodes } from "http-status-codes";

export async function GET(request, { params }) {
  try {
    const expectedURLKEY = process.env.CHANNEL_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList?.get("GET_CHANNEL_API_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();

      const { searchParams } = new URL(request?.url)
      const query = searchParams?.get("query")

      const userId = params?.userId;
      if (!userId || !mongoose.isValidObjectId(userId)) {
        return NextResponse.json(
          { Message: "Invalid request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const findUser = await User.findOne({ _id: userId });
      if (!findUser) {
        return NextResponse.json(
          { Message: "User not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }
      const subscribedChannelsIds = findUser?.subscribedChannels;

      let subscribedChannels;

      if (query) {
        subscribedChannels = await Channel.find({
          _id: { $in: subscribedChannelsIds },
          name: { $regex: query, $options: "i" },
        });
      } else {
        subscribedChannels = await Channel.find({
          _id: { $in: subscribedChannelsIds },
        });
      }

      if (!subscribedChannels || subscribedChannels?.length === 0) {
        return NextResponse.json({Message: "No subscribed channels found."}, {status: StatusCodes.NOT_FOUND})
      }

      return NextResponse.json(subscribedChannels, { status: StatusCodes.OK })
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
