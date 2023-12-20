import Sidebar from "../home_page/sidebar";
import ChannelHomepage from "./homepage";

export default function page({searchParams}) {
  return (
    <div className="flex w-[100%]">
      <Sidebar />
      <ChannelHomepage searchParams={searchParams} />
    </div>
  )
}
