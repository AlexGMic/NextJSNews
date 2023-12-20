import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function getChannel({ query }, userId) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/channel/get_subchannel_by_user/${userId}?query=${query}`,
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
}

export default async function SubChannelAll({ searchParams }) {
  const search =
    typeof searchParams?.search === "string" ? searchParams?.search : "";

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const channels = await getChannel({ query: search }, userId);
  return (
    <div className="w-[95%] mt-[30px] mx-auto">
      <div className="w-[100%]">
        <div className="flex justify-between items-center gap-4">
          <span className="text-[20px] text-[#0D5C63] font-bold max-[420px]:text-[18px]">Subscribed Channels</span>
        </div>
        {channels?.Message ? (
          <div className="w-full my-2 text-red-600 text-center font-medium">
            <p>{channels?.Message}</p>
          </div>
        ) : (
          <div className="w-[100%] my-[50px] grid grid-cols-1 min-[550px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
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
