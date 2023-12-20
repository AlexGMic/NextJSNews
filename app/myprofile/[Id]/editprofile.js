"use client";

import ButtonLoad from "@/app/components/buttonload";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function EditProfile() {
  const { Id } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [usernameFill, setUsernameFill] = useState("");
  const [emailFill, setEmailFill] = useState("");
  const [pictureFill, setPictureFill] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/users/${Id}`, {
        headers: {
          GET_USER_API_DETAIL_KEY: process.env.NEXT_PUBLIC_USER_API_DETAIL_KEY,
        },
      })
      .then((response) => {
        if (response?.status === 200) {
          setError("");
          setFirstName(response?.data?.first_name);
          setMiddleName(response?.data?.middle_name);
          setLastName(response?.data?.last_name);
          setUsernameFill(response?.data?.username);
          setEmailFill(response?.data?.email);
          setPictureFill(response?.data?.picture);
        }
      })
      .catch((error) => {
        setError(error?.response?.data?.Message);
      });
  }, [Id]);

  const handleEdit = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("middle_name", middleName);
      formData.append("last_name", lastName);
      formData.append("username", usernameFill);
      formData.append("email", emailFill);
      formData.append("picture", pictureFill);

      await axios
        .put(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/users/${Id}`,
          formData,
          {
            headers: {
              GET_USER_API_DETAIL_KEY:
                process.env.NEXT_PUBLIC_USER_API_DETAIL_KEY,
            },
          }
        )
        .then((response) => {
          if (response?.status === 200) {
            setError("");
            setLoading(false);
            window.location.href = "/myprofile";
          }
        })
        .catch((error) => {
          setLoading(false);
          setError(error?.response?.data?.Message);
        });
    } catch (error) {
      setLoading(false);
      setError(error?.message);
    }
  };
  return (
    <div className="w-[80%] mx-auto bg-[#F8F8F8] shadow-md rounded-lg p-4 flex justify-center items-center min-h-[600px] max-h-[800px] max-[1700px]:w-[95%]">
      <div className="w-[90%] mx-auto flex flex-col gap-5">
        {error && (
          <div className="w-full my-1 flex justify-center items-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        <div className="w-full my-8 grid grid-cols-1 min-[1500px]:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[#0D5C63] capitalize font-bold">
              First Name
            </span>
            <input
              type="text"
              value={firstName ? firstName : ""}
              onChange={(e) => setFirstName(e?.target?.value)}
              className="border border-[#0D5C63] px-4 py-2 rounded font-semibold"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#0D5C63] capitalize font-bold">
              Middle Name
            </span>
            <input
              type="text"
              value={middleName ? middleName : ""}
              onChange={(e) => setMiddleName(e?.target?.value)}
              className="border border-[#0D5C63] px-4 py-2 rounded font-semibold"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#0D5C63] capitalize font-bold">
              Last Name
            </span>
            <input
              type="text"
              value={lastName ? lastName : ""}
              onChange={(e) => setLastName(e?.target?.value)}
              className="border border-[#0D5C63] px-4 py-2 rounded font-semibold"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#0D5C63] capitalize font-bold">
              Username
            </span>
            <input
              type="text"
              value={usernameFill ? usernameFill : ""}
              onChange={(e) => setUsernameFill(e?.target?.value)}
              className="border border-[#0D5C63] px-4 py-2 rounded font-semibold"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#0D5C63] capitalize font-bold">Email</span>
            <input
              type="text"
              value={emailFill ? emailFill : ""}
              onChange={(e) => setEmailFill(e?.target?.value)}
              className="border border-[#0D5C63] px-4 py-2 rounded font-semibold"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#0D5C63] capitalize font-bold">Picture</span>
            <div className="flex items-center justify-between pr-4 border border-gray-400 rounded-[5px] outline-[#0D5C63] max-[750px]:flex-col max-[750px]:items-start">
              <label>
                <input
                  type="file"
                  hidden
                  onChange={(e) => setPictureFill(e?.target?.files[0])}
                  className="border border-[#0D5C63] px-4 py-1 rounded font-semibold"
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
                      pictureFill?.originalname ||
                      pictureFill
                    : ""}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="w-full my-5 flex justify-end">
          {loading ? (
            <button className="bg-[#0D5C63] py-2 px-4 text-white font-bold rounded">
              <ButtonLoad />
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-[#0D5C63] border border-[#0D5C63] px-4 py-2 text-white rounded hover:bg-transparent hover:text-[#0D5C63] transition duration-500"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
