"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import ButtonLoad from "@/app/components/buttonload";

export default function ButtonFollow({ id, userId }) {
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          GET_USER_API_DETAIL_KEY: process.env.NEXT_PUBLIC_USER_API_DETAIL_KEY,
        },
      })
      .then((response) => {
        if (response?.status === 200) {
          setUserDetail(response?.data);
        }
      })
      .catch((error) => {
        console.error(error?.message);
      });
  }, [userId]);

  const handleFollow = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/users/subscribe_channels/${userId}`,
          { subscribedChannels: id },
          {
            headers: {
              "Content-Type": "application/json",
              GET_SUBSCRIBERS_API_KEY:
                process.env.NEXT_PUBLIC_SUBSCRIBERS_API_KEY,
            },
          }
        )
        .then((response) => {
          if (response?.status === 200) {
            setLoading(false);
            window.location.href = `/channel/${id}`;
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error(error?.response?.data?.Message);
        });
    } catch (error) {
      setLoading(false);
      console.error(error?.message, "Error");
    }
  };

  const handleUnfollow = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/users/unsubscribe_channels/${userId}`,
          { subscribedChannels: id },
          {
            headers: {
              "Content-Type": "application/json",
              GET_SUBSCRIBERS_API_KEY:
                process.env.NEXT_PUBLIC_SUBSCRIBERS_API_KEY,
            },
          }
        )
        .then((response) => {
          if (response?.status === 200) {
            setLoading(false);
            window.location.href = `/channel/${id}`;
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error(error?.response?.data?.Message);
        });
    } catch (error) {
      setLoading(false);
      console.error(error?.message);
    }
  };

  const findUserSub = userDetail?.subscribedChannels?.includes(id);

  return (
    <div>
      {findUserSub ? (
        loading ? (
          <button className="w-[90%] bg-[#0D5C63] py-2 px-4 text-white font-bold rounded-[5px]">
            <ButtonLoad />
          </button>
        ) : (
          <button
            className="border border-[#0D5C63] text-[#0D5C63] text-[14px] py-1 px-4 rounded-[20px]"
            onClick={handleUnfollow}
          >
            Unfollow
          </button>
        )
      ) : loading ? (
        <button className="w-[90%] bg-[#0D5C63] py-2 px-4 text-white font-bold rounded-[5px]">
          <ButtonLoad />
        </button>
      ) : (
        <button
          className="bg-[#0D5C63] text-white text-[14px] py-1 px-4 rounded-[20px]"
          onClick={handleFollow}
        >
          Follow
        </button>
      )}
    </div>
  );
}
