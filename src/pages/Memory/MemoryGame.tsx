import { useState, useEffect, RefObject, useRef, useLayoutEffect } from "react";

import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";

import { useWeb3React } from "@web3-react/core";

import { RocketLaunchIcon } from "@heroicons/react/24/outline";

import { useCrokachu } from "../../contexts/CrokachuContext";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Answer from "../../components/Answer";

import { MIN_TO_PLAY } from "../Memory";

import HighScores from "./HighScores";

export function userNameInterpolation(account?: string | null) {
    return `${account?.slice(2, 5)}...${account?.slice(0 - 3)}`
}

export default function MemoryGame() {

    const { account } = useWeb3React();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        if (!account) return;
        setUserName(userNameInterpolation(account));
        return () => setUserName(null);
    }, [account]);

    const { favorites, signTransaction, jwtToken, setJwtToken } = useCrokachu();
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
            setStarted(false);
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
        if (points === MIN_TO_PLAY && jwtToken !== null) {
            (async () => {
                const score = Math.floor((time / moves) * 100);
                try {
                    const res = await fetch("https://jackyolo.xyz/api/scores", {
                        method: "POST",
                        headers: {
                            "Authorization": `JWT ${jwtToken}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: userName,
                            score: score,
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

    const [started, setStarted] = useState(false);

    const [time, setTime] = useState(60);
    useEffect(() => {
        if (!started) return;
        if (points === MIN_TO_PLAY) return;
        const timer = setInterval(() => {
            setTime(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [started, points]);

    gsap.registerPlugin(TextPlugin);

    const titleContainerRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const titleTlRef = useRef<GSAPTimeline | null>(null);

    useLayoutEffect(() => {
        if (!show) return;
        const ctx = gsap.context(() => {
            titleTlRef.current = gsap.timeline({
                defaults: {
                    duration: 1
                },
                onComplete: () => setStarted(true)
            })
                .fromTo(titleRef.current, {
                    autoAlpha: 0,
                    x: 0,
                    y: 0,
                    scale: 1
                }, {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    text: "Get Ready"
                })
                .fromTo(titleRef.current, {
                    autoAlpha: 0,
                    y: -300,
                    text: ""
                }, {
                    autoAlpha: 1,
                    y: 0,
                    text: "3",
                    color: "green"
                })
                .fromTo(titleRef.current, {
                    autoAlpha: 0,
                    x: 300,
                    text: ""
                }, {
                    autoAlpha: 1,
                    x: 0,
                    text: "2",
                    color: "yellow"
                })
                .fromTo(titleRef.current, {
                    autoAlpha: 0,
                    y: 300,
                    text: ""
                }, {
                    autoAlpha: 1,
                    y: 0,
                    text: "1",
                    color: "white"
                })
                .fromTo(titleRef.current, {
                    autoAlpha: 0,
                    scale: 0,
                    text: ""
                }, {
                    autoAlpha: 1,
                    scale: 3,
                    text: "GO",
                    color: "red"
                })
                .to(titleRef.current, {
                    duration: .5,
                    delay: -.3,
                    repeat: 1,
                    autoAlpha: 0
                })
                .to(titleContainerRef.current, {
                    autoAlpha: 0
                })
        })
        return () => ctx.clear();
    }, [show, started]);

    return (
        <>
            {jwtToken === undefined ?
                <>
                    <Button onClick={() => {
                        signTransaction!();
                    }}>
                        Sign in
                    </Button>
                    <Button onClick={() => {
                        setJwtToken!(null);
                    }}>
                        Solo mode
                    </Button>
                </>
                : <>
                    <Button onClick={() => {
                        setShow(true);
                    }}>
                        start game
                    </Button>
                    {jwtToken ? <p>Signed as {userName}</p> : <p>Playing as guest</p>}
                    <Button onClick={() => setJwtToken!(undefined)}>
                        Sign out
                    </Button>
                </>
            }
            <Modal show={show} setShow={setShow} fullWidth>
                <>
                    {time > 0 ?
                        points < MIN_TO_PLAY ?
                            <>
                                {!started ? <div className="absolute grid place-content-center inset-0 rounded bg-slate-900/90 z-30" ref={titleContainerRef}>
                                    <h3 className="text-5xl" ref={titleRef}></h3>
                                </div> : null}
                                <div className="absolute top-1 left-0 px-4">
                                    Time: {time}
                                </div>
                                <div className="absolute top-1 right-0 px-4">
                                    Moves: {moves}
                                </div>
                                <div className="grid grid-cols-3 grid-rows-4" ref={containerRef}>
                                    {tiles.map((f, i) => {
                                        switch (f.right) {
                                            case undefined: return (
                                                f.revealed ?
                                                    <Button className="p-0 grid place-content-center aspect-square pointer-events-none" key={i}>
                                                        <img src={f.image} alt={`memory-tile-${i}`} className="aspect-square object-contain rounded" />
                                                    </Button> :
                                                    <Button className="p-0 grid place-content-center aspect-square" onClick={() => handleOnClick(i)} key={i}>
                                                        <RocketLaunchIcon className="w-8 h-8" />
                                                    </Button>

                                            )
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
                                    <span className="block">
                                        You won in {moves} moves!
                                    </span>
                                    <span className="block">
                                        You scored {Math.floor((time / moves) * 100)} points!
                                    </span>
                                    {jwtToken !== null ?
                                        <>
                                            <span className="block">
                                                Placement: {placement}
                                            </span>
                                        </> :
                                        null
                                    }
                                </Answer>
                                <div className="relative">
                                    <HighScores placement={placement} />
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
