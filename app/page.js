import Homepage from "./home_page/homepage";
import Sidebar from "./home_page/sidebar";


export default function page({searchParams}) {
  return (
    <div className="flex w-[100%]">
      <Sidebar />
      <Homepage searchParams={searchParams} />
    </div>
  );
}
