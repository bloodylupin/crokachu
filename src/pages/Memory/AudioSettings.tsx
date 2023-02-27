import { SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";

import Button from "../../components/Button";
import { useCrokachu } from "../../contexts/CrokachuContext";
import { classNames } from "../../utilities/classNames";

export default function AudioSettings() {
  const { audioOn, setAudioOn } = useCrokachu();
  return (
    <Button
      onClick={() => setAudioOn!((prevAudioOn) => !prevAudioOn)}
      className={classNames(audioOn?"":"from-red-400 to-red-700","absolute top-1/2 left-0 -translate-y-1/2 p-2")}
    >
      {audioOn ? (
        <SpeakerWaveIcon className="h-6 w-6" />
      ) : (
        <SpeakerXMarkIcon className="h-6 w-6" />
      )}
    </Button>
  );
}
