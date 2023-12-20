import { join } from "path";
import mongoose from "mongoose";
import User from "@/model/User";
import { unlink } from "fs/promises";
import { headers } from "next/headers";
import { writeFile } from "fs/promises";
import connectDB from "@/config/connectDB.js";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function GET(request, { params }) {
  try {
    const expectedURLKEY = process.env.USER_DETAIL_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_USER_API_DETAIL_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();

      const id = params?.Id;
      if (!id || !mongoose.isValidObjectId(id)) {
        return NextResponse.json(
          { Message: "Invalid request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const findUser = await User.findOne({ _id: id }).select("-password");
      if (!findUser) {
        return NextResponse.json(
          { Message: "User not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      return NextResponse.json(findUser, { status: StatusCodes.OK });
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
    const expectedURLKEY = process.env.USER_DETAIL_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_USER_API_DETAIL_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();

      const id = params?.Id;
      if (!id || !mongoose.isValidObjectId(id)) {
        return NextResponse.json(
          { Message: "Invalid request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const findUser = await User.findOne({ _id: id });
      if (!findUser) {
        return NextResponse.json(
          { Message: "User not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      const path = join(
        "./",
        "public",
        "MediaFolders",
        "UsersImg",
        findUser?.picture
      );

      try {
        await unlink(path);
      } catch (unlinkError) {
        return NextResponse.json(
          { Message: "Image path not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      await findUser.deleteOne({ _id: id });

      return NextResponse.json(
        { Message: `${findUser?.username} is deleted successfully.` },
        { status: StatusCodes.OK }
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

export async function PUT(request, { params }) {
  try {
    const expectedURLKEY = process.env.USER_DETAIL_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_USER_API_DETAIL_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();

      const id = params?.Id;
      if (!id || !mongoose.isValidObjectId(id)) {
        return NextResponse.json(
          { Message: "Invalid request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const findUser = await User.findOne({ _id: id });
      if (!findUser) {
        return NextResponse.json(
          { Message: "User not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      const formData = await request.formData();

      const first_name = formData.get("first_name");
      const middle_name = formData.get("middle_name");
      const last_name = formData.get("last_name");
      const username = formData.get("username");
      const email = formData.get("email");
      const role = formData.get("role");
      const status = formData.get("status");
      const picture = formData.get("picture");

      if (username) {
        const findUsername = await User.findOne({
          username: username,
          _id: { $ne: id },
        });
        if (findUsername) {
          return NextResponse.json(
            { Message: "Username already exists." },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
      }
      if (email) {
        const findEmail = await User.findOne({
          email: email,
          _id: { $ne: id },
        });
        if (findEmail) {
          return NextResponse.json(
            { Message: "Email already exists." },
            { status: StatusCodes?.BAD_REQUEST }
          );
        }
      }

      const updateFields = {};
      updateFields.first_name = first_name ? first_name : findUser.first_name;
      updateFields.middle_name = middle_name
        ? middle_name
        : findUser.middle_name;
      updateFields.last_name = last_name ? last_name : findUser.last_name;
      updateFields.username = username ? username : findUser.username;
      updateFields.email = email ? email : findUser.email;
      updateFields;
      updateFields.status = status ? status : findUser.status;

      if (role) {
        if (role !== "Admin" && role !== "Editor" && role !== "User") {
          return NextResponse.json(
            { Message: "Invalid role." },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        updateFields.role = role ? role : findUser.role;
      }
      if (picture) {
        if (
          typeof picture === "object" &&
          (picture?.type === "image/jpeg" ||
            picture?.type === "image/jpg" ||
            picture?.type === "image/png")
        ) {
          if (picture?.size > 1024 * 1024) {
            return NextResponse.json(
              {
                Message:
                  "Image size is too large. Please insert an image less than 1MB.",
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }
          const bytes = await picture?.arrayBuffer();
          const buffer = Buffer?.from(bytes);
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

          const newPath = join(
            "./",
            "public",
            "MediaFolders",
            "UsersImg",
            uniqueSuffix + "-" + picture?.name
          );

          const picName = uniqueSuffix + "-" + picture?.name;

          await writeFile(newPath, buffer);

          updateFields.picture = picture ? picName : findUser.picture;

          const path = join(
            "./",
            "public",
            "MediaFolders",
            "UsersImg",
            findUser?.picture
          );

          try {
            await unlink(path);
          } catch (unlinkError) {
            return NextResponse.json(
              { Message: "Image not found." },
              { status: StatusCodes.NOT_FOUND }
            );
          }
        } else if (typeof picture === "string") {
          const findPicture = await User.findOne({ picture: picture });
          if (findPicture) {
            updateFields.picture = findPicture.picture;
          }
        } else {
          return NextResponse.json(
            { Message: "Invalid format please try again. Only accepts '.jpeg', '.jpg', or '.png'." },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        { _id: id },
        updateFields,
        { new: true }
      );

      if (!updatedUser) {
        return NextResponse.json(
          { Message: "User not found." },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      return NextResponse.json(
        { Message: `${updatedUser?.username} is updated successfully.` },
        { status: StatusCodes.OK }
      );
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
