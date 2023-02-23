import { Link } from "react-router-dom";

import { useCrokachu } from "../contexts/CrokachuContext";

import Button from "../components/Button";

import MemoryBox from "./Memory/MemoryBox";
import HighScores from "./Memory/HighScores";

export const MIN_TO_PLAY = 6;

export default function Memory() {
    const { favorites } = useCrokachu();

    return (
        <div className="py-20 min-h-screen flex bg-gradient-to-t from-fuchsia-900 to-transparent relative z-10">
            <div className="relative flex items-center flex-col gap-4 mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center justify-center">
                <div className="relative w-full">
                    <h1>Memory</h1>
                    <HighScores />
                </div>
                {favorites.length < MIN_TO_PLAY ?
                    <div className="grid gap-4 rounded-md p-8 bg-gradient-to-b from-fuchsia-900 to-slate-900 shadow-lg shadow-slate-900">
                        <p>
                            Select at least 6 NFTs on Collection Page to play!
                        </p>
                        <Link to="/collection">
                            <Button>
                                Collection
                            </Button>
                        </Link>
                    </div> : null
                }
                <MemoryBox />  
            </div>
        </div>
    )
}
