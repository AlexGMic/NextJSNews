import Link from "next/link";
import Image from "next/image";
import { IoTime } from "react-icons/io5";
import LikeBtn from "../explore/LikeBtn";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function getNews({ category, query }, userIdforLike) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/news/likes/${userIdforLike}?category=${category}&query=${query}`,
      {
        next: {
          revalidate: 0,
        },
        headers: {
          "Content-Type": "application/json",
          GET_NEWS_LIKES_API_KEY: process.env.NEWS_LIKES_API_KEY,
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
    console.error("Error fetching liked news:", error?.message);
    return null;
  }
}

async function getChannel() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/channel`, {
      next: {
        revalidate: 0,
      },
      headers: {
        "Content-Type": "application/json",
        GET_CHANNEL_API_KEY: process.env.CHANNEL_API_KEY,
      },
    });
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

export default async function LikedNews({ searchParams }) {
  const session = await getServerSession(authOptions);
  const userIdforLike = session?.user?.id;

  const search_news =
    typeof searchParams?.search_news === "string"
      ? searchParams?.search_news
      : "";
  const category =
    typeof searchParams?.category === "string" ? searchParams?.category : "";

  const news = await getNews(
    {
      query: search_news,
      category: category,
    },
    userIdforLike
  );
  const channels = await getChannel();
  const listOfChannel = channels?.Message ? "" : channels;

  return (
    <div className="w-[100%] p-2">
      <div className="w-[90%] mx-auto mt-[30px] flex flex-col gap-[20px]">
        <div className="w-[100%] flex items-center justify-between gap-[20px] max-[1080px]:flex-col max-[1080px]:gap-4 max-[1080px]:items-start">
          <span className="font-bold text-[20px] text-[#0D5C63] max-[420px]:text-[18px]">
            Liked News
          </span>
          <div className="flex items-center gap-[20px] max-[900px]:grid max-[1080px]:grid-cols-4 max-[1080px]:gap-4 max-[650px]:grid-cols-3 max-[450px]:grid-cols-2">
            <Link
              href={{
                pathname: "/likes",
                query: {
                  ...(search_news ? { search_news } : {}),
                  category: "",
                },
              }}
              className="bg-[#0D5C63] text-white capitalize px-2 py-1 rounded focus:bg-transparent focus:text-[#0D5C63] border border-[#0D5C63] transition duration-500 hover:bg-transparent hover:text-[#0D5C63] outline-none"
              autoFocus
            >
              All
            </Link>
            <Link
              href={{
                pathname: "/likes",
                query: {
                  ...(search_news ? { search_news } : {}),
                  category: "Latest",
                },
              }}
              className="bg-[#0D5C63] text-white capitalize px-2 py-1 rounded focus:bg-transparent focus:text-[#0D5C63] border border-[#0D5C63] transition duration-500 hover:bg-transparent hover:text-[#0D5C63] outline-none"
            >
              Latest
            </Link>
            <Link
              href={{
                pathname: "/likes",
                query: {
                  ...(search_news ? { search_news } : {}),
                  category: "Trending",
                },
              }}
              className="bg-[#0D5C63] text-white capitalize px-2 py-1 rounded focus:bg-transparent focus:text-[#0D5C63] border border-[#0D5C63] transition duration-500 hover:bg-transparent hover:text-[#0D5C63] outline-none"
            >
              Trending
            </Link>
            <Link
              href={{
                pathname: "/likes",
                query: {
                  ...(search_news ? { search_news } : {}),
                  category: "International",
                },
              }}
              className="bg-[#0D5C63] text-white capitalize px-2 py-1 rounded focus:bg-transparent focus:text-[#0D5C63] border border-[#0D5C63] transition duration-500 hover:bg-transparent hover:text-[#0D5C63] outline-none"
            >
              International
            </Link>
            <Link
              href={{
                pathname: "/likes",
                query: {
                  ...(search_news ? { search_news } : {}),
                  category: "Sport",
                },
              }}
              className="bg-[#0D5C63] text-white capitalize px-2 py-1 rounded focus:bg-transparent focus:text-[#0D5C63] border border-[#0D5C63] transition duration-500 hover:bg-transparent hover:text-[#0D5C63] outline-none"
            >
              Sport
            </Link>
            <Link
              href={{
                pathname: "/likes",
                query: {
                  ...(search_news ? { search_news } : {}),
                  category: "Economics",
                },
              }}
              className="bg-[#0D5C63] text-white capitalize px-2 py-1 rounded focus:bg-transparent focus:text-[#0D5C63] border border-[#0D5C63] transition duration-500 hover:bg-transparent hover:text-[#0D5C63] outline-none"
            >
              Economics
            </Link>
            <Link
              href={{
                pathname: "/likes",
                query: {
                  ...(search_news ? { search_news } : {}),
                  category: "Breaking",
                },
              }}
              className="bg-[#0D5C63] text-white capitalize px-2 py-1 rounded focus:bg-transparent focus:text-[#0D5C63] border border-[#0D5C63] transition duration-500 hover:bg-transparent hover:text-[#0D5C63] outline-none"
            >
              Breaking
            </Link>
          </div>
        </div>
        {news?.Message ? (
          <div className="w-full my-16 text-red-600 text-center font-medium">
            <p>{news?.Message}</p>
          </div>
        ) : (
          <div className="w-full my-8 grid grid-cols-1 md:grid-cols-1 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-3 min-[1750px]:grid-cols-4 gap-8">
            {news?.map((feature, index) => {
              return (
                <div
                  key={index}
                  className="w-[100%] max-[900px]:flex max-[900px]:flex-col max-[900px]:items-center"
                >
                  <Link
                    href={`/explore/${feature?._id}`}
                    className="cursor-pointer"
                  >
                    <Image
                      src={`/MediaFolders/ChannelLogo/${feature?.image}`}
                      className="w-[300px] h-[200px] object-cover rounded-[20px] max-[410px]:w-[280px] max-[410px]:h-[200px]"
                      alt="News Image"
                      priority={true}
                      width={500}
                      height={500}
                    />
                  </Link>
                  <div className="mt-[20px] flex flex-col gap-[10px]">
                    <span className="font-semibold text-ellipsis">
                      {feature?.title && feature?.title?.length > 30
                        ? feature?.title?.slice(0, 30) + "..."
                        : feature?.title}
                    </span>
                    <div className="w-[50%]">
                      <LikeBtn newsId={feature?._id} userId={userIdforLike} />
                    </div>
                    <div className="flex gap-[20px] items-center max-[1400px]:flex-col max-[1400px]:items-start max-[1400px]:gap-[5px]">
                      <span className="bg-[#F7F7F7] py-1 px-2 text-[12px] rounded-[5px] text-[#503E9D] font-bold uppercase">
                        {listOfChannel === ""
                          ? ""
                          : listOfChannel?.find(
                              (item) => item?._id === feature?.channel
                            )?.name}
                      </span>
                      <div className="flex items-center text-[#878787] gap-[5px]">
                        <span className="text-[14px]">
                          {new Date(
                            feature?.publishedDate
                          )?.toLocaleDateString()}{" "}
                        </span>
                        <IoTime />
                        <span className="text-[14px]">
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
        )}
      </div>
    </div>
  );
}
