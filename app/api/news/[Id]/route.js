import { join } from "path";
import News from "@/model/News.js";
import mongoose from "mongoose";
import { unlink } from "fs/promises";
import Channel from "@/model/Channel";
import { headers } from "next/headers";
import { writeFile } from "fs/promises";
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
      const id = params?.Id;
      if (!id || !mongoose.isValidObjectId(id)) {
        return NextResponse.json(
          { Message: "Invalid request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const findNews = await News.findOne({ _id: id });
      if (!findNews) {
        return NextResponse.json(
          { Message: "News not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      findNews.views += 1
      await findNews.save()

      return NextResponse.json(findNews, { status: StatusCodes.OK });
    } else {
      const redirectUrl = new URL("/not-found", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Network error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const expectedURLKEY = process.env.NEWS_DETAIL_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_NEWS_DETAIL_API_KEY");
    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const id = params?.Id;
      if (!id || !mongoose.isValidObjectId(id)) {
        return NextResponse.json(
          { Message: "Invalid request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const findNews = await News.findOne({ _id: id });
      if (!findNews) {
        return NextResponse.json(
          { Message: "News not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      const path = join(
        "./",
        "public",
        "MediaFolders",
        "ChannelLogo",
        findNews?.image
      );

      try {
        await unlink(path);
      } catch (unlinkError) {
        return NextResponse.json(
          { Message: "Image path not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      await findNews.deleteOne({ _id: id });

      return NextResponse.json(
        { Message: "News deleted successfully." },
        { status: StatusCodes.OK }
      );
    } else {
      const redirectUrl = new URL("/not-found", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Network error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const expectedURLKEY = process.env.NEWS_DETAIL_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_NEWS_DETAIL_API_KEY");
    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const id = params?.Id;
      if (!id || !mongoose.isValidObjectId(id)) {
        return NextResponse.json(
          { Message: "Invalid request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const findNews = await News.findOne({ _id: id });
      if (!findNews) {
        return NextResponse.json(
          { Message: "News not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }
      const formData = await request.formData();
      const title = formData.get("title");
      const content = formData.get("content");
      const channel = formData.get("channel");
      const category = formData.get("category");
      const image = formData.get("image");

      const updatedFields = {};

      updatedFields.title = title ? title : findNews?.title;
      updatedFields.content = content ? content : findNews?.content;

      if (channel) {
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
        updatedFields.channel = channel ? channel : findNews?.channel;
      }

      if (category) {
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
        updatedFields.category = category ? category : findNews?.category;
      }

      if (image) {
        const path = join(
          "./",
          "public",
          "MediaFolders",
          "ChannelLogo",
          findNews?.image
        );

        try {
          await unlink(path);
        } catch (unlinkError) {
          return NextResponse.json(
            { Message: "Image not found." },
            { status: StatusCodes.NOT_FOUND }
          );
        }

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

        const newPath = join(
          "./",
          "public",
          "MediaFolders",
          "ChannelLogo",
          uniqueSuffix + "-" + image?.name
        );

        const imageName = uniqueSuffix + "-" + image?.name;

        await writeFile(newPath, buffer);

        updatedFields.image = image ? imageName : findNews?.image;
      }

      const updatedNews = await News.findByIdAndUpdate(
        { _id: id },
        updatedFields,
        { new: true }
      );

      if (!updatedNews) {
        return NextResponse.json(
          { Message: "News not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      return NextResponse.json(
        { Message: "News updated successfully." },
        { status: StatusCodes.OK }
      );
    } else {
      const redirectUrl = new URL("/not-found", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Network error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
