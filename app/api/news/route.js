import News from "@/model/News.js";
import mongoose from "mongoose";
import Channel from "@/model/Channel";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/connectDB.js";
import { StatusCodes } from "http-status-codes";

export async function POST(request) {
  try {
    const expectedURLKEY = process.env.NEWS_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_NEWS_API_KEY");
    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const formData = await request?.formData();
      const title = formData?.get("title");
      const content = formData?.get("content");
      const channel = formData?.get("channel");
      const category = formData?.get("category");
      const image = formData?.get("image");

      if (!title) {
        return NextResponse.json(
          { Message: "Title is required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!content) {
        return NextResponse.json(
          { Message: "Content is required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!channel) {
        return NextResponse.json(
          { Message: "Channel is required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!category) {
        return NextResponse.json(
          { Message: "Category is required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!image) {
        return NextResponse.json(
          { Message: "Image is required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      if (!mongoose.isValidObjectId(channel)) {
        return NextResponse.json(
          { Message: "Invalid channel." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const findChannel = await Channel.findOne({ _id: channel });

      if (!findChannel) {
        return NextResponse.json(
          { Message: "Channel not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      if (findChannel.status === "inactive") {
        return NextResponse.json(
          { Message: "Channel is banned from posting news." },
          { status: StatusCodes.UNAUTHORIZED }
        );
      }

      if (
        category !== "Latest" &&
        category !== "Trending" &&
        category !== "International" &&
        category !== "Sport" &&
        category !== "Economics" &&
        category !== "Breaking"
      ) {
        return NextResponse.json(
          { Message: "Invalid category." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const bytes = await image?.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64String = buffer.toString("base64");

      const result = await cloudinary?.uploader?.upload(
        `data:image/png;base64,${base64String}`,
        {
          folder: "NewsImageNew",
        },
        (error, result) => {
          if (error) {
            return NextResponse.json(
              { Message: "Error adding new image." },
              { status: StatusCodes.CONFLICT }
            );
          }
        }
      );

      await News.create({
        title,
        content,
        channel,
        category,
        image: {
          public_id: result?.public_id,
          url: result?.secure_url,
        },
      });

      return NextResponse.json(
        { Message: "News is posted successfully." },
        { status: StatusCodes.CREATED }
      );
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

export async function GET(request) {
  try {
    const expectedURLKEY = process.env.NEWS_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_NEWS_API_KEY");
    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      const { searchParams } = new URL(request?.url);
      const category = searchParams?.get("category");
      const query = searchParams?.get("query");

      let findNews;

      if (
        category !== null &&
        category !== "" &&
        query !== null &&
        query !== ""
      ) {
        findNews = await News.find({
          category: category,
          $or: [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } },
          ],
        }).sort({ _id: -1 });
      } else if (category !== "" && category !== null) {
        findNews = await News.find({
          category: category,
        }).sort({ _id: -1 });
      } else if (query !== "" && query !== null) {
        findNews = await News.find({
          $or: [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } },
          ],
        }).sort({ _id: -1 });
      } else {
        findNews = await News.find().sort({ _id: -1 });
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
