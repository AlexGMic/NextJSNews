"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AiOutlineLeft } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ButtonLoad from "../components/buttonload";

export default function Login({ setLoginState }) {
  const router = useRouter();
  const [usernameFill, setUsernameFill] = useState("");
  const [passwordFill, setPasswordFill] = useState("");
  const [error, setError] = useState("");
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await signIn("credentials", {
        username: usernameFill,
        password: passwordFill,
        redirect: false,
      });
      if (response?.error) {
        setLoading(false);
        setError(response?.error);
        return;
      }
      router.push("/");
    } catch (error) {
      setLoading(false);
      setError(error?.message);
    }
  };

  const handleClick = () => {
    router?.back();
  };

  return (
    <div className="w-[50%] h-[100%] flex justify-center items-center max-[1100px]:w-[80%] max-[1100px]:mx-auto max-[900px]:w-[90%] max-[650px]:w-full">
      <div className="w-[70%] h-[60%] min-h-[50%] py-4 mx-auto border border-gray-300 rounded-[20px] flex flex-col justify-center items-center gap-[20px] max-[900px]:w-[90%]">
        <div className="w-[80%] flex flex-col gap-[10px] max-[900px]:w-[90%]">
          <span className="text-[30px] font-bold text-[#0D5C63] flex gap-4 items-center">
            {/* <AiOutlineLeft
              onClick={handleClick}
              className="border border-[#0D5C63] rounded-[50%] p-1 cursor-pointer hover:bg-[#0D5C63] hover:text-white transition duration-500"
            /> */}
            Login
          </span>
          {!error && (
            <span className="text-gray-400 text-[14px]">
              Enter your username and password to login
            </span>
          )}
        </div>

        {error && (
          <div className="w-full my-2 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="w-[80%] mx-auto flex flex-col gap-[20px] max-[900px]:w-[90%] max-[600px]:p-2">
          <div className="w-[90%] flex flex-col gap-[10px] max-[600px]:w-full">
            <span className="font-bold text-[#0D5C63]">Username</span>
            <input
              type="text"
              onChange={(e) => setUsernameFill(e?.target?.value)}
              placeholder="abebe5501"
              className="py-2 px-4 border border-gray-400 rounded-[5px] outline-[#0D5C63] text-gray-600 font-medium"
            />
          </div>
          <div className="w-[90%] flex flex-col gap-[10px] max-[600px]:w-full">
            <span className="font-bold text-[#0D5C63]">Password</span>
            <div className="py-2 px-4 border border-gray-400 rounded-[5px] outline-[#0D5C63] flex items-center justify-between">
              <input
                type={toggle ? "text" : "password"}
                value={passwordFill}
                onChange={(e) => setPasswordFill(e?.target?.value)}
                placeholder="Enter your password"
                className="outline-none border-none text-gray-600"
              />
              <button
                onClick={() => setToggle(!toggle)}
                className="text-[#0D5C63]"
              >
                {toggle ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <span className="text-[12px] text-right font-semibold text-[#0D5C63]">
              <Link href={"/forgot_password"}>Forgot Password?</Link>
            </span>
          </div>
        </div>
        <div className="w-[80%] mx-auto flex flex-col gap-[20px] max-[900px]:w-[90%] max-[600px]:p-2">
          {loading ? (
            <button className="w-[90%] bg-[#0D5C63] py-2 px-4 text-white font-bold rounded-[5px] max-[900px]:w-[90%] max-[600px]:w-full">
              <ButtonLoad />
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-[90%] bg-[#0D5C63] py-2 px-4 text-white font-bold rounded-[5px] max-[900px]:w-[90%] max-[600px]:w-full"
            >
              Login
            </button>
          )}
          <div className="text-[14px] flex items-center gap-[10px]">
            <span className="text-gray-500">Don't have an account yet?</span>
            <span
              onClick={() => setLoginState(false)}
              className="text-[#0D5C63] font-bold cursor-pointer"
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
