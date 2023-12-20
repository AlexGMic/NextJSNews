import Sidebar from "../home_page/sidebar";
import SubsHomePage from "./homepage";

export default function page({searchParams}) {
  return (
    <div className="flex w-[100%]">
      <Sidebar />
      <SubsHomePage searchParams={searchParams} />
    </div>
  )
}
