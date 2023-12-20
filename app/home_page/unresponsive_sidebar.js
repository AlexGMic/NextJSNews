"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { GrChannel } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { SlLike } from "react-icons/sl";
// import { CiBookmark } from "react-icons/ci";
import { PiRadioLight } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { LiaHomeSolid, LiaWpexplorer } from "react-icons/lia";

export default function UnResponsiveSidebar() {
  const router = useRouter();

  const handleSignOut = async (e) => {
    e?.preventDefault();
    await signOut();
    router.push("/login");
  };
  
  return (
    <div className="w-[15%] fixed min-h-[100vh] p-2 bg-[#F8F8F8] max-[1700px]:w-[20%] max-[1200px]:hidden">
      <div className="w-[90%] h-[90%] mt-[20px] mx-auto flex flex-col">
        <div className="w-[100%] flex justify-center items-center">
          <span className="text-[25px] text-[#0D5C63] font-bold">
            Abysinnia News
          </span>
        </div>
        <div className="flex  min-h-[90vh] flex-col justify-between">
          <div>
            <div className="w-[100%]  text-[#878787] mt-[50px] flex flex-col gap-[20px]">
              <Link
                href="/"
                className="flex items-center gap-[10px]  p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
              >
                <LiaHomeSolid className="text-[25px] max-[1700px]:text-[18px]" />
                <span>Home</span>
              </Link>
              <Link
                href="/explore"
                className="flex items-center gap-[10px] p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
              >
                <LiaWpexplorer className="text-[25px] max-[1700px]:text-[18px]" />
                <span>Explore</span>
              </Link>
              <Link
                href="/likes"
                className="flex items-center gap-[10px] p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
              >
                <SlLike className="text-[25px] max-[1700px]:text-[18px]" />
                <span>Liked</span>
              </Link>
              <Link
                href="/channel"
                className="flex items-center gap-[10px] p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
              >
                <GrChannel className="text-[25px] max-[1700px]:text-[18px]" />
                <span>Channels</span>
              </Link>
              <Link
                href="/subscription_channel"
                className="flex items-center gap-[10px] p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
              >
                <PiRadioLight className="text-[25px] max-[1700px]:text-[18px]" />
                <span>Subscribed Channels</span>
              </Link>
            </div>
          </div>
          <div className="text-[#878787] flex flex-col gap-[20px]">
            <Link
              href="/myprofile"
              className="flex items-center gap-[10px] p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
            >
              <IoMdSettings className="text-[25px] max-[1700px]:text-[18px]" />
              <span>My Profile</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-[10px] p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
            >
              <MdOutlineLogout className="text-[25px] max-[1700px]:text-[18px]" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
