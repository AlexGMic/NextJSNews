"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ButtonLoad from "../components/buttonload";

export default function Signup({ setLoginState }) {
  const [firstNameFill, setFirstNameFill] = useState("");
  const [middleNameFill, setMiddleNameFill] = useState("");
  const [lastNameFill, setLastNameFill] = useState("");
  const [usernameFill, setUsernameFill] = useState("");
  const [emailFill, setEmailFill] = useState("");
  const [passwordFill, setPasswordFill] = useState("");
  const [pictureFill, setPictureFill] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccessResponse] = useState("");
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("first_name", firstNameFill);
      formData.append("middle_name", middleNameFill);
      formData.append("last_name", lastNameFill);
      formData.append("username", usernameFill);
      formData.append("email", emailFill);
      formData.append("password", passwordFill);
      formData.append("role", "User");
      formData.append("picture", pictureFill);

      await axios
        .post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/users`, formData, {
          headers: {
            GET_USER_API_KEY: process.env.NEXT_PUBLIC_USER_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 201) {
            setFirstNameFill("");
            setMiddleNameFill("");
            setLastNameFill("");
            setUsernameFill("");
            setEmailFill("");
            setPasswordFill("");
            setPictureFill("");
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
      <div className="w-[70%] h-[95%] min-h-[50%] py-4 mx-auto border border-gray-300 rounded-[20px] flex flex-col justify-center items-center gap-[10px] max-[900px]:w-[90%]">
        <div className="w-[80%] flex flex-col gap-[10px] max-[900px]:w-[90%]">
          <span className="text-[30px] font-bold text-[#0D5C63] flex gap-4 items-center">
            Sign up
          </span>
          {!error && !success && (
            <span className="text-gray-400 text-[14px]">
              Enter your username and password to login
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

        <div className="w-[80%] flex flex-col gap-[10px] max-h-[550px] overflow-auto p-2 max-[900px]:w-[90%] max-[400px]:w-[95%]">
          <div className="w-[90%] flex flex-col gap-[10px]">
            <span className="font-bold text-[#0D5C63]">First Name</span>
            <input
              type="text"
              value={firstNameFill}
              onChange={(e) => setFirstNameFill(e?.target?.value)}
              placeholder="Abebe"
              className="py-2 px-4 border border-gray-400 rounded-[5px] outline-[#0D5C63]"
            />
          </div>
          <div className="w-[90%] flex flex-col gap-[10px]">
            <span className="font-bold text-[#0D5C63]">Middle Name</span>
            <input
              type="text"
              value={middleNameFill}
              onChange={(e) => setMiddleNameFill(e?.target?.value)}
              placeholder="Kebede"
              className="py-2 px-4 border border-gray-400 rounded-[5px] outline-[#0D5C63]"
            />
          </div>
          <div className="w-[90%] flex flex-col gap-[10px]">
            <span className="font-bold text-[#0D5C63]">Last Name</span>
            <input
              type="text"
              value={lastNameFill}
              onChange={(e) => setLastNameFill(e?.target?.value)}
              placeholder="Teshome"
              className="py-2 px-4 border border-gray-400 rounded-[5px] outline-[#0D5C63]"
            />
          </div>
          <div className="w-[90%] flex flex-col gap-[10px]">
            <span className="font-bold text-[#0D5C63]">Username</span>
            <input
              type="text"
              value={usernameFill}
              onChange={(e) => setUsernameFill(e?.target?.value)}
              placeholder="Abe123"
              className="py-2 px-4 border border-gray-400 rounded-[5px] outline-[#0D5C63]"
            />
          </div>
          <div className="w-[90%] flex flex-col gap-[10px]">
            <span className="font-bold text-[#0D5C63]">Email</span>
            <input
              type="email"
              value={emailFill}
              onChange={(e) => setEmailFill(e?.target?.value)}
              placeholder="abebe@example.com"
              className="py-2 px-4 border border-gray-400 rounded-[5px] outline-[#0D5C63]"
            />
          </div>
          <div className="w-[90%] flex flex-col gap-[10px]">
            <span className="font-bold text-[#0D5C63]">Password</span>
            <div className="py-2 px-4 border border-gray-400 rounded-[5px] outline-[#0D5C63] flex items-center justify-between">
              <input
                type={toggle ? "text" : "password"}
                value={passwordFill}
                onChange={(e) => setPasswordFill(e?.target?.value)}
                placeholder="Enter your password"
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
          <div className="w-[90%] flex flex-col gap-[10px]">
            <span className="font-bold text-[#0D5C63]">Picture</span>
            <div className="flex items-center justify-between py-2 px-4 border border-gray-400 rounded-[5px] outline-[#0D5C63]">
              <label>
                <input
                  type="file"
                  hidden
                  onChange={(e) => setPictureFill(e?.target?.files[0])}
                  className="py-2 px-4 border border-gray-400 rounded-[5px] outline-[#0D5C63]"
                />
                <span className="flex justify-center w-[100%] rounded gap-2 items-center font-medium cursor-pointer bg-[#0D5C63] p-2 text-white">
                  <FaCloudUploadAlt /> Upload-Image
                </span>
              </label>
              {pictureFill && (
                <span className="my-2 text-[14px] text-[#0D5C63]">
                  {pictureFill
                    ? pictureFill?.name ||
                      pictureFill?.filename ||
                      pictureFill?.originalname
                    : ""}
                </span>
              )}
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
              onClick={handleSignUp}
              className="w-[90%] bg-[#0D5C63] py-2 px-4 text-white font-bold rounded-[5px]"
            >
              Sign up
            </button>
          )}
          <div className="text-[14px] flex items-center gap-[10px]">
            <span className="text-gray-500">have an account?</span>
            <span
              onClick={() => setLoginState(true)}
              className="text-[#0D5C63] font-bold cursor-pointer"
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
