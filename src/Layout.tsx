import Nav from "./components/Nav";
import { Outlet } from "react-router-dom";
import stylex from "@stylexjs/stylex";

const styles = stylex.create({
  header: {
    display: "flex",
    justifyContent: "space-between",
    margin: "1rem",
  },
  main: {
    margin: "1rem",
  },
});

const Layout = () => {
  return (
    <>
      <header {...stylex.props(styles.header)}>
        <span>Battler</span>
        <Nav />
      </header>
      <main {...stylex.props(styles.main)}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
