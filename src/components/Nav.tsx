import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
      <Link to={"/"} className="m-0 text-3xl">
        Info
      </Link>
      <Link to={"/fight"} className="ml-4 text-3xl">
        Fight!
      </Link>
    </nav>
  );
};

export default Nav;
