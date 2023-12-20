"use client";

import axios from "axios";
import { IoTime } from "react-icons/io5";
import { useEffect, useState } from "react";
import { BsTelegram } from "react-icons/bs";

export default function Comments({ id, userId }) {
  const [error, setError] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [newsDetail, setNewsDetail] = useState([]);
  const [comment, setComment] = useState("");

  const fetchNews = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/news/${id}`, {
        headers: {
          "Content-Type": "application/json",
          GET_NEWS_DETAIL_API_KEY: process.env.NEXT_PUBLIC_NEWS_DETAIL_API_KEY,
        },
      })
      .then((response) => {
        if (response?.status === 200) {
          setNewsDetail(response?.data);
        }
      })
      .catch((error) => {
        setError(error?.response?.data?.Message);
      });
  };

  useEffect(() => {
    fetchNews();
  }, [id]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/users`, {
        headers: {
          "Content-Type": "application/json",
          GET_USER_API_KEY: process.env.NEXT_PUBLIC_USER_API_KEY,
        },
      })
      .then((response) => {
        if (response?.status === 200) {
          setAllUsers(response?.data);
        }
      })
      .catch((error) => {
        setError(error?.response?.data?.Message);
      });
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/news/comment_news`,
          { newsId: id, userId: userId, text: comment },
          {
            headers: {
              "Content-Type": "application/json",
              GET_NEWS_LIKES_API_KEY:
                process.env.NEXT_PUBLIC_NEWS_LIKES_API_KEY,
            },
          }
        )
        .then((response) => {
          if (response?.status === 200) {
            setComment('')
            fetchNews();
          }
        })
        .catch((error) => {
          setError(error?.response?.data?.Message);
        });
    } catch (error) {
      setError(error?.message);
    }
  };

  return (
    <div className="w-full bg-slate-100 shadow-2xl mt-4 mb-8">
      {error && (
        <div className="w-[90%] mx-auto">
          <p className="w-full text-center text-red-600">{error && error}</p>
        </div>
      )}
      <div className="w-[90%] mx-auto flex flex-col gap-4 p-4 max-h-[300px] overflow-auto">
        {newsDetail?.comments &&
          newsDetail?.comments?.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-white shadow-lg rounded-md px-4 py-2 fl"
              >
                <span className="text-gray-500 text-[14px]">{item?.text}</span>
                <div className="flex justify-between items-center gap-4 my-2">
                  <span className="text-[12px] text-gray-400">
                    {allUsers
                      ? allUsers?.find(
                          (allUser) =>
                            allUser?._id?.toString() === item?.user?.toString()
                        )?.username
                      : ""}
                  </span>
                  <div className="flex items-center text-gray-400 gap-4 max-[450px]:flex-col max-[450px]:items-start max-[450px]:gap-1">
                    <span className="text-[12px]">
                      {new Date(item?.date)?.toLocaleDateString()}{" "}
                    </span>
                    <span className="text-[12px] flex gap-1 items-center">
                      <IoTime />
                      {new Date(item?.date)?.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="w-full mx-auto relative">
        <input
          onChange={(e) => setComment(e?.target?.value)}
          value={comment}
          className="w-full border border-gray-200 rounded-md outline-none h-[100px] max-h-[200px] overflow-y-auto px-4 py-2 text-gray-500 max-[380px]:text-[14px]"
          placeholder="Write your comments here..."
        />
        <button
          onClick={handleComment}
          className="bg-white text-[#0D5C63] rounded-[50%] text-3xl hover:bg-[#0D5C63] hover:text-white border border-[#0D5C63] transition duration-500 absolute bottom-8 right-8 font-medium"
        >
          <BsTelegram />
        </button>
      </div>
    </div>
  );
}
