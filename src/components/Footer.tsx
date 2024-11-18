// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { atom, useAtom } from "jotai";
// import { useRef } from "react";
// import { currentUserAtom } from "../atoms";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  // we do this to execute code when the browser kicks us out of fullscreen
  useEffect(function () {
    function handleFullScreenChange() {
      if (isFullScreen) {
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      }
    }

    document.body.addEventListener("fullscreenchange", handleFullScreenChange);

    return () =>
      document.body.removeEventListener(
        "fullscreenchange",
        handleFullScreenChange
      );
  }, []);

  return (
    <footer className="px-4 fixed bottom-0 max-w-screen-xl w-full bg-zinc-900">
      <div className="flex justify-between items-center px-2">
        <p className="py-4">
          © 2024 <span className="text-purple-500 font-bold">¡</span>ONCE
        </p>
        {isFullScreen ? (
          <FontAwesomeIcon
            onClick={() => document.exitFullscreen()}
            icon="down-left-and-up-right-to-center"
            className=" text-purple-500"
          />
        ) : (
          <FontAwesomeIcon
            onClick={() => document.body.requestFullscreen()}
            icon="up-right-and-down-left-from-center"
            className=" text-white"
          />
        )}

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
