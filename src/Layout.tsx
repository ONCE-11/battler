import Nav from "./components/Nav";
import GlobalMessage from "./components/GlobalMessage";
import { Outlet } from "react-router-dom";
import { useMessage } from "./components/context/MessageContext";

const Layout = () => {
  const { message, setMessage } = useMessage()!;

  console.log(message);

  return (
    <>
      <header className="m-4 flex justify-between">
        <span className="text-4xl">Battler</span>
        <Nav />
      </header>

      <main className="m-4">
        {message?.type && (
          <GlobalMessage message={message} setMessage={setMessage} />
        )}
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
