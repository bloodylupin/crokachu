import { useRef, useLayoutEffect, RefObject, useState } from "react";

import gsap from "gsap";

export default function Preloader() {

    const [isLoaded, setIsLoaded] = useState(false);

    const logoRef: RefObject<HTMLDivElement> | null = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(logoRef.current, {
                duration: 1,
                autoAlpha: 0,
                onComplete: () => setIsLoaded(() => true)
            });
        }, logoRef);
        return () => ctx.clear();
    }, [])

    return (
        <>{!isLoaded ?
            <div className="fixed top-0 bottom-0 left-0 right-0 bg-purple-900 flex items-center justify-center z-50" ref={logoRef}>
                <img src="img/crokachu-logo.svg" height="100" width="100" alt="Crokachu logo" className="animate-ping"/>
            </div> :
            null}
        </>
    )
}
