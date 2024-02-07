import Nav from "./components/Nav";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <header className="flex justify-between m-4">
        <span>Battler</span>
        <Nav />
      </header>
      <main className="m-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
