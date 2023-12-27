"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { AiOutlineLeft } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ButtonLoad from "@/app/components/buttonload";

export default function ResetPassword() {
  const [passwordFill, setPasswordFill] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccessResponse] = useState("");
  const [toggle, setToggle] = useState(false);
  const { userId, userToken } = useParams();
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/users/forget_password/${userId}/${userToken}`,
          passwordFill,
          {
            headers: {
              GET_USER_API_KEY: process.env.NEXT_PUBLIC_USER_API_KEY,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setPasswordFill("");
            setError("");
            setLoading(false);
            setSuccessResponse(response?.data?.Message);
            setTimeout(() => {
              setSuccessResponse("");
            }, 6000);
          }
        })
        .catch((error) => {
          setLoading(false);
          setSuccessResponse("");
          setError(error?.response?.data?.Message);
        });
    } catch (error) {
      setLoading(false);
      setSuccessResponse("");
      setError(error?.message);
    }
  };

  const router = useRouter();
  const handleClick = () => {
    router?.back();
  };
  return (
    <div className="w-[50%] h-[100%] flex justify-center items-center max-[1100px]:w-[80%] max-[1100px]:mx-auto max-[900px]:w-[90%] max-[650px]:w-full">
      <div className="w-[70%] h-[60%] min-h-[50%] py-4 mx-auto border border-gray-300 rounded-[20px] flex flex-col justify-center items-center gap-[20px] max-[900px]:w-[90%]">
        <div className="w-[80%]  flex flex-col gap-[10px] max-[900px]:w-[90%]">
          <span className="text-[30px] font-bold text-[#0D5C63] flex gap-4 items-center max-[400px]:text-[25px]">
            <AiOutlineLeft
              onClick={handleClick}
              className="border border-[#0D5C63] rounded-[50%] p-1 cursor-pointer hover:bg-[#0D5C63] hover:text-white transition duration-500"
            />
            Reset Password
          </span>
          {!error && !success && (
            <span className="text-gray-400 text-[14px]">
              Enter a new password to reset your password
            </span>
          )}
        </div>

        {success && (
          <div className="w-full my-1 text-center">
            <p className="text-green-600 font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="w-full my-1 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="w-[80%] flex flex-col gap-[20px] max-[900px]:w-[90%] max-[600px]:p-2 max-[400px]:w-[95%]">
          <div className="w-[90%] flex flex-col gap-[10px]">
            <span className="font-bold text-[#0D5C63]">Password</span>
            <div className="py-2 px-4 border border-gray-400 rounded-[5px] outline-[#0D5C63] flex items-center justify-between">
              <input
                type={toggle ? "text" : "password"}
                value={passwordFill}
                onChange={(e) => setPasswordFill(e?.target?.value)}
                placeholder="Enter new password"
                className="outline-none border-none"
              />
              <button
                onClick={() => setToggle(!toggle)}
                className="text-[#0D5C63]"
              >
                {toggle ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
        </div>
        <div className="w-[80%] mx-auto flex flex-col gap-[20px] max-[900px]:w-[90%] max-[600px]:p-2 max-[400px]:w-[95%]">
          {loading ? (
            <button className="w-[90%] bg-[#0D5C63] py-2 px-4 text-white font-bold rounded-[5px]">
              <ButtonLoad />
            </button>
          ) : (
            <button
              onClick={handleResetPassword}
              className="w-[90%] bg-[#0D5C63] py-2 px-4 text-white font-bold rounded-[5px]"
            >
              Reset Password
            </button>
          )}
          <div className="text-[14px] flex items-center gap-[10px]">
            <span className="text-gray-500">Have an account?</span>
            <span className="text-[#0D5C63] font-bold cursor-pointer">
              <Link href={"/login"}>Login</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
