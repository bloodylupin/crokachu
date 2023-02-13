const roadmapData: { mintedPerc: string, voice: string, pp?: string, wl?: string }[] = [
    { mintedPerc: "0%", voice: "Create Collection, Website, Twitter and team mint the airdrops!", pp: "15", wl: "10" },
    { mintedPerc: "20%", voice: "First Price Milestone!", pp: "20", wl: "15" },
    { mintedPerc: "25%", voice: "Verify on major Marketplaces!" },
    { mintedPerc: "40%", voice: "Second Price Milestone!", pp: "20", wl: "25" },
    { mintedPerc: "50%", voice: "1k CRO Raffle: 10 random minters with particular traits get 100 CRO each!" },
    { mintedPerc: "60%", voice: "Third Price Milestone!", pp: "25", wl: "30" },
    { mintedPerc: "75%", voice: "10 Crokachu giveaway: 10 random minters with particular traits get 1 Crokachu each!" },
    { mintedPerc: "80%", voice: "Fourth Price Milestone!", pp: "30", wl: "35" },
    { mintedPerc: "100%", voice: "Top 10 Minters get a custom Crokachu from Honorary Collection!" },
    { mintedPerc: "+", voice: "Get access to the BETA of our gaming application where you can play with a lot of different Cronos collections! STAY TUNED! LFG!" },
]

import { BanknotesIcon } from "@heroicons/react/24/outline";
import { QueueListIcon } from "@heroicons/react/24/outline";

export default function Roadmap() {
    return (
        <div className="bg-fuchsia-600 py-32">
            <h2 className="fade-in mb-8 text-center">Roadmap</h2>
            <div className="mx-auto grid gap-4 lg:grid-cols-2 max-w-7xl px-6 lg:px-8">
                {roadmapData.map(({ mintedPerc, voice, pp, wl }) => <div className="p-4 bg-gradient-to-b from-yellow-700 to-yellow-600 rounded flex flex-col lg:flex-row items-center justify-start gap-4 fade-in" key={voice}>
                    <div className="text-center rounded-full px-4 bg-slate-800">{mintedPerc}</div>
                    <div className="max-w-[65%] text-center lg:text-left">{voice}</div>
                    {pp ? <div className="text-center px-4">
                        <div className="flex gap-1 items-center"><BanknotesIcon className="w-4 h-4" /> {pp} <img className="w-4 h-4" src="img/cronos_cro-logo.svg" alt="Cronos Logo" /></div>
                        <div className="flex gap-1 items-center"><QueueListIcon className="w-4 h-4" /> {wl} <img className="w-4 h-4" src="img/cronos_cro-logo.svg" alt="Cronos Logo" /></div>
                    </div> :
                        null
                    }
                </div>)}
            </div>
        </div>
    )
}
