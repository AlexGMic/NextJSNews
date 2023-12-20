import Link from "next/link";

export default function Error() {
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div className="w-[60%] mx-auto border border-dashed border-[#878787] rounded-lg p-8">
        <div className="w-full text-center">
          <p className="text-5xl font-semibold my-4 mb-16 text-[#0D5C63]">Abyssinia News</p>
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-8 text-[#878787]">
          <p className="text-4xl font-semibold">404 Page</p>
          <p className="text-3xl font-semibold">Page not found</p>
          <Link href={'/'} className="bg-[#0D5C63] text-white text-2xl font-semibold px-4 py-2 rounded-3xl hover:bg-transparent hover:text-[#0D5C63] transition duration-500 border border-[#0D5C63]">Home Page</Link>
        </div>
      </div>
    </div>
  )
}
