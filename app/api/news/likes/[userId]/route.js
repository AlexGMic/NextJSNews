import User from "@/model/User";
import News from "@/model/News";
import mongoose from "mongoose";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import { StatusCodes } from "http-status-codes";

export async function GET(request, { params }) {
  try {
    const expectedURLKEY = process.env.NEWS_LIKES_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_NEWS_LIKES_API_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();

      const { searchParams } = new URL(request?.url);
      const category = searchParams?.get("category");
      const query = searchParams?.get("query");

      const userId = params?.userId;
      if (!userId || !mongoose.isValidObjectId(userId)) {
        return NextResponse.json(
          { Message: "User required." },
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
      if (findUser.status === "inactive") {
        return NextResponse.json(
          { Message: "This user is banned from the system." },
          { status: StatusCodes.UNAUTHORIZED }
        );
      }

      let findNews;

      if (
        category !== null &&
        category !== "" &&
        query !== null &&
        query !== ""
      ) {
        findNews = await News.find({
          liked_by: userId,
          category: category,
          $or: [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } },
          ],
        }).sort({ _id: -1 });
      } else if (category !== "" && category !== null) {
        findNews = await News.find({
          liked_by: userId,
          category: category,
        }).sort({ _id: -1 });
      } else if (query !== "" && query !== null) {
        findNews = await News.find({
          liked_by: userId,
          $or: [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } },
          ],
        }).sort({ _id: -1 });
      } else {
        findNews = await News.find({ liked_by: userId }).sort({ _id: -1 });
      }

      if (!findNews || findNews?.length === 0) {
        return NextResponse.json(
          { Message: "News not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      return NextResponse.json(findNews, { status: StatusCodes.OK });
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
