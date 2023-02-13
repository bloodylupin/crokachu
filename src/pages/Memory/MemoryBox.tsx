import { useCrokachu } from "../../contexts/CrokachuContext";

import Button from "../../components/Button";
import { useEffect, useState } from "react";

import { MIN_TO_PLAY } from "../Memory";

export default function MemoryBox() {
    const { favorites, setFavorites } = useCrokachu();

    const [tiles, setTiles] = useState<string[]>([]);

    useEffect(() => {
        for (let i = 0; i < MIN_TO_PLAY; i++) {
            setTiles(prevTiles => [...prevTiles, favorites[i] !== undefined ? favorites[i] : ""]);
        }
        return () => setTiles([]);

    }, [favorites]);

    return (
        <div className="grid grid-cols-3 gap-8 rounded-md p-8 bg-gradient-to-b from-fuchsia-900 to-slate-900 shadow-lg shadow-slate-900">
            {tiles.map((tile, i) => (
                tile !== "" ?
                    <Button className="relative" key={i} onClick={() => setFavorites!(prevFavorites => (
                        prevFavorites.filter(pf => pf !== tile)
                    ))}>
                        <img src={tile} alt={`favorites-${i + 1}`} />
                    </Button>
                    :
                    <Button key={i} className="pointer-events-none relative aspect-square">
                        <img className="filter blur" src="/img/crokachu-ph.png" alt="Place Holder Crokachu" />
                        <span className="rounded bg-fuchsia-900/30 p-2 absolute text-lg z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            {i + 1}
                        </span>
                    </Button>
            ))}
        </div>
    )
}
