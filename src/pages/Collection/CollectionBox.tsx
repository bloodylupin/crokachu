import { useState, useEffect, type BaseSyntheticEvent } from "react";

import { Link } from "react-router-dom";

import { useCrokachu } from "../../contexts/CrokachuContext";

import Button from "../../components/Button";

import Nft from "./Nft";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";

import { MIN_TO_PLAY } from "../Memory";
import { classNames } from "../../utilities/classNames";
import RandomSelectorButton from "../../components/RandomSelectorButton";
import ResetSelectionButton from "../../components/ResetSelectionButton";

export default function CollectionBox() {
  const { uri, favorites, setFavorites, collection } = useCrokachu();

  const [inputValue, setInputValue] = useState("");
  const handleInputValueChange = (e: BaseSyntheticEvent) => {
    setInputValue(e.target.value);
  };
  const [properties, setProperties] = useState<string[]>([]);

  const uniqueProperties = new Set(properties);
  const propertiesArray = Array.from(uniqueProperties).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  const [filteredProps, setFilteredProps] = useState<string[]>([]);

  const [show, setShow] = useState(false);
  useEffect(() => {
    setFilteredProps(propertiesArray.filter((p) => p.includes(inputValue)));
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
      {show ? (
        <div
          onClick={() => setShow(false)}
          className="absolute inset-0 z-10"
        ></div>
      ) : null}
      {uri.length ? (
        <>
          <div className="relative">
            <input
              type="text"
              className="relative z-30 w-full rounded p-4 text-slate-900"
              onChange={handleInputValueChange}
              onFocus={() => setShow(true)}
              value={inputValue}
              placeholder="Search..."
            />
            {inputValue !== "" ? (
              <button onClick={() => setInputValue("")}>
                <XMarkIcon className="absolute top-1/2 right-4 z-50 h-10 w-10 -translate-y-1/2 stroke-slate-900" />
              </button>
            ) : null}
            <div className="absolute left-0 right-0 z-30 rounded bg-fuchsia-700/70">
              {show
                ? filteredProps.map((p) => {
                    return (
                      <button
                        className="block pl-4 text-left"
                        key={p}
                        onClick={() => {
                          setShow(false);
                          setInputValue(p);
                        }}
                      >
                        {p}
                      </button>
                    );
                  })
                : null}
            </div>
          </div>
          <div className="grid gap-8 rounded-md bg-gradient-to-b from-fuchsia-900 to-slate-900 p-8 shadow-lg shadow-slate-900 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {uri.map((u) => (
              <Nft
                key={u}
                uri={u}
                inputValue={inputValue}
                setInputValue={setInputValue}
                setProperties={setProperties}
                maxShow={maxShow}
                setMaxShow={setMaxShow}
              />
            ))}
            <label className="absolute opacity-0 transition-opacity only:relative only:opacity-100">
              No matches
            </label>
          </div>
          <div className="sticky bottom-4 self-end shadow-lg shadow-slate-900">
            {favShow ? (
              <div className="bottom-8 grid">
                {favorites.map((f, i) => (
                  <Button
                    key={`th-${i}`}
                    className="p-1"
                    onClick={() => {
                      setFavorites!((prevFavorites) =>
                        prevFavorites.filter((pf) => pf !== f)
                      );
                      maxShow ? setMaxShow(false) : null;
                    }}
                  >
                    <img
                      src={f}
                      className="h-10 w-10"
                      alt={`favorite-thumbnails-${i + 1}`}
                    />
                  </Button>
                ))}
                {favorites.length < MIN_TO_PLAY ? (
                  <RandomSelectorButton />
                ) : null}
              </div>
            ) : null}
            <Button
              className={classNames(
                maxShow ? "from-red-600 to-red-900" : "",
                "block"
              )}
              onClick={() => setFavShow((prevFavShow) => !prevFavShow)}
            >
              <div className="grid h-4 w-4 place-content-center">
                {maxShow ? "max" : favorites.length}
              </div>
            </Button>
            {favorites.length > 0 && favShow ? <ResetSelectionButton /> : null}

            {favorites.length === MIN_TO_PLAY ? (
              <Link to="/memory">
                <Button className="block from-orange-400 to-orange-500">
                  <PlayIcon className="h-4 w-4 animate-pulse" />
                </Button>
              </Link>
            ) : null}
          </div>
        </>
      ) : (
        <div className="grid place-content-center gap-8 rounded-md bg-gradient-to-b from-fuchsia-900 to-slate-900 p-8 shadow-lg shadow-slate-900">
          <p>You don't own any Crokachu...</p>
        </div>
      )}
    </>
  );
}
