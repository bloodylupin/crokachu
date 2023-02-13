import { useLayoutEffect, useRef } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function Showcase() {

    const containerRef = useRef<HTMLDivElement | null>(null);
    const timelineRef = useRef<GSAPTimeline | null>(null);

    gsap.registerPlugin(ScrollTrigger);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            timelineRef.current = gsap
                .timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        pin: true,
                        scrub: 1,
                        //markers: true
                    }
                })

            document.querySelectorAll(".showcase-section").forEach((el, i) => {
                timelineRef.current!.add(
                    gsap.from(`.showcase-section:nth-child(${i + 1}) figure`, {
                        scale: 0,
                        autoAlpha: 0
                    }))
                    .add(
                        gsap.fromTo(`.showcase-section:nth-child(${i + 1}) h3`, {
                            autoAlpha: 0,
                            yPercent: 0
                        }, {
                            autoAlpha: 1,
                            yPercent: (i + 1) * 100
                        })
                    )
            });
        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, []);

    const shSections = [
        "background",
        "body",
        "t-shirt",
        "nose",
        "mouth",
        "eyes",
        "accessories",
    ];

    return (
        <>
            <div className="overflow-x-hidden">
                <h2 className="fade-in mb-8 text-center">NFT Showcase</h2>
                <div className="min-h-screen animation-container relative text-center" ref={containerRef}>
                    {shSections.map((s, i) => (
                        <div className="showcase-section min-h-screen grid md:grid-cols-2 place-content-center absolute px-4 w-screen" key={i}>
                            <div className="flex items-center justify-around">
                                <figure>
                                    <img src={`img/showcase/sh-${i + 1}.png`} alt={`sh-${i}`} />
                                </figure>
                            </div>
                            <div className="lg:mt-16">
                                <h3 style={{
                                    textShadow: "1px -1px 3px #000"
                                }}>{s}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
