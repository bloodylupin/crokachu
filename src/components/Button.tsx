import { MouseEventHandler, ReactNode, RefObject, useRef, MutableRefObject, useLayoutEffect } from "react";

import gsap from "gsap";

type ButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>
    children: ReactNode
    className?: string
}

export default function Button({ onClick, children, className }: ButtonProps) {
    const buttonRef: RefObject<HTMLButtonElement> | null = useRef(null);
    const buttonTimelineRef: MutableRefObject<GSAPTimeline | null> | null = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            buttonTimelineRef.current = gsap.timeline({ paused: true });
            buttonTimelineRef.current.add(gsap.fromTo(
                buttonRef.current, {
                    boxShadow: "inset 0 0 0 #000"
                }, {
                    duration: .1,
                    boxShadow: "inset 0 0 5px #000"
                }
            ));
        }, buttonRef);
        return () => ctx.clear();
    }, []);

    return (
        <button ref={buttonRef} className={`uppercase bg-gradient-to-tr from-lime-600 to-lime-700 p-4 rounded-md ${className}`} onClick={onClick} onMouseDown={() => buttonTimelineRef!.current!.play()} onMouseUp={() => buttonTimelineRef!.current!.reverse()} onMouseLeave={() => { buttonTimelineRef!.current!.reverse() }} onTouchStart={() => buttonTimelineRef!.current!.play()} onTouchEnd={() => buttonTimelineRef!.current!.reverse()}>
            {children}
        </button>
    )
}
