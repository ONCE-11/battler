import { Link } from "react-router-dom";
import stylex from "@stylexjs/stylex";

const styles = stylex.create({
  navLink: {
    marginRight: {
      default: "0",
      ":first-child": "1rem",
    },
  },
});

const Nav = () => {
  return (
    <nav>
      <Link {...stylex.props(styles.navLink)} to={"/"}>
        Info
      </Link>
      <Link {...stylex.props(styles.navLink)} to={"/fight"}>
        Fight!
      </Link>
    </nav>
  );
};

export default Nav;
