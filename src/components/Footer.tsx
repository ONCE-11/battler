// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { atom, useAtom } from "jotai";
// import { useRef } from "react";
// import { currentUserAtom } from "../atoms";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { currentUserAtom } from "../atoms";
import { useAtomValue } from "jotai";

export default function Footer() {
  const audioTest = new Audio("/music.mp3");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isFullScreen, setFullScreen] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const currentUser = useAtomValue(currentUserAtom);

  const handleAudioToggle = () => {
    // if (audioOn && audioRef.current) {
    //   audioRef.current.pause();
    // } else if (!audioOn && audioRef.current) {
    //   audioRef.current.play();
    // }

    setAudioOn(!audioOn);
    // audioTest.play();
  };

  useEffect(
    function () {
      if (audioOn && audioRef.current) {
        console.log("audio on");
        // audioRef.current.play();
        // if (!audioRef.current.paused) audioRef.current.play();
        audioRef.current.volume = 1;
      } else if (!audioOn && audioRef.current) {
        // audioRef.current.pause();
        audioRef.current.volume = 0;
        console.log("audio off");
      }
    },
    [audioOn]
  );

  // we do this to execute code when the browser kicks us out of fullscreen
  useEffect(function () {
    let wakeLock: WakeLockSentinel;

    // audioTest.play();

    if (audioRef.current) {
      // audioRef.current.play();
    }

    // console.log("dsfsd");
    // setAudioOn(audioOn);

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

    async function handleVisibilityChange() {
      // we remove the wake lock when the browser is out of focus
      if (document.hidden && "wakeLock" in navigator && wakeLock) {
        await wakeLock.release();
      }
    }

    document.body.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.body.removeEventListener(
        "fullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <footer className="px-4 fixed bottom-0 max-w-screen-xl w-full bg-zinc-900">
      <div className="flex justify-end items-center px-2">
        <p className="py-4 text-xs">
          {/* © 2024 <span className="text-purple-500 font-bold">¡</span>ONCE */}
          &nbsp;
        </p>
        <button className="mr-4" onClick={() => audioRef.current?.play()}>
          Play
        </button>
        {currentUser && (
          <div className="py-4">
            <FontAwesomeIcon
              icon={`${audioOn ? "volume-high" : "volume-xmark"}`}
              className={`mr-4${audioOn ? " text-purple-500" : ""}`}
              onClick={handleAudioToggle}
            />
            <audio
              src="/battle.mp3"
              controls={false}
              ref={audioRef}
              loop={true}
              autoPlay={true}
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
