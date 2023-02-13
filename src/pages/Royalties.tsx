import { useWeb3React } from "@web3-react/core";

import ConnectButton from "../components/ConnectButton";
import RoyaltiesBox from "./Royalties/RoyaltiesBox";

export default function Royalties() {
    const { account } = useWeb3React();
    return (
        <div className="py-20 min-h-screen flex bg-gradient-to-t from-fuchsia-900 to-transparent relative z-10">
            <div className="flex items-center flex-col gap-4 mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center justify-center">
                <h1>Royalties</h1>
                {account ?
                    <RoyaltiesBox /> :
                    <ConnectButton />}
            </div>
        </div>
    )
}
