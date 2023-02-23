import { ReactNode, useState } from "react";

import Header from "./Header";
import Footer from "./Footer";

import Preloader from "../components/Preloader";

type LayoutPropsType = {
    children: ReactNode
}

export default function Layout({ children }: LayoutPropsType) {

    const [isLoaded, setIsLoaded] = useState(false);
    return (
        <>
            <Preloader isLoaded={isLoaded} />
            <Header />
            <div className="absolute top-0 left-0 right-0 h-screen z-0">
                <video src="vid/crokachu-hero.mp4" muted autoPlay loop playsInline
                    onCanPlay={() => setIsLoaded(true)}
                    className={`w-full h-full object-cover pointer-events-none`}>
                    <source src="vid/crokachu-video.mp4" type="video/mp4"></source>
                </video>
            </div>
            <div className="bg-fuchsia-600 min-h-screen">{children}</div>
            <Footer />
        </>

    )
}
