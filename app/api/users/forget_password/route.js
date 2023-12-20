import User from "@/model/User";
import { sign } from "jsonwebtoken";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB.js";
import { createTransport } from "nodemailer";
import { StatusCodes } from "http-status-codes";

export async function POST(request) {
  try {
    const expectedURLKEY = process.env.USER_API_KEY;

    const headerList = headers();
    const actualURLKEY = headerList.get("GET_USER_API_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      const { email } = await request?.json();

      if (!email) {
        return NextResponse.json(
          { Message: "Email required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      await connectDB();

      const findUser = await User.findOne({ email: email });
      if (!findUser) {
        return NextResponse.json(
          {
            Message: "Not authenticated to request forgot password.",
          },
          { status: StatusCodes.UNAUTHORIZED }
        );
      }

      if (findUser.status === "inactive") {
        return NextResponse.json(
          { Message: "This user is banned from the system." },
          { status: StatusCodes.UNAUTHORIZED }
        );
      }

      const secret = process.env.ACCESS_TOKEN_SECRET + findUser?.password;
      const token = sign({ email: findUser.email, id: findUser._id }, secret, {
        expiresIn: "10m",
      });
      const link = `${process.env.NEXTAUTH_URL}/reset_password/${findUser._id}/${token}`;

      var transporter = createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_FROM,
          pass: process.env.MAIL_PASS,
        },
      });

      var mailOptions = {
        from: process.env.MAIL_FROM,
        to: `${email}`,
        subject: "Reset Password.",
        text: link,
      };

      const info = await transporter.sendMail(mailOptions);

      if (info.messageId) {
        return NextResponse.json(
          {
            Message:
              "Email sent: Please check your inbox or spam for the reset password link.",
          },
          { status: StatusCodes.OK }
        );
      } else {
        return NextResponse.json(
          { Message: "Email not sent successfully." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
    } else {
      const redirectUrl = new URL("/not-found", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Network error " + error?.message },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
}
