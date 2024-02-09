import { ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import ReactDom from "react-dom";

import { classNames } from "../utilities/classNames";

type ModalProps = {
    children: ReactNode
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
    fullWidth?: boolean
}

export default function Modal({ children, show, setShow, fullWidth }: ModalProps): JSX.Element {
    const handleClose = () => {
        setShow(false)
    }
    useEffect(() => {
        if (!show) return;
        document.querySelector("body")?.classList.add("overflow-y-hidden");
        return () => {
            document.querySelector("body")?.classList.remove("overflow-y-hidden");
        }
    }, [show]);
    return ReactDom.createPortal(
        <>
            {show ?
                <div className="fixed font-pressStart text-center top-0 bottom-0 left-0 right-0 z-30">
                    <div className="backdrop fixed top-0 bottom-0 left-0 right-0 bg-black/50 cursor-pointer" onClick={handleClose}></div>
                    <div className={classNames(fullWidth ? "w-full max-w-md max-h-screen" : "", "content bg-gradient-to-t from-fuchsia-900 to-fuchsia-700 text-white rounded p-8 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")}>
                        {children}
                    </div>
                </div> :
                null
            }
        </>,
        document.getElementById("portal")!
    )
}
