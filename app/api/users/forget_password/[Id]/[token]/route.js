import { hash } from "bcrypt";
import User from "@/model/User";
import mongoose from "mongoose";
import { verify } from "jsonwebtoken";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB.js";
import { StatusCodes } from "http-status-codes";

export async function PUT(request, { params }) {
  try {
    const expectedURLKEY = process.env.USER_API_KEY;

    const headerList = headers();
    const actualURLKEY = headerList.get("GET_USER_API_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();

      const id = params?.Id;
      const token = params?.token;
      const password = await request.json();
      if (!id || !mongoose.isValidObjectId(id)) {
        return NextResponse.json({ Message: "Invalid request." });
      }
      const findUser = await User.findOne({ _id: id });
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

      if (!password) {
        return NextResponse.json(
          { Message: "New Password required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const secret = process.env.ACCESS_TOKEN_SECRET + findUser.password;
      try {
        const match = verify(token, secret);
        if (match) {
          const hashedPwd = await hash(password?.toString(), 10);
          await User.findByIdAndUpdate({ _id: id }, { password: hashedPwd });
          return NextResponse.json(
            { Message: "Password successfully changed." },
            { status: StatusCodes.OK }
          );
        } else {
          return NextResponse.json(
            { Message: "Not verified." },
            { status: StatusCodes.UNAUTHORIZED }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { Message: "Not verified." + error?.message },
          { status: StatusCodes.UNAUTHORIZED }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Network error " + error?.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
