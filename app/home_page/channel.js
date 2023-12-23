import Link from "next/link";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

async function getChannel({ page, pageSize, query }) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/channel?page=${page}&pageSize=${pageSize}&query=${query}`,
      {
        next: {
          revalidate: 0,
        },
        headers: {
          "Content-Type": "application/json",
          GET_CHANNEL_API_KEY: process.env.CHANNEL_API_KEY,
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

export default async function Channel({ searchParams }) {
  const currentPage =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const currentPageSize =
    typeof searchParams.pageSize === "string"
      ? Number(searchParams.pageSize)
      : 5;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";

  const channelsInfo = await getChannel({
    page: currentPage,
    pageSize: currentPageSize,
    query: search,
  });
  const channels = channelsInfo?.findChannel;

  const totalPages = channelsInfo?.pagination?.totalPages;

  return (
    <div className="w-[95%] mt-[30px] mx-auto">
      <div className="w-[100%]">
        <div className="flex justify-between items-center gap-4">
          <span className="text-[20px] text-[#0D5C63] font-bold max-[400px]:text-[18px]">
            Explore Channels
          </span>
          {totalPages && (
            <div className="flex justify-center">
              <Link
                href={{
                  pathname: "/",
                  query: {
                    ...(search ? { search } : {}),
                    page: currentPage > 1 ? currentPage - 1 : 1,
                  },
                }}
                className="mx-1 px-3 py-2 text-white border border-[#0D5C63] bg-[#0D5C63] rounded-[50%] hover:bg-transparent hover:text-[#0D5C63] transition duration-500 max-[400px]:px-2"
              >
                <IoIosArrowBack />
              </Link>

              <Link
                href={{
                  pathname: "/",
                  query: {
                    ...(search ? { search } : {}),
                    page:
                      currentPage >= totalPages ? totalPages : currentPage + 1,
                  },
                }}
                className="mx-1 px-3 py-2 text-white border border-[#0D5C63] bg-[#0D5C63] rounded-[50%] hover:bg-transparent hover:text-[#0D5C63] transition duration-500 max-[400px]:px-2"
              >
                <IoIosArrowForward />
              </Link>
            </div>
          )}
        </div>
        {channelsInfo?.Message ? (
          <div className="w-full my-2 text-red-600 text-center font-medium">
            <p>{channelsInfo?.Message}</p>
          </div>
        ) : (
          <div className="w-[100%] my-[20px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 ">
            {channels?.map((channel) => {
              return (
                <Link
                  href={`/channel/${channel?._id}`}
                  key={channel?._id}
                  className="bg-[#F7F7F7] rounded-[10px] p-4 flex flex-col items-center justify-center gap-[20px] shadow-md cursor-pointer"
                >
                  <Image
                    src={`/MediaFolders/ChannelLogo/${channel?.logo}`}
                    className="w-[80px] h-[80px] object-contain rounded-full max-[1300px]:w-[60px] max-[1300px]:h-[60px]"
                    priority={true}
                    alt="Channel Logo"
                    width={500}
                    height={500}
                  />
                  <span className="font-semibold uppercase text-center max-[1300px]:text-[14px]">
                    {channel?.name}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
