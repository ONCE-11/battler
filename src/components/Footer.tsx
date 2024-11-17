// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { atom, useAtom } from "jotai";
// import { useRef } from "react";
// import { currentUserAtom } from "../atoms";

import { useState } from "react";
import Button from "./Button";
import ClearButton from "./ClearButton";

// const playingAtom = atom<boolean>(false);

export default function Footer() {
  // const ref = useRef<HTMLAudioElement>(null);
  // const [playing, setPlaying] = useAtom(playingAtom);
  // const currentUser = useAtomValue(currentUserAtom);

  // const handleClick = () => {
  //   if (playing) {
  //     ref.current!.pause();
  //   } else {
  //     ref.current!.play();
  //   }

  //   setPlaying(!playing);
  // };

  const [isFullScreen, setIsFullScreen] = useState(false);

  function handleClick() {
    if (isFullScreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else {
      document.body.requestFullscreen();
      setIsFullScreen(true);
    }
  }

  return (
    <footer className="px-4 fixed bottom-0 max-w-screen-xl w-full bg-zinc-900">
      <div className="border-t flex justify-between">
        <p className="py-4">
          © 2024 <span className="text-purple-500 font-bold">¡</span>ONCE
        </p>

        <ClearButton handleClick={handleClick}>
          {isFullScreen ? "Close Fullscreen" : "Go Fullscreen"}
        </ClearButton>

        {/* {currentUser && (
          <div className="py-4">
            <FontAwesomeIcon
              icon={`${playing ? "circle-pause" : "circle-play"}`}
              className="mr-4 text-purple-500"
            />
            <span
              className="b-truncate w-40 sm:w-auto inline-block active:underline hover:underline hover:cursor-pointer"
              onClick={handleClick}
            >
              Nightfall / Future Bass Music : SoulProdMusic
            </span>
            <audio src="/music.mp3" controls={false} ref={ref} loop={true} />
          </div>
        )} */}
      </div>
    </footer>
  );
}
