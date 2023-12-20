import { FaRegCopyright } from "react-icons/fa";


export default function Footer() {
  return (
    <div className="w-full bg-slate-100 shadow-xl mt-24 px-4 py-8 flex justify-center items-center max-[600px]:px-1">
      <p className="flex items-center gap-4 text-gray-600 font-medium max-[600px]:gap-1 max-[600px]:text-[14px] max-[450px]:text-[11px]"><FaRegCopyright className="font-semibold text-[24px] text-[#0D5C63] max-[600px]:text-[20px] max-[450px]:text-[18px]" />  Copyright Alem Gebremichael. All rights reserved.</p>
    </div>
  )
}
