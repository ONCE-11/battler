import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { currentUserAtom } from "../atoms";
import { useAtomValue } from "jotai";
import { useAudio } from "../hooks/useAudio";

export default function Footer() {
  const [isFullScreen, setFullScreen] = useState(false);
  const { audioMuted, toggleMute } = useAudio();
  const currentUser = useAtomValue(currentUserAtom);

  // we do this to execute code when the browser kicks us out of fullscreen
  useEffect(function () {
    let wakeLock: WakeLockSentinel | null = null;

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
        if ("wakeLock" in navigator && wakeLock) {
          await wakeLock.release();
          wakeLock = null;
        }
        setFullScreen(false);
      }
    }

    document.body.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.body.removeEventListener(
        "fullscreenchange",
        handleFullScreenChange
      );
    };
  }, []);

  return (
    <footer className="px-4 fixed bottom-0 max-w-(--breakpoint-xl) w-full bg-zinc-900">
      <div className="flex justify-end items-center px-2">
        <p className="py-4 text-xs">
          {/* © 2024 <span className="text-purple-500 font-bold">¡</span>ONCE */}
          &nbsp;
        </p>
        {currentUser && (
          <div className="py-4">
            <FontAwesomeIcon
              icon={`${audioMuted ? "volume-xmark" : "volume-high"}`}
              className={`mr-4${audioMuted ? "" : " text-purple-500"}`}
              onClick={toggleMute}
            />
          </div>
        )}

        {isFullScreen ? (
          <FontAwesomeIcon
            onClick={() =>
              document.fullscreenEnabled && document.exitFullscreen()
            }
            icon="down-left-and-up-right-to-center"
            className=" text-purple-500"
          />
        ) : (
          <FontAwesomeIcon
            onClick={() =>
              document.fullscreenEnabled &&
              document.body.requestFullscreen({ navigationUI: "hide" })
            }
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
