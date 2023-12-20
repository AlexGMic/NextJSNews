import News from "@/model/News.js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB.js";
import { StatusCodes } from "http-status-codes";

export async function GET(request, { params }) {
  try {
    const expectedURLKEY = process.env.NEWS_DETAIL_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_NEWS_DETAIL_API_KEY");
    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const categoryId = params?.categoryId;
      const findLatestNews = await News.find({ category: categoryId }).sort({
        _id: -1,
      });
      if (!findLatestNews || findLatestNews.length === 0) {
        return NextResponse.json(
          { Message: "News not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }
      let findLatest;
      if (findLatestNews?.length >= 6) {
        findLatest = findLatestNews.slice(0, 6);
      } else {
        findLatest = findLatestNews.slice(0, findLatestNews?.length);
      }
      return NextResponse.json(findLatest, { status: StatusCodes.OK });
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
