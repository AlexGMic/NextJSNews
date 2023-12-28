import Image from "next/image";
import ResetPassword from "./resetPassword";

export default function page() {
  return (
    <div className="w-[100%] h-[100vh] min-h-[100vh] flex items-center">
      <div className="w-[90%] h-[100vh] mx-auto flex items-center max-[1400px]:w-full">
        {/* <div className="w-[50%] max-[1100px]:hidden">
          <Image
            className="w-full object-cover"
            src={"/artwork-4.jpg"}
            priority={true}
            alt="News Image"
            width={500}
            height={500}
          />
        </div> */}
        <ResetPassword />
      </div>
    </div>
  );
}
