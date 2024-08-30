import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { atom, useAtom, useAtomValue } from "jotai";
import { useRef } from "react";
import useAuth from "./hooks/useAuth";
import { currentUserAtom } from "../state";

const playingAtom = atom<boolean>(false);

const Footer = () => {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useAtom(playingAtom);
  const currentUser = useAtomValue(currentUserAtom);

  const handleClick = () => {
    if (playing) {
      ref.current!.pause();
    } else {
      ref.current!.play();
    }

    setPlaying(!playing);
  };

  return (
    // TODO: change this to using tailwind
    <footer className="px-4 fixed bottom-0 bg-slate-50 max-w-screen-xl w-full">
      <div className="border-t flex justify-between">
        <p className="py-4">
          © 2024 <span className="text-purple-900 font-bold">¡</span>ONCE
        </p>

        {currentUser && (
          <div className="py-4">
            <FontAwesomeIcon
              icon={`${playing ? "circle-pause" : "circle-play"}`}
              className="mr-4"
            />
            <span
              className="inline-block hover:underline hover:cursor-pointer"
              onClick={handleClick}
            >
              Nightfall / Future Bass Music : SoulProdMusic
            </span>
            <audio src="/music.mp3" controls={false} ref={ref} loop={true} />
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
