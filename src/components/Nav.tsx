import { Link, useNavigate, useMatches } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { useAtomValue } from "jotai";
import { loggedInAtom } from "../state";

const Nav = () => {
  const { logout } = useAuth();
  const loggedIn = useAtomValue(loggedInAtom);
  const navigate = useNavigate();
  const [, { pathname }] = useMatches();
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
            <span>🐮</span> Beef
          </Link>
        </div>
        <div>
          {loggedIn ? (
            <>
              <Link
                to={"/character"}
                className={`m-0 ${sharedCssClasses}${
                  pathname === "/character" ? " underline" : ""
                }`}
              >
                Character
              </Link>
              <Link
                to={"/beefs"}
                className={`ml-4 ${sharedCssClasses}${
                  pathname === "/beefs" ? " underline" : ""
                }`}
              >
                Beefs
              </Link>
              <Link
                to={"/bodega"}
                className={`ml-4 ${sharedCssClasses}${
                  pathname === "/bodega" ? " underline" : ""
                }`}
              >
                Bodega
              </Link>
              <Link
                to={"/equipment"}
                className={`ml-4 ${sharedCssClasses}${
                  pathname === "/equipment" ? " underline" : ""
                }`}
              >
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
