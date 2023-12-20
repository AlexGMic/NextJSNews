import Navbar from "./navbar";
import NewsAll from "./NewsAll";
import { Suspense } from "react";
import Loading from "../loading";

export default function NewsExplore({searchParams}) {
  return (
    <div className="w-[85%] absolute top-0 left-[15%] min-h-[100vh] max-[1700px]:w-[80%] max-[1700px]:left-[20%] max-[1200px]:w-[92%] max-[1200px]:left-[8%] max-[1080px]:w-[85%] max-[1080px]:left-[15%] max-[600px]:w-[82%] max-[600px]:left-[18%]">
      <Navbar />
      <Suspense fallback={<Loading />}>
        <NewsAll searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
