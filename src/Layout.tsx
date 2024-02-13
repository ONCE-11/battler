import Nav from "./components/Nav";
import GlobalMessage from "./components/GlobalMessage";
import { Outlet } from "react-router-dom";
import { useMessage } from "./components/context/MessageContext";
import { useLoading } from "./components/context/LoadingContext";

const Layout = () => {
  const { message, setMessage } = useMessage()!;
  const { loading } = useLoading()!;

  // console.log("layout", { loading });

  return (
    <div style={{ width: "1000px", margin: "0 auto" }}>
      <header className="m-4 flex justify-between">
        <span className="text-4xl">Battler</span>
        <Nav />
      </header>

      {loading ? (
        "LOADING"
      ) : (
        <main className="m-4">
          {message?.type && (
            <GlobalMessage message={message} setMessage={setMessage} />
          )}
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default Layout;
