type TeamType = {
    name: string
    pfp: string
    aka: string[]
    role: string
    job: string[]
    twitter: string
    discord?: string
    cit: string
}

export default function Team() {
    const teamData: TeamType[] = [
        {
            name: "3b3t3",
            pfp: "img/ebete-pic",
            aka: ["The Editor"],
            role: "Project Owner",
            job: ["Graphic Designer", "Social Media Strategist"],
            twitter: "3b373llo",
            discord: "users/1061369820442009681",
            cit: ""
        },
        {
            name: "Jack Yolo",
            pfp: "img/jack_yolo-pic",
            aka: ["BloodyLupin"],
            role: "fullstack dev",
            job: ["NFT maniac fullstack dev"],
            twitter: "JohnBloodyLupin",
            discord: "users/694148317822713857",
            cit: "That's the beginning of a new Web3 Odissey, come join us!"
        },
        {
            name: "maddocche",
            pfp: "img/maddocche-pic",
            aka: ["The Godfather"],
            role: "back-end magician",
            job: ["programming scientist", "pro problem solver"],
            twitter: "_maddocche_",
            discord: "users/1053676775470809149",
            cit: ""
        }
    ]

    return (
        <div className="min-h-screen py-8 flex flex-col gap-4 bg-gradient-to-t from-slate-900 to-fuchsia-600">
            <div className="flex flex-col items-center gap-4 mx-auto px-4 sm:px-6 lg:px-8 text-center justify-center">
                <h2 className="sm:text-center text-lg font-semibold leading-8 text-slate-600">Do you want to know us?</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">The Team</p>
            </div>
            <div className="flex flex-col xl:flex-row gap-4 mx-auto px-4 sm:px-6 lg:px-8 text-center justify-center">
                {teamData.map(t => (
                    <div key={t.name} className="fade-in opacity-0 flex flex-col gap-4 items-center justify-center">
                        <picture>
                            <source srcSet={`${t.pfp}.webp`} type="image/webp" />
                            <source srcSet={`${t.pfp}.jpg`} type="image/jpeg" />
                            <img src={`${t.pfp}.jpg`} className="mb-4 h-64 aspect-square md:h-96 rounded-full" alt={t.name} />
                        </picture>
                        <h3>{t.name}</h3>
                        <h4>{t.role}</h4>
                        <ul className="flex items-center gap-4">
                            <li>
                                <a href={`https://twitter.com/${t.twitter}`} target="_blank" className="rounded-full grid place-content-center w-8 h-8">
                                    <img src="img/twitter-logo.svg" alt="Twitter Logo" className="w-full h-full" />
                                </a>
                            </li>
                            <li>
                                <a href={`https://discord.com/${t.discord}`} target="_blank" className="bg-white rounded-full grid place-content-center w-8 h-8">
                                    <img src="img/discord-logo.svg" alt="Discord Logo" width={24} height={24} />
                                </a>
                            </li>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}
