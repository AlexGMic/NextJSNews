"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLeft } from "react-icons/ai";
import ButtonLoad from "../components/buttonload";

export default function ForgotPassword() {
  const [emailFill, setEmailFill] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccessResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/users/forget_password`,
          { email: emailFill },
          {
            headers: {
              GET_USER_API_KEY: process.env.NEXT_PUBLIC_USER_API_KEY,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setEmailFill("");
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
    <div className="w-[50%] mx-auto h-[100%] flex justify-center items-center max-[1100px]:w-[80%] max-[1100px]:mx-auto max-[900px]:w-[90%] max-[650px]:w-full">
      <div className="w-[70%] h-[60%] min-h-[50%] py-4 mx-auto border border-gray-300 rounded-[20px] flex flex-col justify-center items-center gap-[20px] max-[900px]:w-[90%]">
        <div className="w-[80%]  flex flex-col gap-[10px] max-[900px]:w-[90%]">
          <span className="text-[30px] font-bold text-[#0D5C63] flex gap-4 items-center max-[400px]:text-[25px]">
            <AiOutlineLeft
              onClick={handleClick}
              className="border border-[#0D5C63] rounded-[50%] p-1 cursor-pointer hover:bg-[#0D5C63] hover:text-white transition duration-500"
            />
            Forgot Password
          </span>
          {!error && !success && (
            <span className="text-gray-400 text-[14px]">
              Enter your email to recover your password
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
            <span className="font-bold text-[#0D5C63]">Email</span>
            <input
              type="text"
              value={emailFill}
              onChange={(e) => setEmailFill(e?.target?.value)}
              placeholder="abebe5501@gmail.com"
              className="py-2 px-4 border border-gray-400 rounded-[5px] outline-[#0D5C63]"
            />
          </div>
        </div>
        <div className="w-[80%] mx-auto flex flex-col gap-[20px] max-[900px]:w-[90%] max-[600px]:p-2 max-[400px]:w-[95%]">
          {loading ? (
            <button className="w-[90%] bg-[#0D5C63] py-2 px-4 text-white font-bold rounded-[5px]">
              <ButtonLoad />
            </button>
          ) : (
            <button
              onClick={handleForgot}
              className="w-[90%] bg-[#0D5C63] py-2 px-4 text-white font-bold rounded-[5px]"
            >
              Submit
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
