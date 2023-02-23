import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { useState, useRef, useLayoutEffect, useEffect } from "react";

import { v4 as uuidv4 } from 'uuid';

type ImageType = {
    id: string
    url: string
}
type ChosenStateType = ImageType[][];

export default function Sneak() {
    const [chosen, setChosen] = useState<ChosenStateType>([]);

    // const [change, setChange] = useState<boolean>(false);

    useEffect(() => {
        const images: ImageType[] = [];
        for (let i = 1; i <= 36; i++) {
            images.push({
                id: uuidv4(),
                url: `${i}.png`
            });
        }

        const imagesArray: Array<ImageType> = [...images];
        const imagesChosen: ChosenStateType = [];

        const mediaQuery: MediaQueryList[] = [
            window.matchMedia("(min-width:768px"),
            window.matchMedia("(min-width:1200px)")
        ];
        const NUMBER_OF_IMAGES: Number = mediaQuery[1].matches ? 10 : mediaQuery[0].matches ? 7 : 3;

        for (let i = 0; i < 3; i++) {
            imagesChosen.push([]);
            for (let ii = 0; ii < NUMBER_OF_IMAGES; ii++) {
                const rnd = Math.floor(Math.random() * (imagesArray.length - 1)) + 1;
                imagesChosen[i].push({
                    id: imagesArray[i].id,
                    url: imagesArray[rnd].url
                });
                imagesArray.splice(rnd, 1);
            }
        }
        setChosen(imagesChosen);

        return () => setChosen([]);
    }, [/*change*/]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrolltriggerTimelineRef = useRef<GSAPTimeline | null>(null);

    gsap.registerPlugin(ScrollTrigger);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            scrolltriggerTimelineRef.current = gsap
                .timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        pin: true,
                        scrub: 1,
                        //markers: true
                    }
                })
                .fromTo(".animation-section:nth-child(odd)", {
                    x: "-5vw"
                }, {
                    x: "-45vw"
                })
                .fromTo(".animation-section:nth-child(2)", {
                    x: "-45vw"
                }, {
                    x: "-5vw",
                    delay: -.5
                });
        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, []);

    /*
    const clicktimelineRef = useRef<GSAPTimeline | null>(null);

    const handleOnClick = () => {
        clicktimelineRef.current?.reverse();
    }

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            clicktimelineRef.current = gsap
                .timeline()
                .from(".animation-section", {
                    filter: "blur(50px)",
                    autoAlpha: .5,
                    onReverseComplete: () => {
                        setChange(prevChange => !prevChange)
                    }
                })
        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, [change])*/

    return (
        <div className="min-h-screen flex flex-col justify-center overflow-hidden" ref={containerRef} onClick={() => {/*handleOnClick*/ }}>
            <div className="flex w-[150vw] animation-section mt-16 rotate-3">
                {chosen[0]?.map(image => (
                    <picture key={uuidv4()} className="aspect-square w-full object-cover">
                        <img src={`/img/nft/${image.url}`} alt={`crokachu-${uuidv4()}`} className="w-44 h-44 md:w-40 md:h-40 lg:w-72 lg:h-72 aspect-square shadow-lg shadow-slate-900" />
                    </picture>
                ))}
            </div>
            <div className="flex w-[150vw] animation-section -rotate-6">
                {chosen[1]?.map(image => (
                    <picture key={uuidv4()} className="aspect-square w-full object-cover">
                        <img src={`/img/nft/${image.url}`} alt={`crokachu-${uuidv4()}`} className="w-44 h-44 md:w-40 md:h-40 lg:w-72 lg:h-72 aspect-square shadow-lg shadow-slate-900" />
                    </picture>
                ))}
            </div>
            <div className="flex w-[150vw] animation-section rotate-3">
                {chosen[2]?.map(image => (
                    <picture key={uuidv4()} className="aspect-square w-full object-cover">
                        <img src={`/img/nft/${image.url}`} alt={`crokachu-${uuidv4()}`} className="w-44 h-44 md:w-40 md:h-40 lg:w-72 lg:h-72 aspect-square shadow-lg shadow-slate-900" />
                    </picture>
                ))}
            </div>
        </div>
    )
}
