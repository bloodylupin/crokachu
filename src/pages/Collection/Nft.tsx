import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  MouseEventHandler,
} from "react";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

import { useCrokachu } from "../../contexts/CrokachuContext";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { MIN_TO_PLAY } from "../Memory";

type NftProps = {
  uri: string;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  setProperties: Dispatch<SetStateAction<string[]>>;
  maxShow: boolean;
  setMaxShow: Dispatch<SetStateAction<boolean>>;
};
type Metadata = {
  name: string;
  image: string;
  gatewayImage: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
};

export default function Nft({
  uri,
  inputValue,
  setInputValue,
  setProperties,
  setMaxShow,
}: NftProps) {
  const [metadata, setMetadata] = useState<Metadata>({
    name: "",
    image: "",
    gatewayImage: "",
    attributes: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const singleMetadata: Metadata = await fetch(uri)
          .then((resp) => resp.json())
          .then((data) => data)
          .catch((err) => console.log(err));
        // const gatewayImage = `https://ipfs.io/ipfs/${singleMetadata.image.split("/")[2]}/${singleMetadata.image.split("/")[3]}`;
        const gatewayImage = `https://${
          singleMetadata.image.split("/")[2]
        }.ipfs.nftstorage.link/${singleMetadata.image.split("/")[3]}`;
        setMetadata({ ...singleMetadata, gatewayImage });
      } catch (err) {
        console.log(err);
      }
    })();

    return () => {
      setMetadata({ name: "", image: "", gatewayImage: "", attributes: [] });
    };
  }, []);

  const { setCollection } = useCrokachu();

  useEffect(() => {
    if (metadata.gatewayImage === "") return;
    setCollection!((prevCollection) => [...prevCollection, metadata]);
  }, [metadata.gatewayImage]);

  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    if (metadata.name === "") return;

    const properties: string[] = [];

    Object.entries(metadata).forEach(([key, value]) => {
      if (typeof value === "string") {
        if (key === "name") {
          properties.push(value.split("#")[1]);
        }
      } else {
        value.forEach((attribute) => {
          Object.entries(attribute).forEach(([key, value]) =>
            key === "value" ? properties.push(value) : null
          );
        });
      }
    });

    const matches: boolean[] = [];

    setProperties((prevProperties) => [...prevProperties, ...properties]);

    properties.forEach((p) => {
      matches.push(p.includes(inputValue.toLowerCase()));
    });

    if (matches.includes(true)) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    return () => {
      setIsVisible(true);
    };
  }, [metadata.name, inputValue]);

  const [show, setShow] = useState<boolean>(false);

  const { favorites, setFavorites } = useCrokachu();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!favorites.length) return;
    favorites.includes(metadata.gatewayImage)
      ? setIsFavorite(true)
      : setIsFavorite(false);
    return () => setIsFavorite(false);
  }, [metadata.gatewayImage, favorites.length]);

  const handleFavoriteSelection: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsFavorite((prevIsFavorite) =>
      favorites.length < MIN_TO_PLAY ? !prevIsFavorite : prevIsFavorite
    );
    setFavorites!((prevFavorites) =>
      prevFavorites.includes(metadata.gatewayImage)
        ? prevFavorites.filter((pf) => pf !== metadata.gatewayImage)
        : prevFavorites.length < MIN_TO_PLAY
        ? [...prevFavorites, metadata.gatewayImage]
        : [...prevFavorites]
    );
    favorites.length === MIN_TO_PLAY &&
    !favorites.includes(metadata.gatewayImage)
      ? setMaxShow(true)
      : null;
  };
  return isVisible ? (
    <>
      <div className="relative">
        <Button onClick={() => setShow(true)}>
          <img src={metadata.gatewayImage} alt={metadata.name} />
        </Button>
        <span className="absolute bottom-0 right-0 rounded-tl bg-purple-900/50 text-xs">
          {metadata.name.split("#")[1]}
          <button
            className="mx-auto block h-8 w-8"
            onClick={handleFavoriteSelection}
          >
            {isFavorite ? (
              <HeartIconSolid className="fill-lime-400" />
            ) : (
              <HeartIcon className="stroke-lime-400" />
            )}
          </button>
        </span>
      </div>
      <Modal show={show} setShow={setShow}>
        <div>
          <a href={metadata.gatewayImage} target="_blank">
            <img src={metadata.gatewayImage} alt={metadata.name} />
            <span className="absolute bottom-0 right-0 rounded-tl bg-purple-900/50 text-xs">
              {metadata.name.split("#")[1]}
            </span>
          </a>
          <div className="mt-2 grid gap-2 lg:mt-4 lg:grid-cols-2 lg:gap-4">
            {metadata.attributes.map(({ trait_type, value }, i) => {
              return (
                <Button
                  key={i}
                  className="rounded from-fuchsia-500 to-fuchsia-900 p-0"
                  onClick={() => {
                    setInputValue(value);
                    setShow(false);
                  }}
                >
                  <p className="text-xs text-gray-300">{trait_type}</p>
                  <p className="px-4 text-sm">{value}</p>
                </Button>
              );
            })}
            <button
              className="mx-auto block h-8 w-8"
              onClick={handleFavoriteSelection}
            >
              {isFavorite ? <HeartIconSolid /> : <HeartIcon />}
            </button>
          </div>
        </div>
      </Modal>
    </>
  ) : null;
}
