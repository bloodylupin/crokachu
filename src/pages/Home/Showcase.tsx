import { useEffect, useLayoutEffect, useRef, useState } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { SparklesIcon } from "@heroicons/react/24/outline";

import Button from "../../components/Button";

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<GSAPTimeline | null>(null);

  gsap.registerPlugin(ScrollTrigger);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          //markers: true
        },
      });

      document.querySelectorAll(".showcase-section").forEach((el, i) => {
        timelineRef
          .current!.add(
            gsap.fromTo(
              el.querySelector("button"),
              {
                autoAlpha: 0,
                yPercent: 0,
              },
              {
                autoAlpha: 1,
                yPercent: (i + 2) * 100,
              }
            )
          )
          .add(
            gsap.from(el.querySelector("figure"), {
              scale: 0,
              autoAlpha: 0,
            })
          )
          .add(
            gsap.to(el.querySelector("button"), {
              scale: 1.1,
              yoyo: true,
            })
          );
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const shSections = [
    { trait: "background", count: 33 },
    { trait: "body", count: 26 },
    { trait: "t-shirt", count: 47 },
    { trait: "nose", count: 23 },
    { trait: "mouth", count: 36 },
    { trait: "eyes", count: 25 },
    { trait: "accessories", count: 36 },
  ];

  const [traits, setTraits] = useState<number[]>([]);
  const [changed, setChanged] = useState(0);

  useEffect(() => {
    Object.values(shSections).forEach(({ trait, count }) => {
      const random = Math.floor(Math.random() * (count - 1)) + 1;

      setTraits((prevTraits) => [...prevTraits, random]);
    });
    return () => {
      setTraits([]);
      setChanged(0);
    };
  }, [changed]);

  const shSectionsElements = Object.values(shSections).map(
    ({ trait, count }, i) => {
      return (
        <div
          className="showcase-section absolute grid h-screen w-full place-content-center px-4 md:grid-cols-2 xl:left-1/3 xl:w-auto"
          key={trait}
        >
          <div className="flex items-center justify-around">
            <figure>
              {traits.length > 0 ? (
                <img
                  src={`img/showcase/${i + 1}_${trait}/crokachu-${trait}-${
                    traits[i]
                  }.png`}
                  alt={`crokachu-${trait}-${i + 1}`}
                  className="w-64 md:w-96"
                />
              ) : null}
            </figure>
          </div>
          <div>
            <Button
              className="relative z-30 p-0 md:p-1"
              onClick={() => {
                setTraits((prevTraits) =>
                  prevTraits.map((t, ii) =>
                    i === ii ? Math.floor(Math.random() * (count - 1)) + 1 : t
                  )
                );
              }}
            >
              {trait}
            </Button>
          </div>
        </div>
      );
    }
  );

  return (
    <>
      <div className="overflow-x-hidden">
        <div
          className="animation-container relative min-h-screen text-center"
          ref={containerRef}
        >
          <h2 className="fade-in absolute top-24 left-1/2 -translate-x-1/2">
            NFT Showcase
          </h2>
          {shSectionsElements}
          <Button
            onClick={() => {
              setChanged((prevChanged) => prevChanged + 1);
            }}
            className="absolute bottom-16 right-4 h-12 w-12 from-orange-700 to-orange-900 md:left-1/2 md:-translate-x-1/2"
          >
            <SparklesIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
