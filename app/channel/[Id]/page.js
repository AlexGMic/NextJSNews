import Sidebar from "@/app/home_page/sidebar";
import HomepageChannelDetail from "./homepage";

export default function page({ params }) {
  return (
    <div className="flex w-[100%]">
      <Sidebar />
      <HomepageChannelDetail params={params} />
    </div>
  );
}
