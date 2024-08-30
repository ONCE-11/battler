import Nav from "./components/Nav";
import GlobalMessage from "./components/GlobalMessage";
import { Outlet } from "react-router-dom";
import { useAtomValue } from "jotai";
import { loadingAtom, messageAtom } from "./state";
import useAuth from "./components/hooks/useAuth";
import { useEffect } from "react";
import Footer from "./components/Footer";

const Layout = () => {
  const loading = useAtomValue(loadingAtom);
  const message = useAtomValue(messageAtom);

  const { fetchSession } = useAuth();

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    // TODO: change this to using tailwind
    <div className="max-w-screen-xl relative mx-auto">
      <header className="m-4">
        <Nav />
      </header>

      {message?.type && (
        <main className="m-4">
          <GlobalMessage />
        </main>
      )}

      {loading ? (
        "LOADING"
      ) : (
        <main className="mt-4 mx-4 mb-16">
          <Outlet />
        </main>
      )}

      <Footer />
    </div>
  );
};

export default Layout;
