import Image from "next/image";
import { BiCategory, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import Comments from "./comments";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getNewsDetail(newsId) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/news/${newsId}`,
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
}

export default async function NewsDetail({ params }) {
  const newsId = params?.Id;
  const newsDetail = await getNewsDetail(newsId);

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  return (
    <div className="w-[80%] mx-auto max-[1200px]:w-[90%] max-[800px]:w-[100%]">
      {newsDetail?.Message ? (
        <div className="w-full my-16 text-red-600 text-center font-medium">
          <p>{news?.Message}</p>
        </div>
      ) : (
        <div className="w-[80%] mx-auto relative max-[1200px]:w-[90%] max-[650px]:w-[95%]">
          <div className="w-full my-8">
            <p className="w-full text-[#0D5C63] text-2xl font-semibold max-[470px]:text-xl max-[395px]:text-lg">
              {newsDetail?.title}
            </p>
          </div>
          <div className="flex justify-between items-center gap-4 max-[600px]:flex-col max-[600px]:items-start">
            <div className="flex gap-8 items-center">
              <div className="flex items-center gap-2 text-[14px] max-[650px]:text-[12px]">
                <span>{newsDetail?.likes}</span>
                <span className="text-[#503E9D] bg-transparent">
                  <BiSolidLike />
                </span>
              </div>
              <div className="flex items-center gap-2 text-[14px] max-[650px]:text-[12px]">
                <span>{newsDetail?.dislikes}</span>
                <span className="text-gray-600 bg-transparent">
                  <BiSolidDislike />
                </span>
              </div>
              <div className="flex items-center gap-2 text-[14px] max-[650px]:text-[12px]">
                <span>{newsDetail?.views}</span>
                <span className="text-gray-600 bg-transparent">
                  <FaEye />
                </span>
              </div>
              <div className="flex items-center gap-4 text-[14px] max-[650px]:text-[12px]">
                <span className="text-gray-600 bg-transparent">
                  <BiCategory />
                </span>
                <span className="text-gray-600">{newsDetail?.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[14px] text-gray-600">
              <span className="text-[14px]">
                {new Date(newsDetail?.publishedDate)?.toLocaleDateString()}{" "}
              </span>
              <span className="text-[14px] flex gap-1 items-center">
                <IoTime />
                {new Date(newsDetail?.publishedDate)?.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="w-full mt-8">
            <Image
              src={`/MediaFolders/ChannelLogo/${newsDetail?.image}`}
              className="w-full object-cover rounded-[20px]"
              alt="News Image"
              priority={true}
              width={800}
              height={800}
            />
          </div>
          <div className="w-full my-8">
            <p className="w-full text-gray-600">{newsDetail?.content}</p>
          </div>
          <Suspense fallback={<Loading />}>
            <Comments id={newsDetail?._id} userId={currentUserId} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
