import { join } from "path";
import { hash } from "bcrypt";
import User from "@/model/User";
import { headers } from "next/headers";
import { writeFile } from "fs/promises";
import connectDB from "@/config/connectDB.js";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function POST(request) {
  try {
    const expectedURLKEY = process.env.USER_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_USER_API_KEY");
    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      const formData = await request.formData();
      const first_name = formData.get("first_name");
      const middle_name = formData.get("middle_name");
      const last_name = formData.get("last_name");
      const username = formData.get("username");
      const email = formData.get("email");
      const password = formData.get("password");
      const role = formData.get("role");
      const picture = formData.get("picture");

      if (!first_name) {
        return NextResponse.json(
          { Message: "First name required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!middle_name) {
        return NextResponse.json(
          { Message: "Middle name required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!last_name) {
        return NextResponse.json(
          { Message: "Last name required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!username) {
        return NextResponse.json(
          { Message: "Username required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!email) {
        return NextResponse.json(
          { Message: "Email required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!password) {
        return NextResponse.json(
          { Message: "Password required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!role) {
        return NextResponse.json(
          { Message: "Role required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!picture || picture?.toString() === "null" || picture === "") {
        return NextResponse.json(
          { Message: "Picture required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      await connectDB();

      const findUser = await User.findOne({ username: username });
      if (findUser) {
        return NextResponse.json(
          { Message: "Username already exist." },
          { status: StatusCodes.CONFLICT }
        );
      }

      const findEmail = await User.findOne({ email: email });
      if (findEmail) {
        return NextResponse.json(
          { Message: "Email already exist." },
          { status: StatusCodes.CONFLICT }
        );
      }

      if (role !== "Admin" && role !== "Editor" && role !== "User") {
        return NextResponse.json(
          { Message: "Invalid role." },
          { status: StatusCodes.CONFLICT }
        );
      }

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
      } else {
        return NextResponse.json(
          {
            Message:
              "Invalid format please try again. Only accepts '.jpeg', '.jpg', or '.png'.",
          },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const bytes = await picture?.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

      const path = join(
        "./",
        "public",
        "MediaFolders",
        "UsersImg",
        uniqueSuffix + "-" + picture?.name
      );

      const picName = uniqueSuffix + "-" + picture?.name;

      await writeFile(path, buffer);

      const hashedPwd = await hash(password, 10);

      const createUser = await User.create({
        first_name,
        middle_name,
        last_name,
        username,
        email,
        password: hashedPwd,
        role,
        picture: picName,
      });

      return NextResponse.json(
        { Message: `${createUser?.username} is created successfully.` },
        { status: StatusCodes.CREATED }
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

export async function GET(request) {
  try {
    const expectedURLKEY = process.env.USER_API_KEY;

    const headerList = headers();
    const actualURLKEY = headerList.get("GET_USER_API_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const findUser = await User.find().select("-password");
      if (!findUser) {
        return NextResponse.json(
          { Message: "Users not found." },
          { status: StatusCodes.NO_CONTENT }
        );
      }
      return NextResponse.json(findUser, { status: StatusCodes.OK });
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
