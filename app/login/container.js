"use client";

import Login from "./login";
import Signup from "./signup";
import Image from "next/image";
import { useState } from "react";

export default function LoginContainer() {
  const [loginState, setLoginState] = useState(true);
  return (
    <div className="w-[100%] h-[100vh] min-h-[100vh] flex items-center">
      <div className="w-[90%] h-[100vh] mx-auto flex items-center max-[1400px]:w-full">
        <div className="w-[50%] max-[1100px]:hidden">
          <Image
            src="/MediaFolders/artwork-4.jpg"
            className="w-full object-cover"
            alt="News Image"
            width={500}
            height={500}
            placeholder="blur"
            blurDataURL="/MediaFolders/artwork-4.jpg"
          />
        </div>
        {loginState ? (
          <Login setLoginState={setLoginState} />
        ) : (
          <Signup setLoginState={setLoginState} />
        )}
      </div>
    </div>
  );
}
