import { useState, useEffect, useRef, useLayoutEffect } from "react";

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
import userNameInterpolation from "../../utilities/userNameInterpolation";
import discordNameSlice from "../../utilities/discordNameSlice";

export const gameId = "Memory";

const revealAudio = new Audio("/audio/reveal.mp3");
const successAudio = new Audio("/audio/success.mp3");
const errorAudio = new Audio("/audio/error.mp3");

const winAudio = new Audio("/audio/win.mp3");
const loseAudio = new Audio("/audio/lose.mp3");

const bgMusic = new Audio("/audio/bgMusic.mp3");

const introAudio = new Audio("/audio/intro.mp3");

export default function MemoryGame() {
  const { account } = useWeb3React();
  const [userName, setUserName] = useState<string | null>(null);
  const [discordName, setDiscordName] = useState<string | null>(null);

  const { favorites, signTransaction, jwtToken, setJwtToken, audioOn } =
    useCrokachu();

  useEffect(() => {
    if (!account) return;
    if (!jwtToken) return;
    (async () => {
      try {
        setUserName(account);
        const res = await fetch(
          "https://jackyolo.xyz/verification-bot/convert-addresses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ addresses: [account] }),
          }
        );

        const accountData: {
          [address: string]: {
            name: string;
            id: string;
          };
        } = await res.json();

        if (Object.hasOwn(accountData, account))
          setDiscordName(accountData[account].name);
      } catch (error) {
        console.log(error);
      }
    })();
    return () => setUserName(null);
  }, [account, jwtToken]);

  const [tiles, setTiles] = useState<
    {
      id: number;
      image: string;
      revealed: boolean;
      right?: boolean;
    }[]
  >([]);

  const [show, setShow] = useState(false);
  useEffect(() => {
    const selectedNfts = [...favorites, ...favorites].sort(
      () => Math.random() - 0.5
    );

    selectedNfts.forEach((nft, index) => {
      setTiles((prevTiles) => {
        return [
          ...prevTiles,
          {
            id: index,
            image: nft,
            revealed: false,
            right: undefined,
          },
        ];
      });
    });

    return () => {
      setTiles([]);
      setTileRevealed({ id: null, symbol: null });
      setPoints(0);
      setMoves(0);
      setTime(60);
      setGameStatus("intro");
    };
  }, [show]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [tileRevealed, setTileRevealed] = useState<{
    id: number | null;
    symbol: string | null;
  }>({ id: null, symbol: null });

  const [moves, setMoves] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);

  const handleOnClick = (id: number) => {
    setTiles((prevTiles) =>
      prevTiles.map((tile) =>
        tile.id !== id ? tile : { ...tile, revealed: true }
      )
    );
    setTileRevealed({ id: id, symbol: tiles[id].image });

    if (tileRevealed.id === null && tileRevealed.symbol === null) {
      audioOn && revealAudio.play();
      return;
    }

    setMoves((prevMoves) => prevMoves + 1);

    if (tileRevealed.symbol === tiles[id].image) {
      audioOn && successAudio.play();
      setTiles((prevTiles) =>
        prevTiles.map((tile) =>
          tile.id === id || tile.image === tiles[id].image
            ? { ...tile, right: true }
            : tile
        )
      );
      setPoints((prevPoints) => prevPoints + 1);
      setTileRevealed({ id: null, symbol: null });
    } else {
      audioOn && errorAudio.play();
      containerRef.current?.classList.add("pointer-events-none");
      setTiles((prevGrid) =>
        prevGrid.map((tile) => {
          return tile.id === id || tile.id === tileRevealed.id
            ? { ...tile, right: false }
            : tile;
        })
      );

      setTimeout(() => {
        setTiles((prevGrid) =>
          prevGrid.map((tile) => {
            return tile.id === id || tile.id === tileRevealed.id
              ? { ...tile, revealed: false, right: undefined }
              : tile;
          })
        );
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
              Authorization: `JWT ${jwtToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: userName,
              score: score,
              game_id: gameId,
            }),
          });
          setPlacement((await res.json()).placement);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [points]);

  const [gameStatus, setGameStatus] = useState<
    "intro" | "started" | "finished"
  >("intro");

  const [time, setTime] = useState(60);
  useEffect(() => {
    if (!show) return;
    if (gameStatus !== "started") return;
    if (points === MIN_TO_PLAY) {
      setGameStatus("finished");
      audioOn && winAudio.play();
      return;
    }

    const timer = setInterval(() => {
      setTime((prevTime) => {
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time, show, gameStatus, points]);

  useEffect(() => {
    if (!audioOn) return;
    if (time === 0) {
      setGameStatus("finished");
      loseAudio.play();
    }

    return () => {
      loseAudio.pause();
      loseAudio.currentTime = 0;
    };
  }, [time]);

  gsap.registerPlugin(TextPlugin);

  useEffect(() => {
    if (!show) return;
    if (!audioOn) return;
    if (gameStatus === "started") bgMusic.play();
    else if (gameStatus === "finished") {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, [show, gameStatus]);

  const titleContainerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const titleTlRef = useRef<GSAPTimeline | null>(null);

  useLayoutEffect(() => {
    if (!show) return;
    if (gameStatus !== "intro") return;
    audioOn && introAudio.play();
    titleTlRef.current = gsap
      .timeline({
        defaults: {
          duration: 1,
        },
        onComplete: () => setGameStatus("started"),
      })
      .fromTo(
        titleRef.current,
        {
          autoAlpha: 0,
          x: 0,
          y: 0,
          scale: 1,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          text: "Get Ready",
        }
      )
      .fromTo(
        titleRef.current,
        {
          autoAlpha: 0,
          y: -300,
          text: "",
        },
        {
          autoAlpha: 1,
          y: 0,
          text: "3",
          color: "green",
        }
      )
      .fromTo(
        titleRef.current,
        {
          autoAlpha: 0,
          x: 300,
          text: "",
        },
        {
          autoAlpha: 1,
          x: 0,
          text: "2",
          color: "yellow",
        }
      )
      .fromTo(
        titleRef.current,
        {
          autoAlpha: 0,
          y: 300,
          text: "",
        },
        {
          autoAlpha: 1,
          y: 0,
          text: "1",
          color: "white",
        }
      )
      .fromTo(
        titleRef.current,
        {
          autoAlpha: 0,
          scale: 0,
          text: "",
        },
        {
          autoAlpha: 1,
          scale: 3,
          text: "GO",
          color: "red",
        }
      )
      .to(titleRef.current, {
        duration: 0.5,
        delay: -0.3,
        repeat: 1,
        autoAlpha: 0,
      })
      .to(titleContainerRef.current, {
        autoAlpha: 0,
      });
    return () => {
      titleTlRef.current?.kill();
      introAudio.pause();
      introAudio.currentTime = 0;
    };
  }, [show, gameStatus]);

  return (
    <>
      {jwtToken === undefined ? (
        <>
          <Button
            onClick={() => {
              signTransaction!();
            }}
          >
            Sign in
          </Button>
          <Button
            onClick={() => {
              setJwtToken!(null);
            }}
          >
            Solo mode
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={() => {
              setShow(true);
            }}
          >
            start game
          </Button>
          {jwtToken ? (
            <p>
              Signed as{" "}
              {discordName
                ? discordNameSlice(discordName, 11)
                : userNameInterpolation(userName)}
            </p>
          ) : (
            <p>Playing as guest</p>
          )}
          <Button onClick={() => setJwtToken!(undefined)}>Sign out</Button>
        </>
      )}
      <Modal show={show} setShow={setShow} fullWidth>
        <>
          {time > 0 ? (
            points < MIN_TO_PLAY ? (
              <>
                {gameStatus === "intro" ? (
                  <div
                    className="absolute inset-0 z-30 grid place-content-center rounded bg-slate-900/90"
                    ref={titleContainerRef}
                  >
                    <h3 className="text-5xl" ref={titleRef}></h3>
                  </div>
                ) : null}
                <div className="absolute top-1 left-0 px-4">Time: {time}</div>
                <div className="absolute top-1 right-0 px-4">
                  Moves: {moves}
                </div>
                <div
                  className="grid grid-cols-3 grid-rows-4"
                  ref={containerRef}
                >
                  {tiles.map((f, i) => {
                    switch (f.right) {
                      case undefined:
                        return f.revealed ? (
                          <Button
                            className="pointer-events-none grid aspect-square place-content-center p-0"
                            key={i}
                          >
                            <img
                              src={f.image}
                              alt={`memory-tile-${i}`}
                              className="aspect-square rounded object-contain"
                            />
                          </Button>
                        ) : (
                          <Button
                            className="grid aspect-square place-content-center p-0"
                            onClick={() => handleOnClick(i)}
                            key={i}
                          >
                            <RocketLaunchIcon className="h-8 w-8" />
                          </Button>
                        );
                      case true:
                        return (
                          <Button
                            className="pointer-events-none grid aspect-square place-content-center p-0"
                            key={i}
                          >
                            <img
                              src={f.image}
                              alt={`memory-tile-${i}`}
                              className="aspect-square rounded bg-green-400 object-contain p-1"
                            />
                          </Button>
                        );
                      case false:
                        return (
                          <Button
                            className="pointer-events-none grid aspect-square place-content-center p-0"
                            key={i}
                          >
                            <img
                              src={f.image}
                              alt={`memory-tile-${i}`}
                              className="aspect-square rounded bg-red-600 object-contain p-1"
                            />
                          </Button>
                        );
                    }
                  })}
                </div>
              </>
            ) : (
              <>
                <Answer success={true}>
                  <span className="block">You won in {moves} moves!</span>
                  <span className="block">
                    You scored {Math.floor((time / moves) * 100)} points!
                  </span>
                  {jwtToken !== null ? (
                    <>
                      <span className="block">Placement: {placement}</span>
                    </>
                  ) : null}
                </Answer>
                <div className="relative">
                  <HighScores placement={placement} />
                </div>
              </>
            )
          ) : (
            <Answer success={false}>You run out of time!</Answer>
          )}
        </>
      </Modal>
    </>
  );
}
