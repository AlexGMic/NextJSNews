import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { MdModeEditOutline } from "react-icons/md";
import Link from "next/link";

async function getUser(id) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/users/${id}`,
      {
        next: {
          revalidate: 0,
        },
        headers: {
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
    console.error("Error fetching user's profile:", error?.message);
    return null;
  }
}

export default async function UserProfile() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;

  const userDetail = await getUser(id);
  return (
    <div className="w-[100%] p-2">
      <div className="w-[60%] mx-auto border border-dashed border-[#878787] rounded-lg p-8 max-[1200px]:w-[80%] max-[900px]:w-[95%] max-[800px]:px-2">
        <div className="flex w-full justify-end mb-4">
          <Link
            href={`/myprofile/${id}`}
            className="bg-[#0D5C63] text-white text-2xl border border-[#0D5C63] p-1 rounded cursor-pointer hover:bg-white hover:text-[#0D5C63] transition duration-500"
          >
            <MdModeEditOutline />
          </Link>
        </div>
        <div className="w-full flex justify-center items-center">
          <Image
            src={`${process.env.NEXTAUTH_URL}/MediaFolders/UsersImg/${userDetail?.picture}`}
            className="w-[200px] h-[200px] object-cover rounded-[50%] max-[500px]:w-[150px] max-[500px]:h-[150px]"
            alt="User Img"
            priority={true}
            width={200}
            height={200}
          />
        </div>
        <div className="w-[90%] mx-auto bg-[#0D5C63] text-white flex flex-col gap-4 mt-4 rounded-lg p-4 font-medium max-[900px]:w-[95%] max-[600px]:px-2 max-[400px]:text-[14px]">
          <div className="w-full p-2 flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-2 max-[600px]:border max-[600px]:border-white max-[600px]:rounded-md">
            <div className="w-[40%] max-[600px]:w-full">
              <p>First Name</p>
            </div>
            <div className="w-[60%] max-[600px]:w-full">
              <p>{userDetail?.first_name}</p>
            </div>
          </div>

          <div className="w-full p-2 flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-2 max-[600px]:border max-[600px]:border-white max-[600px]:rounded-md">
            <div className="w-[40%] max-[600px]:w-full">
              <p>Middle Name</p>
            </div>
            <div className="w-[60%] max-[600px]:w-full">
              <p>{userDetail?.middle_name}</p>
            </div>
          </div>

          <div className="w-full p-2 flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-2 max-[600px]:border max-[600px]:border-white max-[600px]:rounded-md">
            <div className="w-[40%] max-[600px]:w-full">
              <p>Last Name</p>
            </div>
            <div className="w-[60%] max-[600px]:w-full">
              <p>{userDetail?.last_name}</p>
            </div>
          </div>

          <div className="w-full p-2 flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-2 max-[600px]:border max-[600px]:border-white max-[600px]:rounded-md">
            <div className="w-[40%] max-[600px]:w-full">
              <p>Username</p>
            </div>
            <div className="w-[60%] max-[600px]:w-full">
              <p>{userDetail?.username}</p>
            </div>
          </div>

          <div className="w-full p-2 flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-2 max-[600px]:border max-[600px]:border-white max-[600px]:rounded-md">
            <div className="w-[40%] max-[600px]:w-full">
              <p>Email</p>
            </div>
            <div className="w-[60%] max-[600px]:w-full">
              <p>{userDetail?.email}</p>
            </div>
          </div>

          <div className="w-full p-2 flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-2 max-[600px]:border max-[600px]:border-white max-[600px]:rounded-md">
            <div className="w-[40%] max-[600px]:w-full">
              <p>Status</p>
            </div>
            <div className="w-[60%] max-[600px]:w-full">
              <p>{userDetail?.status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
