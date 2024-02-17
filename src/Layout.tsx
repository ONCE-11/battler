import Nav from "./components/Nav";
import GlobalMessage from "./components/GlobalMessage";
import { Outlet } from "react-router-dom";
import { useAtomValue } from "jotai";
import { loadingAtom, messageAtom } from "./main";
import useAuth from "./components/hooks/useAuth";
import { useEffect } from "react";

const Layout = () => {
  const loading = useAtomValue(loadingAtom);
  const message = useAtomValue(messageAtom);
  const { fetchSession } = useAuth();

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <div style={{ width: "1000px", margin: "0 auto" }}>
      <header className="m-4 flex justify-between">
        <span className="text-4xl">Battler</span>
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
        <main className="m-4">
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default Layout;
