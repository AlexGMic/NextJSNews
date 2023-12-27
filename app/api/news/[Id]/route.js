import { join } from "path";
import mongoose from "mongoose";
import News from "@/model/News.js";
import { unlink } from "fs/promises";
import Channel from "@/model/Channel";
import { headers } from "next/headers";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import cloudinary from "@/config/cloudinary";
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

      findNews.views += 1;
      await findNews.save();

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

      const existingPublicId = findNews?.image?.public_id;

      if (!existingPublicId) {
        return NextResponse.json(
          { Message: "Image not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }
      const deletionResult = await cloudinary?.uploader?.destroy(
        existingPublicId,
        {
          folder: "NewsImageNew",
        },
        (error, result) => {
          if (error) {
            return NextResponse.json(
              { Message: "Error removing image." },
              { status: StatusCodes.CONFLICT }
            );
          }
        }
      );
      if (deletionResult?.result !== "ok") {
        return NextResponse.json(
          { Message: "Error removing the image." },
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
        if (
          typeof image === "object" &&
          (image?.type === "image/jpeg" ||
            image?.type === "image/jpg" ||
            image?.type === "image/png")
        ) {
          if (image?.size > 1024 * 1024) {
            return NextResponse.json(
              {
                Message:
                  "Image size is too large. Please insert an image less than 1MB.",
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }
        } else {
          return NextResponse.json(
            {
              Message:
                "Invalid format please try again. Only accepts '.jpeg', '.jpg', or '.png'.",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        const bytes = await image?.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = buffer.toString("base64");

        const existingPublicId = findNews?.image?.public_id;

        if (!existingPublicId) {
          return NextResponse.json(
            { Message: "Image not found." },
            { status: StatusCodes.NOT_FOUND }
          );
        }
        const deletionResult = await cloudinary?.uploader?.destroy(
          existingPublicId,
          {
            folder: "NewsImageNew",
          },
          (error, result) => {
            if (error) {
              return NextResponse.json(
                { Message: "Error removing existing image." },
                { status: StatusCodes.CONFLICT }
              );
            }
          }
        );
        if (deletionResult?.result !== "ok") {
          return NextResponse.json(
            { Message: "Error updating the image." },
            { status: StatusCodes.NOT_FOUND }
          );
        }

        const newResult = await cloudinary?.uploader?.upload(
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

        updatedFields.image = {};

        updatedFields.image.public_id = newResult?.public_id;
        updatedFields.image.url = newResult?.secure_url;
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
