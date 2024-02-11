import { Link } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

const Nav = () => {
  const { loggedIn, currentUser, logout } = useAuthContext()!;

  const sharedCssClasses = "m-0 text-3xl hover:underline";

  const handleLogoutClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    logout();
  };

  return (
    <nav>
      <Link to={"/"} className={`m-0 ${sharedCssClasses}`}>
        Info
      </Link>
      <Link to={"/fight"} className={`ml-4 ${sharedCssClasses}`}>
        Fight!
      </Link>
      {!loggedIn ? (
        <Link to={"/login"} className={`ml-4 ${sharedCssClasses}`}>
          Login
        </Link>
      ) : (
        <Link
          to={"/logout"}
          className={`ml-4 ${sharedCssClasses}`}
          onClick={handleLogoutClick}
        >
          Logout {`${currentUser?.email}`}
        </Link>
      )}
    </nav>
  );
};

export default Nav;
