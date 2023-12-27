import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import LikeBtn from "../explore/LikeBtn";
import { IoTime } from "react-icons/io5";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function getNewsLatest() {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/news/latest/International`,
      {
        next: {
          revalidate: 0,
        },
        headers: {
          "Content-Type": "application/json",
          GET_NEWS_DETAIL_API_KEY: process.env.NEWS_DETAIL_API_KEY,
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
    console.error("Error fetching international news:", error?.message);
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

export default async function InternationalNews() {
  const newsData = await getNewsLatest();

  const session = await getServerSession(authOptions);
  const userIdforLike = session?.user?.id;

  const channels = await getChannel();
  const listOfChannel = channels?.Message ? "" : channels;

  return (
    <div className="w-[95%] mt-[50px] mx-auto">
      <div className="w-full flex justify-between items-center">
        <div className="w-[50%]">
          <p className="text-[20px] text-[#0D5C63] font-bold max-[420px]:text-[18px]">
            International News
          </p>
        </div>
        <div className="w-[50%] flex justify-end">
          <Link
            href={"/explore"}
            className="text-[#0D5C63] font-semibold flex items-center gap-2"
          >
            See all <FaArrowRight />
          </Link>
        </div>
      </div>
      {newsData?.Message ? (
        <div className="w-full my-2 text-red-600 text-center font-medium">
          <p>{newsData?.Message}</p>
        </div>
      ) : (
        <div className="w-full my-8 grid grid-cols-1 md:grid-cols-1 min-[900px]:grid-cols-2 min-[1660px]:grid-cols-3 gap-8">
          {newsData?.map((news, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-4 max-[900px]:justify-center"
              >
                <Link href={`/explore/${news?._id}`}>
                  <Image
                    src={`${news?.image?.url}`}
                    className="w-[150px] h-[150px] object-cover rounded-lg max-[380px]:w-[130px] max-[380px]:h-[130px]"
                    priority={true}
                    alt="News Image"
                    width={500}
                    height={500}
                  />
                </Link>
                <div className="flex flex-col gap-4 max-[600px]:gap-2">
                  <span className="text-gray-800 font-semibold text-xl max-[1200px]:text-lg max-[600px]:text-base max-[480px]:text-sm">
                    {news?.title && news?.title?.length > 20
                      ? news?.title?.slice(0, 20) + "..."
                      : news?.title}
                  </span>
                  <div className="w-[50%]">
                    <LikeBtn newsId={news?._id} userId={userIdforLike} />
                  </div>
                  <div className="flex gap-[20px] items-center max-[1200px]:flex-col max-[1200px]:items-start max-[1200px]:gap-2">
                    <span className="bg-[#F7F7F7] py-1 px-2 text-[12px] rounded-[5px] text-[#503E9D] font-bold uppercase max-[480px]:text-[10px]">
                      {listOfChannel === ""
                        ? ""
                        : listOfChannel?.find(
                            (item) => item?._id === news?.channel
                          )?.name}
                    </span>
                    <div className="flex items-center text-[#878787] gap-[5px]">
                      <span className="text-[12px] max-[480px]:text-[10px]">
                        {new Date(news?.publishedDate)?.toLocaleDateString()}{" "}
                      </span>
                      <IoTime />
                      <span className="text-[12px] max-[480px]:text-[10px]">
                        {new Date(news?.publishedDate)?.toLocaleTimeString()}
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
  );
}
