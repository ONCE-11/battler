import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
      <Link to={"/"} className="m-0 ">
        Info
      </Link>
      <Link to={"/fight"} className="ml-4">
        Fight!
      </Link>
    </nav>
  );
};

export default Nav;
