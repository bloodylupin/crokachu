import { useState, BaseSyntheticEvent, useEffect } from "react";

import { Link } from "react-router-dom";

import { useCrokachu } from "../../contexts/CrokachuContext";


import Button from "../../components/Button";

import Nft from "./Nft";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";

import { MIN_TO_PLAY } from "../Memory";
import { classNames } from "../../utilities/classNames";

/* tewst firma */
// import { useWeb3React } from "@web3-react/core";
// import { providers } from "ethers";

export default function CollectionBox() {

    /* test firma */
    // const { library } = useWeb3React();

    // const signTransaction = async () => {
    //     try {
            
    //         const provider = await library.provider;
    //         const web3Provider = new providers.Web3Provider(provider);
    //         const signer = web3Provider.getSigner();

    //         const result = await signer.signMessage("hello world");
    //         console.log(result);

    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // }

    const { uri, favorites, setFavorites } = useCrokachu();

    const [inputValue, setInputValue] = useState("");
    const handleInputValueChange = (e: BaseSyntheticEvent) => {
        setInputValue(e.target.value);
    };
    const [properties, setProperties] = useState<string[]>([]);

    const uniqueProperties = new Set(properties);
    const propertiesArray = Array.from(uniqueProperties).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const [filteredProps, setFilteredProps] = useState<string[]>([])

    const [show, setShow] = useState(false);
    useEffect(() => {
        setFilteredProps(propertiesArray.filter(p => p.includes(inputValue)));
        return () => setFilteredProps([]);
    }, [inputValue]);

    const [favShow, setFavShow] = useState(false);
    const [maxShow, setMaxShow] = useState(false);

    useEffect(() => {
        if (!maxShow) return;
        const timer = setTimeout(() => setMaxShow(false), 1000);
        return () => clearInterval(timer);
    }, [maxShow]);

    return (
        <>
            {/* <button onClick={signTransaction}>firma</button> */}
            {show ? <div onClick={() => setShow(false)} className="absolute inset-0 z-10"></div> : null}
            {uri.length ?
                <>
                    <div className="relative">
                        <input type="text" className="rounded text-slate-900 p-4 w-full relative z-30" onChange={handleInputValueChange} onFocus={() => setShow(true)} value={inputValue} placeholder="Search..." />
                        {inputValue !== "" ?
                            <button onClick={() => setInputValue("")}>
                                <XMarkIcon className="w-4 h-4 top-1/2 -translate-y-1/2 right-4 z-50 absolute stroke-slate-900" />
                            </button>
                            :
                            null}
                        <div className="absolute bg-fuchsia-700/70 left-0 right-0 z-30 rounded">
                            {show ? filteredProps.map((p) => {
                                return <button className="text-left pl-4 block" key={p} onClick={() => {
                                    setShow(false);
                                    setInputValue(p);
                                    console.log(show);
                                }}>{p}</button>
                            }) : null}
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 rounded-md p-8 bg-gradient-to-b from-fuchsia-900 to-slate-900 shadow-lg shadow-slate-900">
                        {uri.map(u => <Nft key={u} uri={u} inputValue={inputValue} setInputValue={setInputValue} setProperties={setProperties} maxShow={maxShow} setMaxShow={setMaxShow} />)}
                        <label className="opacity-0 absolute  transition-opacity only:opacity-100 only:relative">No matches</label>
                    </div>
                    <div className="shadow-lg shadow-slate-900 sticky bottom-4 -mr-2 self-end">
                        {favShow ? <div className="bottom-8 grid">
                            {favorites.map((f, i) => (
                                <Button key={`th-${i}`} className="p-1" onClick={() => {
                                    setFavorites!(prevFavorites => prevFavorites.filter(pf => pf !== f));
                                    maxShow ? setMaxShow(false) : null;
                                }
                                }>
                                    <img src={f} className="w-10 h-10" alt={`favorite-thumbnails-${i + 1}`} />
                                </Button>
                            ))}
                        </div> : null}
                        <Button className={classNames(maxShow ? "from-red-600 to-red-900" : "", "block")} onClick={() => setFavShow(prevFavShow => !prevFavShow)}>
                            <div className="w-4 h-4 grid place-content-center">
                                {maxShow ? "max" : favorites.length}
                            </div>
                        </Button>
                        {favorites.length === MIN_TO_PLAY ?
                            <Link to="/memory">
                                <Button className="block from-orange-400 to-orange-500">
                                    <PlayIcon className="w-4 h-4 animate-pulse" />
                                </Button>
                            </Link> : null
                        }
                    </div>
                </> :
                <div className="grid place-content-center gap-8 rounded-md p-8 bg-gradient-to-b from-fuchsia-900 to-slate-900 shadow-lg shadow-slate-900">
                    <p>You don't own any Crokachu...</p>
                </div>
            }
        </>
    )
}
