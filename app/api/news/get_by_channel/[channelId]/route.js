import mongoose from "mongoose";
import News from "@/model/News.js";
import Channel from "@/model/Channel";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB.js";
import { StatusCodes } from "http-status-codes";

export async function GET(request, { params }) {
  try {
    const expectedURLKEY = process.env.NEWS_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_NEWS_API_KEY");
    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const channelId = params?.channelId;
      if (!channelId || !mongoose.isValidObjectId(channelId)) {
        return NextResponse.json(
          { Message: "Invalid request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const findNewChannel = await Channel.findOne({ _id: channelId });
      if (!findNewChannel) {
        return NextResponse.json(
          { Message: "Channel not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      const findChannelNews = await News.find({ channel: channelId });
      if (!findChannelNews) {
        return NextResponse.json(
          { Message: "No news available" },
          { status: StatusCodes.NOT_FOUND }
        );
      }
      return NextResponse.json(findChannelNews, { status: StatusCodes.OK });
    } else {
      const redirectUrl = new URL("/not-found", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Network error " },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
