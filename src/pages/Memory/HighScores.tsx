import { useEffect, useState } from "react";

import { ChartBarIcon } from "@heroicons/react/24/outline";

import Button from "../../components/Button";
import Modal from "../../components/Modal";

export default function HighScores() {

    const [scoresShow, setScoresShow] = useState(false);
    const [scores, setScores] = useState<{
        name: string
        score: string
    }[]>([]);

    useEffect(() => {
        if (!scoresShow) return;
        (async () => {
            try {
                const res = await fetch("https://420row.com:3457/scores420?game_id=test", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                (await res.json()).scores_list.forEach((s: { name: string, score: string }) => setScores(prevScores => [...prevScores, s]));
            }
            catch (error) {
                console.log(error);
            }
        })();
        return () => setScores([]);
    }, [scoresShow]);
    return (
        <>
            <Button onClick={() => setScoresShow(true)} className="p-2 absolute top-1/2 right-0 -translate-y-1/2">
                <ChartBarIcon className="w-6 h-6" />
            </Button>
            <Modal show={scoresShow} setShow={setScoresShow}>
                <div className="grid gap-4">
                    <h2>Best Scores</h2>
                    <ul className="p-4 bg-fuchsia-900 rounded">
                        {scores.map(({ name, score }, index) => (
                            <li key={index} className="grid grid-cols-6 gap-4">
                                <span>
                                    {index + 1}
                                </span>
                                <span className="col-span-4">
                                    {name}
                                </span>
                                <span>
                                    {score}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Modal>
        </>
    )
}

