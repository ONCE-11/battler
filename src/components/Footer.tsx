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

  const [isFullScreen, setFullScreen] = useState(false);

  // we do this to execute code when the browser kicks us out of fullscreen
  useEffect(function () {
    let wakeLock: WakeLockSentinel;

    async function handleFullScreenChange() {
      if (document.fullscreenElement) {
        // works only if feature is available in the browser
        if ("wakeLock" in navigator) {
          try {
            wakeLock = await navigator.wakeLock.request("screen");
          } catch (error) {
            if (error instanceof Error) {
              console.error(`${error.name}, ${error.message}`);
            }
          }
        }

        setFullScreen(true);
      } else {
        if ("wakeLock" in navigator) await wakeLock.release();
        setFullScreen(false);
      }
    }

    async function handleVisibilityChange(event: Event) {
      event.preventDefault();

      if ("wakeLock" in navigator) {
        if (!document.hidden) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      }
    }

    document.body.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.body.removeEventListener(
        "fullscreenchange",
        handleFullScreenChange
      );
      document.body.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
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
