import { join } from "path";
import Channel from "@/model/Channel";
import { headers } from "next/headers";
import { writeFile } from "fs/promises";
import connectDB from "@/config/connectDB.js";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function POST(request) {
  try {
    const expectedURLKEY = process.env.CHANNEL_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList.get("GET_CHANNEL_API_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();
      const formData = await request?.formData();
      const name = formData?.get("name");
      const code_name = formData?.get("code_name");
      const logo = formData?.get("logo");
      if (!name) {
        return NextResponse.json(
          { Messsage: "Name is required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!code_name) {
        return NextResponse.json(
          { Message: "Code name is required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      if (!logo) {
        return NextResponse.json(
          { Message: "Logo is required." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const checkName = name?.toLowerCase();

      const findName = await Channel.findOne({ name: checkName });
      if (findName) {
        return NextResponse.json(
          { Message: "This name already exists." },
          { status: StatusCodes.CONFLICT }
        );
      }
      const checkCodeName = code_name?.toLowerCase();
      const findCodeName = await Channel.findOne({ code_name: checkCodeName });
      if (findCodeName) {
        return NextResponse.json(
          { Message: "This code name already exists." },
          { status: StatusCodes.CONFLICT }
        );
      }

      const bytes = await logo?.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

      const path = join(
        "./",
        "public",
        "MediaFolders",
        "ChannelLogo",
        uniqueSuffix + "-" + logo?.name
      );

      const logoName = uniqueSuffix + "-" + logo?.name;

      await writeFile(path, buffer);

      const createChannel = await Channel.create({
        name: checkName,
        code_name: checkCodeName,
        logo: logoName,
      });

      return NextResponse.json(
        {
          Message: `${createChannel?.name?.toUpperCase()} is created successfully.`,
        },
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
    const expectedURLKEY = process.env.CHANNEL_API_KEY;
    const headerList = headers();
    const actualURLKEY = headerList?.get("GET_CHANNEL_API_KEY");

    if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
      await connectDB();

      const { searchParams } = new URL(request?.url);
      const pageNum = searchParams?.get("page");
      const pageSizeParam = searchParams?.get("pageSize");
      const query = searchParams?.get("query");

      if (pageNum !== null || pageSizeParam !== null) {
        let pageSize = parseInt(pageSizeParam) || 5;
        const page = parseInt(pageNum) || 1;

        if (page <= 0 || pageSize <= 0) {
          return NextResponse.json(
            { Message: "Invalid page or pageSize parameters." },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        let findChannel;
        let totalChannels;

        const skip = (page - 1) * pageSize;

        if (query) {
          findChannel = await Channel.find({
            name: { $regex: query, $options: "i" },
          })
            .skip(skip)
            .limit(pageSize);

          totalChannels = await Channel.countDocuments({
            name: { $regex: query, $options: "i" },
          });
        } else {
          findChannel = await Channel.find().skip(skip).limit(pageSize);

          totalChannels = await Channel.countDocuments();
        }

        if (!findChannel || findChannel.length === 0) {
          return NextResponse.json(
            { Message: "No channels found." },
            { status: StatusCodes.NOT_FOUND }
          );
        }

        const totalPages = Math.ceil(totalChannels / pageSize);

        return NextResponse.json(
          { findChannel, pagination: { currentPage: page, totalPages } },
          { status: StatusCodes.OK }
        );
      } else {
        let allChannels;
        if (query !== "" && query !== null) {
          allChannels = await Channel.find({
            name: { $regex: query, $options: "i" },
          });
        } else {
          allChannels = await Channel.find();
        }
        if (!allChannels || allChannels.length === 0) {
          return NextResponse.json(
            { Message: "No channels found." },
            { status: StatusCodes.NOT_FOUND }
          );
        }

        return NextResponse.json(allChannels, { status: StatusCodes.OK });
      }
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

// export async function GET(request) {
//   try {
//     const expectedURLKEY = process.env.CHANNEL_API_KEY;
//     const headerList = headers();
//     const actualURLKEY = headerList?.get("GET_CHANNEL_API_KEY");

//     if (expectedURLKEY?.toString() === actualURLKEY?.toString()) {
//       await connectDB();

//       const { searchParams } = new URL(request?.url);
//       const pageNum = searchParams?.get("page");
//       const pageSizeParam = searchParams?.get("pageSize");

//       if (pageNum !== null || pageSizeParam !== null) {
//         let pageSize = parseInt(pageSizeParam) || 5;
//         const page = parseInt(pageNum) || 1;

//         if (page <= 0 || pageSize <= 0) {
//           return NextResponse.json(
//             { Message: "Invalid page or pageSize parameters." },
//             { status: StatusCodes.BAD_REQUEST }
//           );
//         }

//         let findChannel;
//         const totalChannels = await Channel.countDocuments();

//         if (pageSize > totalChannels) {
//           pageSize = totalChannels;
//         }

//         const skip = (page - 1) * pageSize;

//         if (skip >= totalChannels) {
//           return NextResponse.json(
//             { Message: `Page ${page} not available.` },
//             { status: StatusCodes.NOT_FOUND }
//           );
//         }

//         findChannel = await Channel.find().skip(skip).limit(pageSize);

//         if (!findChannel || findChannel.length === 0) {
//           return NextResponse.json(
//             { Message: "No channels found." },
//             { status: StatusCodes.NO_CONTENT }
//           );
//         }

//         const totalPages = Math.ceil(totalChannels / pageSize);

//         return NextResponse.json({findChannel, pagination: { currentPage: page, totalPages }} ,{ status: StatusCodes.OK });
//       } else {
//         const allChannels = await Channel.find();

//         if (!allChannels || allChannels.length === 0) {
//           return NextResponse.json(
//             { Message: "No channels found." },
//             { status: StatusCodes.NO_CONTENT }
//           );
//         }

//         return NextResponse.json(allChannels, { status: StatusCodes.OK });
//       }
//     } else {
//       const redirectUrl = new URL("/not-found", request.url);
//       return NextResponse.redirect(redirectUrl);
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { Message: "Network error " + error?.message },
//       { status: StatusCodes.INTERNAL_SERVER_ERROR }
//     );
//   }
// }
