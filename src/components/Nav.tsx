import { Link, useNavigate, useMatches } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { useAtomValue } from "jotai";
import { loggedInAtom } from "../state";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Nav = () => {
  const { logout } = useAuth();
  const loggedIn = useAtomValue(loggedInAtom);
  const navigate = useNavigate();
  const [, { pathname }] = useMatches();
  const sharedCssClasses = "m-0 text-2xl inline-block";

  const handleLogoutClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    logout();
    navigate("/");
  };

  const underline = (match: string): string => {
    const hoverUnderline = "hover:underline";
    return pathname === match ? `underline ${hoverUnderline}` : hoverUnderline;
  };

  return (
    <>
      <nav className="flex justify-between items-baseline">
        <div>
          <Link to={"/"} className="text-4xl">
            <span>🐮</span> Beef<span className="text-purple-500">!</span>
          </Link>
        </div>
        <div>
          {loggedIn ? (
            <>
              <Link to={"/character"} className={`m-0 ${sharedCssClasses}}`}>
                <FontAwesomeIcon
                  icon="user"
                  className="text-base align-middle"
                />{" "}
                <span className={`${underline("/character")}`}>Character</span>
              </Link>
              <Link to={"/beefs"} className={`ml-4 ${sharedCssClasses}`}>
                <FontAwesomeIcon
                  icon="skull-crossbones"
                  className="text-base  align-middle"
                />{" "}
                <span className={`${underline("/beefs")}`}>Beefs</span>
              </Link>
              <Link to={"/bodega"} className={`ml-4 ${sharedCssClasses}`}>
                <FontAwesomeIcon
                  icon="store"
                  className="text-base  align-middle"
                />{" "}
                <span className={`${underline("/bodega")}`}>Bodega</span>
              </Link>
              <Link to={"/equipment"} className={`ml-4 ${sharedCssClasses}`}>
                <FontAwesomeIcon
                  icon="shield"
                  className="text-base align-middle"
                />{" "}
                <span className={`${underline("/equipment")}`}>Equipment</span>
              </Link>
              <Link
                to={"/logout"}
                className={`ml-4  ${sharedCssClasses}`}
                onClick={handleLogoutClick}
              >
                <FontAwesomeIcon
                  icon="right-from-bracket"
                  className="text-base align-middle"
                />{" "}
                <span className="hover:underline">Logout</span>
              </Link>
            </>
          ) : (
            <Link to={"/login"} className={`ml-4 ${sharedCssClasses}`}>
              <FontAwesomeIcon
                icon={["fas", "door-open"]}
                className="text-base"
              />{" "}
              <span className="hover:underline">Login</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Nav;
