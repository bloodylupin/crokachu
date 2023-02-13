import { useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { connectors } from "../utilities/connectors";


import Button from "./Button";
import Modal from "./Modal";
import Answer from "./Answer";

import { Buffer } from "buffer";
import { ethers } from "ethers";

declare const window: Window & {
    Buffer: any,
    ethereum: ethers.providers.ExternalProvider
};

window.Buffer = Buffer;

export default function ConnectButton() {
    const { chainId, account, activate, library } = useWeb3React();

    const [show, setShow] = useState(false);

    const [data, setData] = useState<{ success: boolean | null, answer: string | null }>({ success: null, answer: null });

    const [answerShow, setAnswerShow] = useState<boolean>(false);

    const connectMetaMask = async () => {

        await activate(connectors.injected, err => {
            setData(() => ({ success: false, answer: err.message }));
            setAnswerShow(() => true);
            if (chainId === 25) return;
            window.ethereum.request!({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: "0x19",
                    rpcUrls: ["https://evm.cronos.org"],
                    chainName: "Cronos Mainnet Beta",
                    nativeCurrency: {
                        name: "CRO",
                        symbol: "CRO",
                        decimals: 18
                    },
                    blockExplorerUrls: ["https://cronoscan.com/"]
                }]
            }).catch((err: Error) => console.log(err));
            console.log(err);
        });
    }
    const connectWalletConnect = async () => {
        await activate(connectors.walletConnect, err => {
            setData(() => ({ success: false, answer: err.message }));
            setAnswerShow(() => true);
            console.log(err);
        });
    }
    return (
        <>
            <Button className="w-full" onClick={() => setShow(prevShow => !prevShow)}>Connect Wallet</Button>

            <Modal show={show} setShow={setShow}>
                <div className="grid gap-4">
                    <h2>Connect Wallet</h2>
                    <hr className="border-white" />
                    <Button onClick={connectMetaMask} className="w-full">
                        <div className="flex items-center text-left">
                            <img src="img/metamask-logo.svg" className="rounded aspect-square bg-gradient-to-t from-fuchsia-900 to-fuchsia-700" width={30} height={30} alt="Metamask" />
                            <span className="ml-2 sm:ml-4 text-xs sm:text-base">Metamask</span>
                        </div>
                    </Button>
                    <Button onClick={connectWalletConnect} className="w-full">
                        <div className="flex items-center text-left">
                            <img src="img/walletconnect-logo.svg" className="rounded aspect-square bg-gradient-to-t from-fuchsia-900 to-fuchsia-700" width={30} height={30} alt="Wallet Connect" />
                            <span className="ml-2 sm:ml-4 text-xs sm:text-base">Wallet Connect</span>
                        </div>
                    </Button>
                </div>
            </Modal>

            <Modal show={answerShow} setShow={setAnswerShow}>
                <Answer success={data.success!}>
                    {data.answer}
                </Answer>
            </Modal>

        </>
    )
}