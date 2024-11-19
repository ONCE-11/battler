import Nav from "./components/Nav";
import GlobalMessage from "./components/GlobalMessage";
import { Outlet } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { messageAtom, suspendedAtom } from "./atoms";
import useAuth from "./hooks/useAuth";
import { useEffect } from "react";
import Footer from "./components/Footer";
import Button from "./components/Button";

const Layout = () => {
  const message = useAtomValue(messageAtom);
  const [suspended, setSuspended] = useAtom(suspendedAtom);

  const { fetchSession } = useAuth();

  useEffect(() => {
    fetchSession();
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
          <p className="mb-4">App Suspended</p>
          <Button handleClick={() => setSuspended(false)}>Resume</Button>
        </div>
      )}
    </>
  );
};

export default Layout;
