import Sidebar from "@/app/home_page/sidebar";
import NewsDetailExplore from "./homepage";

export default function page({ params }) {
  return (
    <div className="flex w-[100%]">
      <Sidebar />
      <NewsDetailExplore params={params} />
    </div>
  );
}
