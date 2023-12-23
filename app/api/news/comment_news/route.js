import User from "@/model/User";
import mongoose from "mongoose";
import News from "@/model/News.js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB.js";
import { StatusCodes } from "http-status-codes";

export async function PUT(request) {
  try {
    const expectedURLKEY = process.env.NEWS_LIKES_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_NEWS_LIKES_API_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const { newsId, userId, text } = await request?.json();

      if (!newsId || !mongoose.isValidObjectId(newsId)) {
        return NextResponse.json(
          { Message: "Invalid NEWS request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      if (!userId || !mongoose.isValidObjectId(userId)) {
        return NextResponse.json(
          { Message: "Invalid user is request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      if (!text) {
        return NextResponse.json(
          { Message: "Comment is required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const findNews = await News.findOne({ _id: newsId });
      if (!findNews) {
        return NextResponse.json(
          { Message: "News not found" },
          { status: StatusCodes.NOT_FOUND }
        );
      }
      const findUser = await User.findOne({ _id: userId });
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

      findNews.comments.push({
        user: userId,
        text,
      });

      await findNews.save();

      return NextResponse.json(
        { Message: "Comment added successfully." },
        { status: StatusCodes.OK }
      );
    } else {
      const redirectUrl = new URL("/not-found", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Network error " + error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
