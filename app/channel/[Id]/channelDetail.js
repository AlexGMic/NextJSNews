import Image from "next/image";
import { IoTime } from "react-icons/io5";
import ButtonFollow from "./buttonFollow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

async function getChannelDetail(id) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/channel/${id}`,
      {
        next: {
          revalidate: 0,
        },
        headers: {
          "Content-Type": "application/json",
          GET_CHANNEL_DETAIL_API_KEY: process.env.CHANNEL_DETAIL_API_KEY,
        },
      }
    );

    if (!response?.ok) {
      const text = await response?.json();
      return text;
    }
    const data = await response?.json();
    return data;
  } catch (error) {
    console.error("Error fetching channels:", error?.message);
    return null;
  }
}

async function getChannelNews(id, userId) {
  const userResponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/users/${userId}`,
    {
      next: {
        revalidate: 0,
      },
      headers: {
        "Content-Type": "application/json",
        GET_USER_API_DETAIL_KEY: process.env.USER_DETAIL_API_KEY,
      },
    }
  );

  if (!userResponse?.ok) {
    const text = await userResponse?.json();
    return text;
  }
  const userData = await userResponse?.json();

  const findChannelInUser = userData?.subscribedChannels?.find(
    (item) => item?.toString() === id?.toString()
  );
  if (findChannelInUser) {
    const newsResponse = await fetch(
      `${process?.env?.NEXTAUTH_URL}/api/news/get_by_channel/${id}`,
      {
        next: {
          revalidate: 0,
        },
        headers: {
          "Content-Type": "application/json",
          GET_NEWS_API_KEY: process.env.NEWS_API_KEY,
        },
      }
    );
    if (!newsResponse?.ok) {
      const newsText = await newsResponse?.json();
      return newsText;
    }
    const newsData = await newsResponse?.json();
    return newsData;
  } else {
    return { Message: "Please follow first to get news from this channel." };
  }
}

export default async function ChannelDetail({ params }) {
  const id = params?.Id;
  const channelList = await getChannelDetail(id);

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const newsList = await getChannelNews(id, userId);

  return (
    <div className="w-[100%] p-2">
      <div className="w-[90%] mx-auto mt-[30px]">
        <div className="flex items-center gap-[50px] max-[1200px]:flex-col">
          <div className="rounded-full">
            <Image
              src={`/MediaFolders/ChannelLogo/${channelList?.logo}`}
              className="w-[200px] h-[200px] object-contain rounded-full"
              priority={true}
              alt="Channel Logo"
              width={500}
              height={500}
            />
          </div>
          <div className="w-[50%] flex flex-col gap-[20px] max-[1200px]:w-full">
            <div className="flex items-center gap-[10px]">
              <span className="text-[30px] text-[#0D5C63] font-semibold uppercase">
                {channelList?.name}
              </span>
              <ButtonFollow id={id} userId={userId} />
            </div>

            <span className="text-gray-500">
              {`Follow to watch ${channelList?.name?.toUpperCase()}'s NEWS. The provided ${channelList?.name?.toUpperCase()} channel's logo is strictly intended for portfolio demonstration and does not represent an actual channel or its official branding. It serves as a visual element for showcasing design and development skills within a portfolio context. This simulated logo is entirely fictional, and any resemblance to real channels, their logos, or branding is purely coincidental. It's important to clarify that this representation is a creative exercise, emphasizing the ability to design and implement diverse visual elements for various projects. The main purpose is to showcase proficiency in creating aesthetically pleasing and functional designs rather than to impersonate any existing entities.`}
            </span>
          </div>
        </div>
        {newsList?.Message ? (
          <div className="w-full my-16 text-red-600 text-center font-medium">
            <p>{newsList?.Message}</p>
          </div>
        ) : (
          <div className="w-[100%] mt-[50px] flex flex-col">
            <span className="text-[20px] text-[#0D5C63] font-bold my-2">
              {channelList?.name?.toUpperCase()}
            </span>
            <div className="w-full my-8 grid grid-cols-1 md:grid-cols-1 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-3 min-[1750px]:grid-cols-4 gap-8">
              {newsList?.map((feature, index) => {
                return (
                  <div
                    className="w-[100%] max-[900px]:flex max-[900px]:flex-col max-[900px]:items-center"
                    key={index}
                  >
                    <Link
                      href={`/explore/${feature?._id}`}
                      className="cursor-pointer"
                    >
                      <Image
                        src={`/MediaFolders/ChannelLogo/${feature?.image}`}
                        priority={true}
                        width={500}
                        height={500}
                        className="w-[300px] h-[200px] object-cover rounded-[20px] max-[410px]:w-[280px] max-[410px]:h-[200px]"
                        alt="News Image"
                      />
                    </Link>
                    <div className="mt-[20px] flex flex-col gap-[10px]">
                      <span className="font-semibold text-ellipsis">
                        {feature?.title && feature?.title?.length > 30
                          ? feature?.title?.slice(0, 30) + "..."
                          : feature?.title}
                      </span>
                      <div className="flex flex-col gap-2 items-start">
                        <span className="bg-[#F7F7F7] py-1 px-2 text-[12px] rounded-[5px] text-[#0D5C63] font-bold">
                          {channelList?.name?.toUpperCase()}
                        </span>
                        <div className="flex items-center text-[#878787] text-[12px] gap-[10px]">
                          <IoTime />
                          <span>
                            {new Date(
                              feature?.publishedDate
                            )?.toLocaleDateString()}{" "}
                            {new Date(
                              feature?.publishedDate
                            )?.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
