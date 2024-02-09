declare const window: Window & { global: Window };

window.global ||= window;

import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";


const injected = new InjectedConnector({
    supportedChainIds: [25]
    //supportedChainIds: [338]
});

const ALL_SUPPORTED_CHAIN_IDS = [25]
//const ALL_SUPPORTED_CHAIN_IDS = [338]

const INFURA_NETWORK_URLS =
{
    25: "https://evm.cronos.org"
    //338: "https://evm-t3.cronos.org"
}

const CHAIN_ID = 25;
//const CHAIN_ID = 338;

const walletconnect = new WalletConnectConnector({
    supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
    rpc: INFURA_NETWORK_URLS,
    chainId: CHAIN_ID,
    bridge: "https://bridge.walletconnect.org",
    qrcode: true
});


export const connectors: {
    injected: InjectedConnector,
    walletConnect: WalletConnectConnector
} = {
    injected: injected,
    walletConnect: walletconnect,
};