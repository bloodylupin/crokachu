import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { ChartBarIcon } from "@heroicons/react/24/outline";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { classNames } from "../../utilities/classNames";
import { userNameInterpolation } from "../../contexts/CrokachuContext";

import { gameId } from "./MemoryGame";

type HighScoresProps = {
  placement?: number;
};

export default function HighScores({ placement }: HighScoresProps) {
  const { account } = useWeb3React();

  const [scoresShow, setScoresShow] = useState(false);
  const [scores, setScores] = useState<
    {
      name: string;
      score: string;
    }[]
  >([]);

  useEffect(() => {
    if (!scoresShow) return;
    (async () => {
      try {
        const res = await fetch(
          `https://jackyolo.xyz/api/scores?game_id=${gameId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        (await res.json()).scores_list.forEach(
          (s: { name: string; score: string }) =>
            setScores((prevScores) => [...prevScores, s])
        );
      } catch (error) {
        console.log(error);
      }
    })();
    return () => setScores([]);
  }, [scoresShow]);
  return (
    <>
      <Button
        onClick={() => setScoresShow(true)}
        className="absolute top-1/2 right-0 -translate-y-1/2 p-2"
      >
        <ChartBarIcon className="h-6 w-6" />
      </Button>
      <Modal show={scoresShow} setShow={setScoresShow} fullWidth>
        <div className="grid gap-4">
          <h2>Best Scores</h2>
          <ul className="rounded bg-fuchsia-900 p-4">
            {scores.map(({ name, score }, index) =>
              index < 5 ? (
                <li key={index} className="grid grid-cols-7 gap-4">
                  <span>{index + 1}</span>
                  <span className="col-span-4">{name}</span>
                  <span className="col-span-2 border-l-2 text-right">
                    {score}
                  </span>
                </li>
              ) : null
            )}
          </ul>
          {placement ? (
            <>
              <h2>Your score</h2>
              <ul className="rounded bg-fuchsia-900 p-4">
                {scores.map(({ name, score }, index) => {
                  const match =
                    index === placement - 3 ||
                    index === placement - 2 ||
                    index === placement - 1 ||
                    index === placement ||
                    index === placement + 1;
                  return match ? (
                    <li
                      key={index}
                      className={classNames(
                        index === placement - 1 ? "text-slate-400" : "",
                        "grid grid-cols-7 gap-4"
                      )}
                    >
                      <span>{index + 1}</span>
                      <span className="col-span-4">{name}</span>
                      <span className="col-span-2 border-l-2 text-right">
                        {score}
                      </span>
                    </li>
                  ) : null;
                })}
              </ul>
              <h2>Stats</h2>
              <ul className="rounded bg-fuchsia-900 p-4">
                <li className="grid grid-cols-6 gap-4">
                  <span className="col-span-5 text-left">Total Games</span>
                  <span>{scores.length}</span>
                </li>
                {account ? (
                  <li className="grid grid-cols-6 gap-4">
                    <span className="col-span-5 text-left">Your Games</span>
                    <span>
                      {
                        scores.filter(
                          (s) => s.name === userNameInterpolation(account)
                        ).length
                      }
                    </span>
                  </li>
                ) : null}
              </ul>
            </>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
