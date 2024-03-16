import { Link, useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const Nav = () => {
  const { loggedIn, logout } = useAuth();
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
            Battler
          </Link>
        </div>
        <div>
          {loggedIn ? (
            <>
              <Link to={"/new"} className={`m-0 ${sharedCssClasses}`}>
                New
              </Link>
              <Link to={"/fights"} className={`ml-4 ${sharedCssClasses}`}>
                Fights
              </Link>
              <Link to={"/fight"} className={`ml-4 ${sharedCssClasses}`}>
                Fight!
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
