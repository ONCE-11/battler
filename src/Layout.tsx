import Nav from "./components/Nav";
import GlobalMessage from "./components/GlobalMessage";
import { Outlet } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { audioOnAtom, messageAtom } from "./atoms";
import useAuth from "./hooks/useAuth";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Button from "./components/Button";

const Layout = () => {
  const message = useAtomValue(messageAtom);
  const [suspended, setSuspended] = useState(false);
  const [audioOn, setAudioOn] = useAtom(audioOnAtom);
  const [resumeAudio, setResumeAudio] = useState(audioOn);

  const { fetchSession } = useAuth();

  async function handleVisibilityChange() {
    if (document.hidden) {
      // this prevents audioOn being out of sync
      setAudioOn((previousAudioOn) => {
        setResumeAudio(previousAudioOn);

        return false;
      });
      setSuspended(true);
    }
  }

  function handleResume() {
    setAudioOn(resumeAudio);
    setSuspended(false);
  }

  useEffect(() => {
    fetchSession(() => setSuspended(true));

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <>
      {/* TODO: change this to using tailwind */}
      <div className="max-w-screen-xl relative mx-auto">
        <header className="m-4">
          <Nav />
        </header>

        {message?.type && (
          <main className="m-4">
            <GlobalMessage />
          </main>
        )}

        <main className="mt-4 mx-4 mb-16">
          <Outlet />
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
