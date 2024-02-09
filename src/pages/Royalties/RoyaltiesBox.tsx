import { ArrowPathIcon } from "@heroicons/react/24/solid";

import { useCrokachu } from "../../contexts/CrokachuContext";
import Modal from "../../components/Modal";
import Answer from "../../components/Answer";
import Button from "../../components/Button";

export default function RoyaltiesBox() {
    const { royalties, totalRoyalties, nftBalance, claim, show, setShow, loading, data } = useCrokachu();

    return (
        <>
            <div className="grid gap-8 rounded-md p-16 bg-gradient-to-b from-fuchsia-900 to-slate-900 shadow-lg shadow-slate-900">
                <p className="rounded border p-4 relative before:content-['name'] before:bg-fuchsia-200/90 before:text-slate-900 before:px-2 before:rounded before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2">Crokachu</p>
                <p className="rounded border p-4 relative before:content-['owned'] before:bg-fuchsia-200/90 before:text-slate-900 before:px-2 before:rounded before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2">{nftBalance} CKC{nftBalance > 1 ? "s" : ""}</p>
                <p className="rounded border p-4 relative before:content-['royalties'] before:bg-fuchsia-200/90 before:text-slate-900 before:px-2 before:rounded before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2">{royalties} CRO</p>
                <p className="rounded border p-4 relative before:content-['distributed'] before:bg-fuchsia-200/90 before:text-slate-900 before:px-2 before:rounded before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2">{totalRoyalties} CRO</p>
                {loading ? <Button className="pointer-events-none">
                    <ArrowPathIcon className="w-6 h-6 mx-auto animate-spin" />
                </Button> :
                    <Button onClick={claim!} className="bg-gradient-to-tr from-lime-500 to-lime-600 p-4 rounded-md">CLAIM</Button>}
            </div>
            <Modal show={show} setShow={setShow!}>
                <Answer success={data.success!}>
                    {data.answer}
                </Answer>
            </Modal>
        </>
    )
}
