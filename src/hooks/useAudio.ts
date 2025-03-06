import { atom, useAtom } from "jotai";
import { Music } from "../types/custom";

const MAX_VOLUME = 1;
const MIN_VOLUME = 0;
const FADE_INTERVAL_FREQUENCY = 100;
const FADE_DELTA = 0.1;
const LOCAL_STORAGE_MUTED_KEY = "audioMuted";

const audioDefault = new Audio();
const audioBattle = new Audio();

audioDefault.src = Music.Default;
audioDefault.loop = true;

audioBattle.src = Music.Battle;
audioDefault.loop = true;

let audioSrc = audioDefault;

const audioMutedAtom = atom(
  localStorage.getItem(LOCAL_STORAGE_MUTED_KEY) === "true"
);

if (audioMutedAtom) {
  audioSrc.volume = MIN_VOLUME;
} else {
  audioSrc.volume = MAX_VOLUME;
}

export function useAudio() {
  const [audioMuted, setAudioMuted] = useAtom(audioMutedAtom);

  function fadeout(callback?: () => void) {
    const fadeOutInterval = setInterval(function () {
      if (audioSrc.volume > 0) {
        audioSrc.volume = Math.max(0, audioSrc.volume - FADE_DELTA);
      } else {
        callback?.();
        clearInterval(fadeOutInterval);
      }
    }, FADE_INTERVAL_FREQUENCY);
  }

  function fadeIn() {
    const fadeInInterval = setInterval(function () {
      if (audioSrc.volume < 1) {
        console.log("fadeIn less than 1");
        audioSrc.volume = Math.min(1, audioSrc.volume + FADE_DELTA);
      } else {
        clearInterval(fadeInInterval);
      }
    }, FADE_INTERVAL_FREQUENCY);
  }

  function pauseAudio() {
    fadeout(() => audioSrc.pause());
  }

  function playAudio() {
    audioSrc.volume = MIN_VOLUME;
    audioSrc.play();

    if (!audioMuted) {
      fadeIn();
    }
  }

  function toggleMute() {
    if (audioMuted) {
      audioSrc.volume = MAX_VOLUME;
      localStorage.setItem(LOCAL_STORAGE_MUTED_KEY, "false");
      setAudioMuted(false);
    } else {
      audioSrc.volume = MIN_VOLUME;
      localStorage.setItem(LOCAL_STORAGE_MUTED_KEY, "true");
      setAudioMuted(true);
    }
  }

  function loadAudioFromSrc(src: Music) {
    if (src === Music.Default) {
      audioSrc = audioDefault;
    } else if (src === Music.Battle) {
      audioSrc = audioBattle;
    }
  }

  function switchAudioSrc(src: Music) {
    if (audioMuted) {
      if (src === Music.Default) {
        audioSrc = audioDefault;
      } else if (src === Music.Battle) {
        audioSrc = audioBattle;
      }
    } else {
      fadeout(() => {
        if (src === Music.Default) {
          audioSrc = audioDefault;
        } else if (src === Music.Battle) {
          audioSrc = audioBattle;
        }

        audioSrc.volume = MIN_VOLUME;
        audioSrc.currentTime = 0;
        audioSrc.play();

        fadeIn();
      });
    }
  }

  return {
    switchAudioSrc,
    pauseAudio,
    playAudio,
    loadAudioFromSrc,
    toggleMute,
    audioMuted,
  };
}
