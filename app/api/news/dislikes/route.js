import User from "@/model/User";
import News from "@/model/News.js";
import mongoose from "mongoose";
import { headers } from "next/headers";
import connectDB from "@/config/connectDB.js";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function PUT(request) {
  try {
    const expectedURLKEY = process.env.NEWS_UNLIKES_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_NEWS_UNLIKES_API_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const { newsId, userId } = await request?.json();

      if (!newsId || !mongoose.isValidObjectId(newsId)) {
        return NextResponse.json(
          { Message: "News required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!userId || !mongoose.isValidObjectId(userId)) {
        return NextResponse.json(
          { Message: "User required." },
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

      if (findNews.disliked_by.includes(userId)) {
        return NextResponse.json(
          { Message: "User has already disliked this NEWS." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      if (findNews.liked_by.includes(userId)) {
        await News.updateOne(
          { _id: newsId },
          { $pull: { liked_by: userId } },
          { new: true }
        );

        await News.updateOne(
          { _id: newsId },
          { $push: { disliked_by: userId } },
          { new: true }
        );

        findNews.likes -= 1;
        findNews.dislikes += 1;

        await findNews.save();

        return NextResponse.json(
          { Message: "News is liked by the user." },
          { status: StatusCodes.OK }
        );
      }

      findNews.disliked_by.push(userId);
      findNews.dislikes += 1;
      await findNews.save();

      return NextResponse.json(
        { Message: `${findUser?.username} has liked this NEWS.` },
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
