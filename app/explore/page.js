import Sidebar from "../home_page/sidebar";
import NewsExplore from "./homepage";

export default function page({searchParams}) {
  return (
    <div className="flex w-[100%]">
      <Sidebar />
      <NewsExplore searchParams={searchParams} />
    </div>
  )
}
