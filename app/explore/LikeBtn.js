"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { GrDislike, GrLike } from "react-icons/gr";
import ButtonLoad from "../components/buttonload";

export default function LikeBtn({ newsId, userId }) {
  const [error, setError] = useState("");
  const [news, setNews] = useState(null);
  const [likedStatus, setLikedStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dislikedStatus, setDisLikedStatus] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/news/${newsId}`,
        {
          headers: {
            "Content-Type": "application/json",
            GET_NEWS_DETAIL_API_KEY:
              process.env.NEXT_PUBLIC_NEWS_DETAIL_API_KEY,
          },
        }
      );

      if (response?.status === 200) {
        const fetchedNews = response?.data;
        setNews(fetchedNews);

        const isLikedByCurrentUser = fetchedNews?.liked_by?.includes(userId);
        setLikedStatus(isLikedByCurrentUser);
        const isDisLikedByCurrentUser =
          fetchedNews?.disliked_by?.includes(userId);
        setDisLikedStatus(isDisLikedByCurrentUser);
      }
    } catch (error) {
      setError(error?.response?.data?.Message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [newsId, userId]);

  const handleLike = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const likeHandle = {
        newsId: newsId,
        userId: userId,
      };
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/news/likes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            GET_NEWS_LIKES_API_KEY:
              process?.env?.NEXT_PUBLIC_NEWS_LIKES_API_KEY,
          },
          body: JSON.stringify(likeHandle),
        }
      );

      if (!resp.ok) {
        setLoading(false);
        setError("Failed to like news. Try Again.");
      }

      await resp.json();
      setLoading(false);
      setError("");
      await fetchData();
    } catch (error) {
      setLoading(false);
      setError(error?.message);
    }
  };

  const handleUnLike = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const likeHandle = {
        newsId: newsId,
        userId: userId,
      };
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/news/unlikes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            GET_NEWS_LIKES_API_KEY:
              process?.env?.NEXT_PUBLIC_NEWS_LIKES_API_KEY,
          },
          body: JSON.stringify(likeHandle),
        }
      );

      if (!resp.ok) {
        setLoading(false);
        setError("Failed to unlike news. Try Again.");
      }

      await resp.json();
      setLoading(false);
      setError("");
      await fetchData();
    } catch (error) {
      setLoading(false);
      setError(error?.message);
    }
  };

  const handleDisLike = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const likeHandle = {
        newsId: newsId,
        userId: userId,
      };
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/news/dislikes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            GET_NEWS_UNLIKES_API_KEY:
              process?.env?.NEXT_PUBLIC_NEWS_UNLIKES_API_KEY,
          },
          body: JSON.stringify(likeHandle),
        }
      );

      if (!resp.ok) {
        setLoading(false);
        setError("Failed to unlike news. Try Again.");
      }

      await resp.json();
      setLoading(false);
      setError("");
      await fetchData();
    } catch (error) {
      setLoading(false);
      setError(error?.message);
    }
  };

  const handleUnDisLike = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const likeHandle = {
        newsId: newsId,
        userId: userId,
      };
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/news/undislikes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            GET_NEWS_UNLIKES_API_KEY:
              process?.env?.NEXT_PUBLIC_NEWS_UNLIKES_API_KEY,
          },
          body: JSON.stringify(likeHandle),
        }
      );

      if (!resp.ok) {
        setLoading(false);
        setError("Failed to lift unlike news. Try Again.");
      }

      await resp.json();
      setLoading(false);
      setError("");
      await fetchData();
    } catch (error) {
      setLoading(false);
      setError(error?.message);
    }
  };

  return (
    <div>
      {loading ? (
        <button className="w-full bg-[#0D5C63] p-[2px] text-white font-bold rounded">
          <ButtonLoad />
        </button>
      ) : (
        <div>
          {error ? (
            <div className="w-full">
              {error && (
                <div
                  className={
                    "w-full text-red-600 text-center font-medium text-[12px]"
                  }
                >
                  <p>{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-8 items-center">
              <div className="flex items-center gap-2 text-[14px]">
                <span className="text-[#503E9D] font-medium">
                  {news?.likes}
                </span>
                {likedStatus ? (
                  <button
                    onClick={handleUnLike}
                    className="text-[#503E9D] bg-transparent"
                  >
                    <BiSolidLike />
                  </button>
                ) : (
                  <button
                    onClick={handleLike}
                    className="text-[#503E9D] bg-transparent"
                  >
                    <GrLike />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-[14px]">
                <span className="text-gray-600 font-medium">
                  {news?.dislikes}
                </span>
                {dislikedStatus ? (
                  <button
                    onClick={handleUnDisLike}
                    className="text-gray-600 bg-transparent"
                  >
                    <BiSolidDislike />
                  </button>
                ) : (
                  <button
                    onClick={handleDisLike}
                    className="text-gray-600 bg-transparent"
                  >
                    <GrDislike />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
