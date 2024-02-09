import { useState } from "react";

import { Link } from "react-router-dom";

import { useCrokachu } from "../contexts/CrokachuContext";

import Button from "../components/Button";

import MemoryBox from "./Memory/MemoryBox";
import AudioSettings from "./Memory/AudioSettings";
import HighScores from "./Memory/HighScores";

export const MIN_TO_PLAY = 6;

export default function Memory() {
  const { favorites } = useCrokachu();

  return (
    <div className="relative z-10 flex min-h-screen bg-gradient-to-t from-fuchsia-900 to-transparent py-20">
      <div className="relative mx-auto flex max-w-xl flex-col items-center justify-center gap-4 px-4 text-center sm:px-6 lg:px-8">
        <div className="relative w-full">
          <AudioSettings />
          <h1>Memory</h1>
          <HighScores />
        </div>
        {favorites.length < MIN_TO_PLAY ? (
          <div className="grid gap-4 rounded-md bg-gradient-to-b from-fuchsia-900 to-slate-900 p-8 shadow-lg shadow-slate-900">
            <p>Select at least 6 NFTs on Collection Page to play!</p>
            <Link to="/collection">
              <Button>Collection</Button>
            </Link>
          </div>
        ) : null}
        <MemoryBox />
      </div>
    </div>
  );
}
