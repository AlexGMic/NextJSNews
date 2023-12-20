"use client";

import { useEffect, useState } from "react";
import ResponsiveSidebar from "./responsive_sidebar";
import UnResponsiveSidebar from "./unresponsive_sidebar";

export default function Sidebar() {
  const [isWideScreen, setIsWideScreen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1200);
    };

    // Initial check on mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {isWideScreen ? <UnResponsiveSidebar /> : <ResponsiveSidebar />}
    </div>
  )
}
