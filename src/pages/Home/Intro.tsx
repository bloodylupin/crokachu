import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Link } from "react-router-dom";

import { HeartIcon } from "@heroicons/react/24/solid";

import { useRef, useLayoutEffect } from "react";
import Button from "../../components/Button";

export default function Intro() {

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
                .from(".animation-section:nth-child(2)", {
                    rotate: 360,
                    x: "100%"
                })
                .from(".animation-section:nth-child(3)", {
                    x: "-100%"
                })
        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <div className="overflow-x-hidden">
            <div className="min-h-screen animation-container flex relative text-center" ref={containerRef}>
                <div className="animation-section bg-gradient-to-b from-fuchsia-900 to-slate-900 min-h-screen flex items-center absolute px-4 w-screen">
                    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                        <h2 className="fade-in">Do you <HeartIcon className="text-red-400 inline w-8" /> Pixel art?</h2>
                    </div>
                </div>
                <div className="animation-section min-h-screen flex items-center absolute px-4 w-screen">
                    <div className="bg-gradient-to-tr from-orange-300 to-orange-700 rounded-full mx-auto max-w-[500px] aspect-square p-8 relative">
                        <video src="vid/crokachu-video.mp4" muted autoPlay loop playsInline className={`w-full h-full aspect-square object-contain pointer-events-none rounded-full`}>
                            <source src="vid/crokachu-video.mp4" type="video/mp4"></source>
                        </video>
                    </div>
                </div>
                <div className="animation-section bg-gradient-to-b from-pink-500 to-pink-900 min-h-screen flex items-center absolute px-4 w-screen">
                    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                        <p className="mb-8 text-sm">We are pleased to present our project featuring a collection of unique and one-of-a-kind NFTs celebrating the birth of Crokachu. </p>
                        <h3 className="text-yellow-400" style={{ textShadow: "1px -1px 3px #000" }}>Gotta <span className="change-text-color">{("CRO").split("").map(c => <span key={c}>{c}</span>)}</span>tch'em all!</h3>
                        <Link to="/mint">
                            <Button className="mt-8">
                                MINT
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
