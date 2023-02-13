import { Link } from "react-router-dom";

import Logo from "../components/Logo";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-tr from-purple-700 to-purple-900">
            <nav>
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="flex flex-1 items-stretch justify-between">
                            <div className="flex items-center gap-4">
                                <Link to="/">
                                    <Logo />
                                </Link>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-white">Crokachu</h1>
                            </div>
                            <ul className="flex items-center gap-4">
                                <li>
                                    <a href="https://twitter.com/crokachu_cro" target="_blank" className="rounded-full grid place-content-center w-8 h-8"><img src="img/twitter-logo.svg" alt="Twitter Logo" className="w-full h-full" />
                                    </a>
                                </li>
                                <li>
                                    <a href="https://discord.gg/NsbVaDq6dw" target="_blank" className="bg-white rounded-full grid place-content-center w-8 h-8">
                                        <img src="img/discord-logo.svg" alt="Discord Logo" width={24} height={24} />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </nav>
        </footer>
    )
}
