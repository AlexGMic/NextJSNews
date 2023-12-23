"use client";

import Link from "next/link";
import { SlLike } from "react-icons/sl";
import { signOut } from "next-auth/react";
import { GrChannel } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { PiRadioLight } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { LiaHomeSolid, LiaWpexplorer } from "react-icons/lia";

export default function ResponsiveSidebar() {
  const router = useRouter();

  const handleSignOut = async (e) => {
    e?.preventDefault();
    await signOut();
    router.push("/login");
  };
  return (
    <div className="w-[6%] fixed min-h-[100vh] p-2 bg-[#F8F8F8] max-[1080px]:w-[10%] max-[600px]:w-[15%]">
      <div className="w-[90%] h-[90%] mt-[20px] mx-auto flex flex-col">
        <div className="w-[100%] flex justify-center items-center">
          <span className="text-[25px] bg-[#0D5C63] text-white font-semibold rounded-[50%] border border-[#0D5C63] px-3 py-1">
            A
          </span>
        </div>
        <div className="flex  min-h-[90vh] flex-col justify-between">
          <div>
            <div className="w-[100%]  text-[#878787] mt-[50px] flex flex-col gap-[20px]">
              <a
                href="/"
                title="Home"
                className="flex justify-center items-center gap-[10px]  p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
              >
                <LiaHomeSolid className="text-[22px]" />
              </a>
              <a
                href="/explore"
                title="Explore"
                className="flex justify-center items-center gap-[10px] p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
              >
                <LiaWpexplorer className="text-[22px]" />
              </a>
              <a
                href="/likes"
                title="Liked"
                className="flex justify-center items-center gap-[10px] p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
              >
                <SlLike className="text-[22px]" />
              </a>
              <a
                href="/channel"
                title="Channels"
                className="flex justify-center items-center gap-[10px] p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
              >
                <GrChannel className="text-[22px]" />
              </a>
              <a
                href="/subscription_channel"
                title="Subscribed Channels"
                className="flex justify-center items-center gap-[10px] p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
              >
                <PiRadioLight className="text-[22px]" />
              </a>
            </div>
          </div>
          <div className="text-[#878787] flex flex-col gap-[20px]">
            <Link
              href="/myprofile"
              title="My Profile"
              className="flex justify-center items-center gap-[10px] p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
            >
              <IoMdSettings className="text-[22px]" />
            </Link>
            <button
              onClick={handleSignOut}
              title="Logout"
              className="flex justify-center items-center gap-[10px] p-2 rounded-[10px] duration-700 hover:bg-[#0D5C63] hover:text-white"
            >
              <MdOutlineLogout className="text-[22px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
