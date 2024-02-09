import { Link } from "react-router-dom";

const Nav = () => {
  const sharedCssClasses = "m-0 text-3xl hover:underline";

  return (
    <nav>
      <Link to={"/"} className={`m-0 ${sharedCssClasses}`}>
        Info
      </Link>
      <Link to={"/fight"} className={`ml-4 ${sharedCssClasses}`}>
        Fight!
      </Link>
    </nav>
  );
};

export default Nav;
