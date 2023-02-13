import { useState, useEffect, RefObject, useRef } from "react";

import { useWeb3React } from "@web3-react/core";

import { RocketLaunchIcon } from "@heroicons/react/24/outline";

import { useCrokachu } from "../../contexts/CrokachuContext";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Answer from "../../components/Answer";

import { MIN_TO_PLAY } from "../Memory";

import HighScores from "./HighScores";

export default function MemoryGame() {

    const { account } = useWeb3React();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        if (!account) return;
        setUserName(`${account?.slice(0, 5)}...${account?.slice(0 - 3)}`);

        return () => setUserName(null);
    }, [account]);

    const { favorites } = useCrokachu();
    const [tiles, setTiles] = useState<{
        id: number
        image: string
        revealed: boolean
        right?: boolean
    }[]>([]);

    const [show, setShow] = useState(false);
    useEffect(() => {
        const selectedNfts = [...favorites, ...favorites].sort(() => Math.random() - 0.5)

        selectedNfts.forEach((nft, index) => {
            setTiles(prevTiles => {
                return [...prevTiles, {
                    id: index,
                    image: nft,
                    revealed: false,
                    right: undefined
                }];
            });
        })

        return () => {
            setTiles([]);
            setTileRevealed({ id: null, symbol: null });
            setPoints(0);
            setMoves(0);
            setTime(60);
        }
    }, [show]);

    const containerRef: RefObject<HTMLDivElement> | null = useRef(null);

    const [tileRevealed, setTileRevealed] = useState<{
        id: number | null
        symbol: string | null
    }>({ id: null, symbol: null });

    const [moves, setMoves] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);

    const handleOnClick = (id: number) => {
        setTiles(prevTiles => prevTiles.map(tile => tile.id !== id ? tile : { ...tile, revealed: true }))
        setTileRevealed({ id: id, symbol: tiles[id].image });

        if (tileRevealed.id === null) return;
        if (tileRevealed.symbol === null) return;

        setMoves(prevMoves => prevMoves + 1);

        if (tileRevealed.symbol === tiles[id].image) {
            setTiles(prevTiles => prevTiles.map(tile => tile.id === id || tile.image === tiles[id].image ?
                { ...tile, right: true } : tile));
            setPoints(prevPoints => prevPoints + 1);
            setTileRevealed({ id: null, symbol: null });
        } else {
            containerRef.current?.classList.add("pointer-events-none");
            setTiles(prevGrid => prevGrid.map(tile => {
                return tile.id === id || tile.id === tileRevealed.id ? { ...tile, right: false } : tile
            }));

            setTimeout(() => {
                setTiles(prevGrid => prevGrid.map(tile => {
                    return tile.id === id || tile.id === tileRevealed.id ?
                        { ...tile, revealed: false, right: undefined } :
                        tile
                }));
                containerRef.current?.classList.remove("pointer-events-none");
                setTileRevealed({ id: null, symbol: null });
            }, 1000);
        }
    };

    const [placement, setPlacement] = useState(0);
    useEffect(() => {
        if (points === MIN_TO_PLAY) {
            (async () => {
                try {
                    console.log(Math.floor((time / moves) * 100));
                    const res = await fetch("https://420row.com:3457/scores420", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: userName,
                            score: Math.floor((time / moves) * 100),
                            game_id: "test"
                        })
                    });
                    setPlacement((await res.json()).placement);
                }
                catch (error) {
                    console.log(error);
                }
            })();
        };
    }, [points]);

    const [time, setTime] = useState(60);
    useEffect(() => {
        if (points === MIN_TO_PLAY) return;
        const timer = setInterval(() => {
            setTime(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [points]);

    return (
        <>
            <Button onClick={() => setShow(true)}>
                start game
            </Button>
            <Modal show={show} setShow={setShow} fullWidth>
                <>
                    {time > 0 ?
                        points < MIN_TO_PLAY ?
                            <>
                                {/*<div ref={titleRef} className="absolute grid place-content-center top-0 bottom-0 left-0 right-0 bg-blue-900/90 z-30">
                                <h3 className="text-5xl"></h3>
                            </div>*/}
                                <div className="absolute top-1 left-0 px-4">
                                    Time: {time}
                                </div>
                                <div className="absolute top-1 right-0 px-4">
                                    Moves: {moves}
                                </div>
                                <div className="grid grid-cols-3 grid-rows-4" ref={containerRef}>
                                    {tiles.map((f, i) => {
                                        switch (f.right) {
                                            case undefined: return <Button className="p-0 grid place-content-center aspect-square" onClick={() => handleOnClick(i)} key={i}>
                                                {f.revealed ?
                                                    <img src={f.image} alt={`memory-tile-${i}`} className="aspect-square object-contain rounded" /> : <RocketLaunchIcon className="w-8 h-8" />}
                                            </Button>
                                            case true: return <Button className="p-0 grid place-content-center aspect-square pointer-events-none" key={i}>
                                                <img src={f.image} alt={`memory-tile-${i}`} className="bg-green-400 p-1 rounded aspect-square object-contain" />
                                            </Button>
                                            case false: return <Button className="p-0 grid place-content-center aspect-square pointer-events-none" key={i}>
                                                <img src={f.image} alt={`memory-tile-${i}`} className="bg-red-600 p-1 rounded aspect-square object-contain" />
                                            </Button>
                                        }
                                    })}
                                </div>
                            </> :
                            <>
                                <Answer success={true}>
                                    You won in {moves} moves!<br/>
                                    You scored {Math.floor((time / moves) * 100)} points!<br/>
                                    Placement: {placement}
                                </Answer>
                                <div className="relative">
                                    <HighScores />
                                </div>
                            </> :
                        <Answer success={false}>
                            You run out of time!
                        </Answer>
                    }

                </>
            </Modal>
        </>
    )
}
