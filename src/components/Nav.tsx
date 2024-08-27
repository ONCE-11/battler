import { Link, useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { useAtomValue } from "jotai";
import { loggedInAtom } from "../state";

const Nav = () => {
  const { logout } = useAuth();
  const loggedIn = useAtomValue(loggedInAtom);
  const navigate = useNavigate();
  const sharedCssClasses = "m-0 text-2xl hover:underline inline-block";

  const handleLogoutClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="flex justify-between items-baseline">
        <div>
          <Link to={"/"} className="text-4xl">
            Beef
          </Link>
        </div>
        <div>
          {loggedIn ? (
            <>
              <Link
                to={"/current-character"}
                className={`m-0 ${sharedCssClasses}`}
              >
                Deets
              </Link>
              <Link to={"/beefs"} className={`ml-4 ${sharedCssClasses}`}>
                Beefs
              </Link>
              <Link to={"/bodega"} className={`ml-4 ${sharedCssClasses}`}>
                Bodega
              </Link>
              <Link to={"/equipment"} className={`ml-4 ${sharedCssClasses}`}>
                Equipment
              </Link>
              <Link
                to={"/logout"}
                className={`ml-4  ${sharedCssClasses}`}
                onClick={handleLogoutClick}
              >
                Logout
              </Link>
            </>
          ) : (
            <Link to={"/login"} className={`ml-4 ${sharedCssClasses}`}>
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Nav;
