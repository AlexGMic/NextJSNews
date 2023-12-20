import UserProfileEdit from "./homepage";
import Sidebar from "@/app/home_page/sidebar";

export default function page() {
  return (
    <div className="flex w-[100%]">
      <Sidebar />
      <UserProfileEdit />
    </div>
  );
}
