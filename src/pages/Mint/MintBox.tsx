import { useState } from "react";
import { Link } from "react-router-dom";

import { ArrowPathIcon } from "@heroicons/react/24/outline";

import { useCrokachu } from "../../contexts/CrokachuContext";

import Modal from "../../components/Modal";
import Answer from "../../components/Answer";
import Button from "../../components/Button";

export default function MintBox() {
    const { supply, isWhitelisted, price, mint, maxMint, loading, show, setShow, data } = useCrokachu();

    const MAX_SUPPLY = 5000;

    const [amount, setAmount] = useState<number>(1);
    const increment = () => setAmount(prevAmount => {
        if (prevAmount === maxMint) return maxMint;
        return prevAmount + 1;
    });
    const decrement = () => setAmount(prevAmount => {
        if (prevAmount === 1) return 1;
        return prevAmount - 1;
    });

    return (
        <>
            <div className="grid  gap-8 rounded-md p-16 bg-gradient-to-b from-fuchsia-900 to-slate-900 shadow-lg shadow-slate-900">
                <p className="rounded border p-4 relative before:content-['name'] before:bg-fuchsia-200/90 before:text-slate-900 before:px-2 before:rounded before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2">Crokachu</p>
                <p className="rounded border p-4 relative before:content-['price'] before:bg-fuchsia-200/90 before:text-slate-900 before:px-2 before:rounded before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2">{price} CRO
                    {isWhitelisted ? <span className="absolute px-2 -bottom-2 text-xs rounded-full bg-orange-700 -right-2">WL</span> : null}
                </p>
                <p className="rounded border p-4 relative before:content-['supply'] before:bg-fuchsia-200/90 before:text-slate-900 before:px-2 before:rounded before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2">{supply} / {MAX_SUPPLY}</p>
                <div className="rounded border p-4 relative before:content-['amount'] before:bg-fuchsia-200/90 before:text-slate-900 before:px-2 before:rounded before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2">
                    <div className="grid grid-cols-3 place-content-center">
                        <Button className="p-0" onClick={decrement}>-</Button>
                        <div className="grid place-content-center">{amount}</div>
                        <Button className="p-0" onClick={increment}>+</Button>
                    </div>
                </div>
                {
                    supply <= MAX_SUPPLY ? loading ? <Button className="pointer-events-none">
                        <ArrowPathIcon className="w-6 h-6 mx-auto animate-spin" />
                    </Button>
                        : <Button onClick={() => mint!(amount)} >MINT</Button> :
                        <Button className="pointer-events-none">
                            SOLD OUT
                        </Button>
                }
            </div>
            <Modal show={show} setShow={setShow!}>
                <Answer success={data.success!}>
                    {data.answer}
                    {data.success ? <Link to="/collection">
                        <Button className="block mx-auto mt-4" onClick={() => setShow!(false)}>
                            Collection
                        </Button>
                    </Link>
                        : null}
                </Answer>
            </Modal>
        </>
    )
}
