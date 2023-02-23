import { ReactNode, useLayoutEffect, useState } from "react";

import Header from "./Header";
import Footer from "./Footer";

import Preloader from "../components/Preloader";

type LayoutPropsType = {
  children: ReactNode;
};

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function Layout({ children }: LayoutPropsType) {
  const [isLoaded, setIsLoaded] = useState(false);

  gsap.registerPlugin(ScrollTrigger);
  useLayoutEffect(() => {
    if (!isLoaded) return;
    ScrollTrigger.refresh();
  }, [isLoaded]);

  return (
    <>
      <Preloader isLoaded={isLoaded} />
      <Header />
      <div className="absolute top-0 left-0 right-0 z-0 h-screen">
        <video
          src="vid/crokachu-hero.mp4"
          muted
          autoPlay
          loop
          playsInline
          onCanPlay={() => setIsLoaded(true)}
          className={`pointer-events-none h-full w-full object-cover`}
        >
          <source src="vid/crokachu-video.mp4" type="video/mp4"></source>
        </video>
      </div>
      <div className="min-h-screen bg-fuchsia-600">{children}</div>
      <Footer />
    </>
  );
}
