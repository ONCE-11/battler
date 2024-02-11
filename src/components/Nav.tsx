import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Nav = () => {
  const { loggedIn, currentUser, logout } = useAuth()!;

  const sharedCssClasses = "m-0 text-3xl hover:underline inline-block";

  const handleLogoutClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    logout();
  };

  return (
    <nav>
      <Link to={"/"} className={`m-0 ${sharedCssClasses}`}>
        Info
      </Link>
      {loggedIn ? (
        <>
          <Link to={"/fight"} className={`ml-4 ${sharedCssClasses}`}>
            Fight!
          </Link>
          <Link
            to={"/logout"}
            className={`ml-4 b-truncate w-52 ${sharedCssClasses}`}
            onClick={handleLogoutClick}
          >
            Logout {`${currentUser?.email}`}
          </Link>
        </>
      ) : (
        <Link to={"/login"} className={`ml-4 ${sharedCssClasses}`}>
          Login
        </Link>
      )}
    </nav>
  );
};

export default Nav;
