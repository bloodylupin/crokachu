import { useRef, useLayoutEffect } from "react";

import { Link } from "react-router-dom";

import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";

import Button from "../../components/Button";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const timelineRef = useRef<GSAPTimeline | null>(null);

    gsap.registerPlugin(TextPlugin);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            timelineRef.current = gsap
                .timeline()
                .from("h1", {
                    duration: 1,
                    text: ""
                })
                .from("h2", {
                    duration: 3,
                    text: ""
                })
                .from("p", {
                    duration: 3,
                    text: ""
                })
                .from(".bt", {
                    duration: .7,
                    autoAlpha: 0,
                    filter: "blur(50px)"
                })
                .to(".bt", {
                    scale: .95,
                    repeat: -1,
                    yoyo: true,
                    ease: "linear"
                })
        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <>
            <div className="min-h-screen flex bg-gradient-to-t from-fuchsia-900 to-transparent relative z-10" ref={containerRef}>
                <div className="relative z-10 flex items-center flex-col gap-4 mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center justify-end pb-24 lg:justify-center lg:pb-0 animation-container">
                    <h1>Crokachu</h1>
                    <h2 className="text-amber-100" style={{ textShadow: "1px -1px 3px #000" }}>5k PixelArt Cronos NFT Collection</h2>
                    <p className="text-amber-200">Grab your Crokachu and get ready for the battle!</p>
                    <Link to="/mint">
                        <Button className="bt">
                            MINT
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    )
}
