import Image from "next/image";
import { getServerSession } from "next-auth";
import { MdMyLocation } from "react-icons/md";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getPicture() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const response = await fetch(
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
    if (!response?.ok) {
      const text = await response?.json();
      return text;
    }
    const data = await response?.json();
    return data;
  } catch (error) {
    console.error("Error fetching pictures:", error?.message);
    return null;
  }
}

export default async function Navbar() {
  const userDetail = await getPicture();
  return (
    <div className="relative w-[100%] h-[100px]">
      <div className="w-[95%] h-[100%] mx-auto flex justify-between items-center gap-[20px]">
        {/* <div className="flex items-center gap-[20px] min-[800px]:hidden">
          <CiMenuBurger className="text-[30px] text-[#0D5C63] cursor-pointer font-bold" />
          <span>News</span>
        </div> */}
        <div className="flex items-center gap-[20px] max-[600px]:hidden">
          <MdMyLocation className="text-[30px] text-[#0D5C63]" />
          <span className="font-semibold text-[14px]">
            Addis Ababa, Ethiopia
          </span>
        </div>
        <div className="w-[40%] flex items-center justify-end gap-[20px] max-[1000px]:flex-1">
          <div className="w-[50px] h-[50px] flex justify-center items-center bg-[#0D5C63] rounded-full">
            {userDetail?.Message ? (
              <div className="w-full my-2 text-red-600 text-center font-medium">
                <p>{userDetail?.Message}</p>
              </div>
            ) : (
              <Image
                src={`${userDetail?.picture?.url}`}
                className="w-[100%] h-[100%] object-cover rounded-full"
                alt="Admin Img"
                priority={true}
                width={500}
                height={500}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
