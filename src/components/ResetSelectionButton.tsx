import Button from "./Button";
import { useCrokachu } from "../contexts/CrokachuContext";

import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ResetSelectionButton() {
    const { setFavorites } = useCrokachu();
    return (
        <Button className="from-red-600 to-red-900" onClick={() => {
            setFavorites!([]);
        }}>
            <div className="w-4 h-4 grid place-content-center">
                <XMarkIcon className="w-6 h-6" />
            </div>
        </Button>
    )
}
