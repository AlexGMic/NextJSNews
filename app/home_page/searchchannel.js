"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";


export default function SearchChannel() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [text, setText] = useState();
  const [query] = useDebounce(text,300)

  useEffect(()=>{
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router?.push(`${pathname}?${params.toString()}`);

  },[query, router])

  return (
    <div className="flex-1 bg-[#F7F7F7] p-2 flex items-center gap-[10px] rounded-[5px]">
      <IoSearchSharp className="text-[20px] text-gray-500" />
      <input
        type="text"
        onChange={(e)=>setText(e?.target?.value)}
        className="bg-transparent w-[100%] p-2 outline-none"
        placeholder="Search channel"
      />
    </div>
  );
}
