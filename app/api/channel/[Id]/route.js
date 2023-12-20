import { join } from "path";
import mongoose from "mongoose";
import { unlink } from "fs/promises";
import Channel from "@/model/Channel";
import { headers } from "next/headers";
import { writeFile } from "fs/promises";
import connectDB from "@/config/connectDB.js";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function GET(request, { params }) {
  try {
    const expectedURLKEY = process.env.CHANNEL_DETAIL_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_CHANNEL_DETAIL_API_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const id = params?.Id;
      if (!id || !mongoose.isValidObjectId(id)) {
        return NextResponse.json(
          { Message: "Invalid request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const findChannel = await Channel.findOne({ _id: id });
      if (!findChannel) {
        return NextResponse.json(
          { Message: "Channel not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }
      return NextResponse.json(findChannel, { status: StatusCodes.OK });
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

export async function DELETE(request, { params }) {
  try {
    const expectedURLKEY = process.env.CHANNEL_DETAIL_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_CHANNEL_DETAIL_API_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const id = params?.Id;
      if (!id || !mongoose.isValidObjectId(id)) {
        return NextResponse.json(
          { Message: "Invalid request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const findChannel = await Channel.findOne({ _id: id });
      if (!findChannel) {
        return NextResponse.json(
          { Message: "Channel not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      const path = join(
        "./",
        "public",
        "MediaFolders",
        "ChannelLogo",
        findChannel?.logo
      );

      try {
        await unlink(path);
      } catch (unlinkError) {
        return NextResponse.json(
          { Message: "Image not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      await findChannel.deleteOne({ _id: id });

      return NextResponse.json({
        Message: `${findChannel?.name?.toUpperCase()} is deleted successfully.`,
      });
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

export async function PUT(request, { params }) {
  try {
    const expectedURLKEY = process.env.CHANNEL_DETAIL_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_CHANNEL_DETAIL_API_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const id = params?.Id;
      if (!id || !mongoose.isValidObjectId(id)) {
        return NextResponse.json(
          { Message: "Invalid request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const findChannel = await Channel.findOne({ _id: id });
      if (!findChannel) {
        return NextResponse.json(
          { Message: "Channel not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      const formData = await request.formData();
      const name = formData.get("name");
      const code_name = formData.get("code_name");
      const logo = formData.get("logo");
      const status = formData.get("status");

      const updatedFields = {};

      if (name) {
        const checkName = name?.toLowerCase();
        const findName = await Channel.findOne({ name: checkName });
        if (findName) {
          return NextResponse.json(
            { Message: "Channel name already exists." },
            { status: StatusCodes.CONFLICT }
          );
        }
        updatedFields.name = name ? checkName : findChannel?.name;
      }

      if (code_name) {
        const checkCodeName = code_name?.toLowerCase();
        const findCodeName = await Channel.findOne({
          code_name: checkCodeName,
        });
        if (findCodeName) {
          return NextResponse.json(
            {
              Message: "Channel code name already exists.",
            },
            { status: StatusCodes.CONFLICT }
          );
        }
        updatedFields.code_name = code_name
          ? checkCodeName
          : findChannel?.code_name;
      }

      if (logo) {
        const path = join(
          "./",
          "public",
          "MediaFolders",
          "ChannelLogo",
          findChannel?.logo
        );

        try {
          await unlink(path);
        } catch (unlinkError) {
          return NextResponse.json(
            { Message: "Image not found." },
            { status: StatusCodes.NOT_FOUND }
          );
        }

        const bytes = await logo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

        const newPath = join(
          "./",
          "public",
          "MediaFolders",
          "ChannelLogo",
          uniqueSuffix + "-" + logo?.name
        );

        const logoName = uniqueSuffix + "-" + logo?.name;

        await writeFile(newPath, buffer);

        updatedFields.logo = logo ? logoName : findChannel?.logo;
      }

      if (status !== "active" && status !== "inactive") {
        updatedFields.status = status ? status : findChannel?.status;
      }

      const updateChannel = await Channel.findByIdAndUpdate(
        { _id: id },
        updatedFields,
        { new: true }
      );

      if (!updateChannel) {
        return NextResponse.json(
          { Message: "Channel not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      return NextResponse.json(
        {
          Message: `${updateChannel?.name?.toUpperCase()} is updated successfully.`,
        },
        { status: StatusCodes.OK }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Network error " + error?.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
