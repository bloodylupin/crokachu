import { useEffect, useState } from "react";

import { useCrokachu } from "../../contexts/CrokachuContext";

import { useWeb3React } from "@web3-react/core";

import MemoryGame from "./MemoryGame";

import Button from "../../components/Button";
import RandomSelectorButton from "../../components/RandomSelectorButton";
import ResetSelectionButton from "../../components/ResetSelectionButton";

import { MIN_TO_PLAY } from "../Memory";

export default function MemoryBox() {
  const { favorites, setFavorites } = useCrokachu();

  const { account } = useWeb3React();

  const [tiles, setTiles] = useState<string[]>([]);

  useEffect(() => {
    for (let i = 0; i < MIN_TO_PLAY; i++) {
      setTiles((prevTiles) => [
        ...prevTiles,
        favorites[i] !== undefined ? favorites[i] : "",
      ]);
    }
    return () => setTiles([]);
  }, [favorites]);

  return (
    <>
      <div className="relative grid grid-cols-3 gap-8 rounded-md bg-gradient-to-b from-fuchsia-900 to-slate-900 p-8 shadow-lg shadow-slate-900">
        {tiles.map((tile, i) =>
          tile !== "" ? (
            <Button
              className="relative"
              key={i}
              onClick={() =>
                setFavorites!((prevFavorites) =>
                  prevFavorites.filter((pf) => pf !== tile)
                )
              }
            >
              <img src={tile} alt={`favorites-${i + 1}`} />
            </Button>
          ) : (
            <Button
              key={i}
              className="pointer-events-none relative aspect-square"
            >
              <img
                className="blur filter"
                src="/img/crokachu-ph.png"
                alt="Place Holder Crokachu"
              />
              <span className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded bg-fuchsia-900/30 p-2 text-lg">
                {i + 1}
              </span>
            </Button>
          )
        )}
      </div>
      <div className="flex justify-center gap-4">
        {account && favorites.length < MIN_TO_PLAY ? (
          <>
            <RandomSelectorButton />
          </>
        ) : null}
        {account && favorites.length > 0 && favorites.length < MIN_TO_PLAY ? (
          <>
            <ResetSelectionButton />
          </>
        ) : null}
      </div>
      {favorites.length === MIN_TO_PLAY ? (
        <MemoryGame />
      ) : null}
    </>
  );
}
