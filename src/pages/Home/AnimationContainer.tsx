import {
  ReactNode,
  useRef,
  useLayoutEffect,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type AnimationContainerProps = {
  children: ReactNode;
};

export default function AnimationContainer({
  children,
}: AnimationContainerProps) {
  gsap.registerPlugin(ScrollTrigger);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const fadeInTimelineRef = useRef<GSAPTimeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const fadeInElements = document.querySelectorAll(".fade-in");
      fadeInTimelineRef!.current = gsap.timeline();
      fadeInElements.forEach((element) => {
        fadeInTimelineRef.current!.add(
          gsap.fromTo(
            element,
            {
              autoAlpha: 0,
              filter: "blur(50px)",
            },
            {
              autoAlpha: 1,
              filter: "blur(0px)",
              scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "center 90%",
                scrub: 1,
                //markers: { fontSize: "25px", endColor: "white" },
              },
            }
          )
        );
      });
    }, containerRef);
    return () => {
      ctx.clear();
    };
  }, []);

  const changeTextColorTimelineRef = useRef<GSAPTimeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const chars = document.querySelectorAll(".change-text-color>span");

      changeTextColorTimelineRef.current = gsap.timeline({
        repeat: -1,
        yoyo: true,
      });

      chars?.forEach((c) => {
        changeTextColorTimelineRef
          .current!.add(gsap.to(c, { color: "#816894" }))
          .add(gsap.to(c, { color: "#91eb13" }))
          .add(gsap.to(c, { color: "#e4b706" }));
      });
    }, containerRef);
    return () => ctx.clear();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
