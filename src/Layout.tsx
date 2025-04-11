import Nav from "./components/Nav";
import GlobalMessage from "./components/GlobalMessage";
import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  characterAtom,
  currentUserAtom,
  loadingAtom,
  loggedInAtom,
  messageAtom,
  sceneAtom,
} from "./atoms";
import useAuth from "./hooks/useAuth";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Button from "./components/Button";
import { useAudio } from "./hooks/useAudio";
import { Session } from "@supabase/supabase-js";
import { GameLoaderObject, Music, Scene } from "./types/custom";

const Layout = () => {
  const message = useAtomValue(messageAtom);
  const [suspended, setSuspended] = useState(false);
  const { playAudio, pauseAudio } = useAudio();
  // const [loading, setLoading] = useAtom(loadingAtom);
  const { state } = useNavigation();
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setLoggedIn = useSetAtom(loggedInAtom);
  const setCharacter = useSetAtom(characterAtom);
  const [scene, setScene] = useAtom(sceneAtom);

  const { fetchSession } = useAuth();
  const { session, character } = useLoaderData() as GameLoaderObject;

  console.log({ session: session });

  if (session) {
    setLoggedIn(true);

    if (!character) {
      setScene(Scene.NewCharacter);
    } else if (character.fighting) {
      setScene(Scene.Battle);
    } else if (!scene) {
      setScene(Scene.CharacterSheet);
    }
  } else {
    setLoggedIn(false);
  }

  setCurrentUser(session?.user);
  setCharacter(character);

  function handleResume() {
    playAudio();
    setSuspended(false);
  }

  useEffect(() => {
    async function handleVisibilityChange() {
      if (document.hidden) {
        pauseAudio();
        setSuspended(true);
      }
    }

    // setLoading(true);
    // console.log("fetching session");

    // fetchSession(() => setSuspended(true));

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <>
      {/* TODO: change this to using tailwind */}
      <div className="max-w-(--breakpoint-xl) relative mx-auto">
        <header className="m-4">
          <Nav />
        </header>

        {message?.type && (
          <main className="m-4">
            <GlobalMessage />
          </main>
        )}

        <main className="mt-4 mx-4 mb-16">
          {state === "loading" ? "Loading..." : <Outlet />}
        </main>

        <Footer />
      </div>
      {suspended && (
        <div
          className="z-50 w-full h-full absolute left-0 top-0 flex justify-center items-center flex-col"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <p className="mb-4">Game Suspended</p>
          <Button handleClick={handleResume}>Resume</Button>
        </div>
      )}
    </>
  );
};

export default Layout;
