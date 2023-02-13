import { ReactNode, Dispatch, SetStateAction, createContext, useState, useEffect, useContext } from "react";

import { ethers, Contract, providers, utils, BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { CONTRACT_ADDRESS, ABI } from "../solidity/solidityData";

type CrokachuContextType = {
    supply: number
    isWhitelisted: boolean | null
    price: number
    balance: number
    mint: ((amount: number) => Promise<void>) | null
    maxMint: number
    royalties: number
    totalRoyalties: number
    nftBalance: number
    claim: (() => Promise<void>) | null
    uri: string[]
    loading: boolean
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>> | null
    data: { success: boolean | null, answer: string | string[] | null }
    favorites: string[]
    setFavorites: Dispatch<SetStateAction<string[]>> | null
}

const CrokachuContext = createContext<CrokachuContextType>({
    supply: 0,
    isWhitelisted: null,
    price: 0,
    balance: 0,
    mint: null,
    maxMint: 0,
    royalties: 0,
    totalRoyalties: 0,
    nftBalance: 0,
    claim: null,
    uri: [],
    loading: false,
    show: false,
    setShow: null,
    data: { success: null, answer: null },
    favorites: [],
    setFavorites: null
});

export function useCrokachu() {
    return useContext(CrokachuContext);
}

type CrokachuProviderProps = {
    children: ReactNode
}

export function CrokachuProvider({ children }: CrokachuProviderProps) {
    const { account, library } = useWeb3React();

    /* contract instance */
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    useEffect(() => {
        if (!library) return;
        const getContract = async () => {
            try {
                const provider = await library.provider;
                const web3Provider = new providers.Web3Provider(provider);
                const signer = web3Provider.getSigner();

                const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
                setContract(contract);
            } catch (err) {
                console.log(err)
            }
        }
        getContract();
        return () => setContract(null);
    }, [library]);

    /* state for update components */
    const [minted, setMinted] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [data, setData] = useState<{
        success: boolean | null
        answer: string | string[] | null
    }>({
        success: null,
        answer: null
    })

    /* mint */
    /* mint function */
    const mint = async (amount: number) => {
        setLoading(true);
        try {

            //const gasLimit = await contract!.estimateGas.mint(amount);

            //console.log(gasLimit)

            const totalPrice = (price * amount).toString();
            const mint = await contract!.mint(amount, { value: utils.parseEther(`${totalPrice}`) });

            await mint.wait();

            setData({ success: true, answer: `You minted ${amount} Crokachu${amount > 1 ? "s" : ""}!` });
            setShow(true);

            setMinted(prevCount => prevCount + 1);
        } catch (err) {
            if (err instanceof Error) {
                console.log(err)
                setData({
                    success: false, answer: err.message.includes("insufficient") ?
                        `Insufficient balance for mint: Price ${price} CRO` :
                        err.message.includes("user rejected transaction") ?
                            "User rejected the transaction" :
                            "Please refresh the page or clear the cache!"
                });
                setShow(true);
            }
            if (balance < price * amount) setData({
                success: false, answer: `Insufficient balance for mint: Price ${price} CRO`
            });
            setShow(true);
        }
        setLoading(false);
    }

    /* get current supply */
    const [supply, setSupply] = useState<number>(0);
    useEffect(() => {
        if (!contract) return;
        const getSupplyFromSmartContract = async () => {
            try {
                const SUPPLY = (await contract.totalSupply()).toString();
                setSupply(() => SUPPLY);
            }
            catch (err) {
                console.log(err);
            }
        }
        getSupplyFromSmartContract();
        return () => setSupply(0);
    }, [contract, minted]);

    /* is whitelisted? */
    const [isWhitelisted, setIsWhitelisted] = useState<boolean | null>(null);
    useEffect(() => {
        if (!contract) return;
        if (!account) return;
        const getIsWhitelisted = async () => {
            try {
                setIsWhitelisted(await contract.isWhitelisted(account));
            } catch (err) {
                console.log(err);
            }
        };
        getIsWhitelisted();
        return () => setIsWhitelisted(null);
    }, [contract, account]);

    /* get price */
    const [price, setPrice] = useState<number>(0);
    useEffect(() => {
        if (!contract) return;
        if (isWhitelisted === null) return;
        const getPriceFromSmartContract = async () => {
            try {
                const rawPrice = isWhitelisted ? await contract.whitelistprice() : await contract.price();
                const formattedPrice = parseInt(utils.formatEther(rawPrice));
                setPrice(formattedPrice);
            }
            catch (err) {
                console.log(err);
            }
        }
        getPriceFromSmartContract();
        return () => setPrice(0);
    }, [contract, isWhitelisted, minted]);

    /* get max mint */
    const [maxMint, setMaxMint] = useState<number>(0);
    useEffect(() => {
        if (!contract) return;
        const getMaxMintFromSmartContract = async () => {
            try {
                const MAX_MINT: string = await contract.maxMint();
                setMaxMint(parseInt(MAX_MINT));
            }
            catch (err) {
                console.log(err);
            }
        }
        getMaxMintFromSmartContract();
        return () => setMaxMint(0);
    }, [contract]);

    /* get user balance */
    const [balance, setBalance] = useState<number>(0);
    useEffect(() => {
        if (!account) return;
        if (!contract) return;
        const getBalanceFromProvider = async () => {
            try {
                const rawBalance = parseFloat(utils.formatEther(await contract.provider.getBalance(account)));

                const fomrattedBalance = ((Math.floor(rawBalance * 100)) / 100);
                setBalance(fomrattedBalance);
            }
            catch (err) {
                console.log(err);
            }
        }
        getBalanceFromProvider();
        return () => setBalance(0);
    }, [account, contract, minted]);

    /* royalties */
    /* get royalties */
    const [royalties, setRoyalties] = useState(0);
    const [claimed, setClaimed] = useState(0);
    useEffect(() => {
        if (!account) return;
        if (!contract) return;
        const getRoyalties = async () => {
            try {
                const royalty = Math.floor(parseFloat(utils.formatEther(await contract.getRoyalties(account))) * 100) / 100;
                setRoyalties(royalty);
            } catch (err) {
                console.log(err)
            }
        }
        getRoyalties();
        return () => setRoyalties(0);
    }, [account, contract, claimed, minted]);

    /* get crokachu owned */
    const [nftBalance, setNftBalance] = useState(0);
    useEffect(() => {
        if (!account) return;
        if (!contract) return;
        const getNftBalanceFromContract = async () => {
            try {
                const bal = (await contract.tokensOfWallet(account)).map((id: BigNumber) => id.toNumber());
                setNftBalance(() => bal.length);
            } catch (err) {
                console.log(err);
            }
        }
        getNftBalanceFromContract();
        return () => setNftBalance(0);
    }, [account, contract, minted]);

    /* getTotal Royalties */
    const [totalRoyalties, setTotalRoyalties] = useState(0);
    useEffect(() => {
        if (!account) return;
        if (!contract) return;
        try {
            (async () => {
                const totRoyalties = utils.formatEther(await contract.totalRoyalties());
                setTotalRoyalties(parseFloat(totRoyalties));
            })();
        } catch (err) {
            console.log(err);
        }
    }, [account, contract, minted]);

    /* claim royalties */
    const claim = async () => {
        if (!contract) return;
        setLoading(true);
        try {
            const claim = await contract.claimAllRoyalties();
            await claim.wait();
            setData({ success: true, answer: "Royalties claimed!" });
            setShow(true);
            setClaimed(prevClaimed => prevClaimed + 1);
        } catch (err) {
            console.log(err);
            if (err instanceof Error) {
                setData({
                    success: false, answer: err.message.includes("user rejected transaction") ?
                        "User rejected transaction!" :
                        "Please refresh the page or clear the cache!"
                });
                setShow(true);
            }
        }
        setLoading(false);
    }

    /* collection */
    /* get uri */
    const [uri, setUri] = useState<string[]>([])
    useEffect(() => {
        if (!account) return;
        if (!contract) return;
        const getUri = async () => {
            try {
                const idArray: number[] | undefined = (await contract.tokensOfWallet(account)).map((id: BigNumber) => id.toNumber());
                if (idArray?.length === 0) return;
                const tempUri = await contract.tokenURI(idArray![0]);
                const uriArray = idArray!.map((id: number) => `https://ipfs.io/ipfs/${tempUri.split("/")[2]}/${id}`);
                setUri(uriArray.reverse());
            } catch (err) {
                console.log(err);
            }
        }
        getUri();
        return () => setUri([]);
    }, [account, contract, minted]);

    /* favorites */
    const [favorites, setFavorites] = useState<string[]>([]);

    /* provider component */
    return <CrokachuContext.Provider value={
        {
            supply,
            price,
            isWhitelisted,
            balance,
            mint,
            maxMint,
            royalties,
            totalRoyalties,
            nftBalance,
            claim,
            uri,
            loading,
            show,
            setShow,
            data,
            favorites,
            setFavorites
        }
    }>
        {children}
    </CrokachuContext.Provider>
}
