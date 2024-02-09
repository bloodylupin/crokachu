import { SparklesIcon } from "@heroicons/react/24/outline";

import Button from "./Button";
import { MIN_TO_PLAY } from "../pages/Memory";

import { useCrokachu } from "../contexts/CrokachuContext";

export default function RandomSelectorButton() {

    const { setFavorites, collection } = useCrokachu();
    return (
        <Button className="from-orange-700 to-orange-900" onClick={() => setFavorites!(prevFavorites => {
            const rndFavsToAdd = MIN_TO_PLAY - prevFavorites.length;
            const filledFavsArray = [...prevFavorites];


            for (let i = 0; i < rndFavsToAdd; i++) {
                const nftsToChoose = collection.filter(nft => !filledFavsArray.includes(nft.gatewayImage));

                const rnd = Math.round(Math.random() * (nftsToChoose.length - 1));
                if (nftsToChoose[rnd].gatewayImage !== undefined) filledFavsArray.push(nftsToChoose[rnd].gatewayImage);
            }
            return [...filledFavsArray];
        })}>
            <div className="w-4 h-4 grid place-content-center">
                <SparklesIcon className="w-6 h-6" />
            </div>
        </Button>
    )
}
