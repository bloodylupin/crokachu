import { useRef, useLayoutEffect, RefObject, useState } from "react";

import gsap from "gsap";

type PreloaderProps = {
    isLoaded: boolean
}

export default function Preloader({ isLoaded }: PreloaderProps) {

    const [isToRemove, setIsToRemove] = useState(false);

    const logoRef: RefObject<HTMLDivElement> | null = useRef(null);

    useLayoutEffect(() => {
        if (!isLoaded) return;
        const ctx = gsap.context(() => {
            gsap.to(logoRef.current, {
                duration: 1,
                autoAlpha: 0,
                onComplete: () => setIsToRemove(() => true)
            });
        }, logoRef);
        return () => ctx.clear();
    }, [isLoaded]);

    return (
        <>
            {!isToRemove ?
                <div className="fixed top-0 bottom-0 left-0 right-0 bg-purple-900 flex items-center justify-center z-50" ref={logoRef}>
                    <img src="img/crokachu-logo.svg" height="100" width="100" alt="Crokachu logo" className="animate-ping" />
                </div> :
                null}
        </>
    )
}
