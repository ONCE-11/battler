import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { characterAtom, sceneAtom, loggedInAtom } from "../../atoms";
import { RemoveUnderlinesFn } from "./types";
import CharacterNavElements from "./CharacterNavElements";
import { Scene } from "../../types/custom";
import NavItem from "./NavItem";
import {
  battleUnderlinedAtom,
  beefUnderlinedAtom,
  characterSheetUnderlinedAtom,
} from "./atoms";

const newCharacterUnderlinedAtom = atom<boolean>(false);
const loginUnderlinedAtom = atom<boolean>(false);

const Nav = () => {
  const { logout } = useAuth();
  const loggedIn = useAtomValue(loggedInAtom);
  const navigate = useNavigate();
  const sharedCssClasses = "m-0 inline-block";
  const character = useAtomValue(characterAtom);
  const setGamePage = useSetAtom(sceneAtom);

  // underline atoms
  const [newCharacterUnderlined, setNewCharacterUnderlined] = useAtom(
    newCharacterUnderlinedAtom
  );
  const setCharacterSheetUnderlined = useSetAtom(characterSheetUnderlinedAtom);
  const setBeefUnderlined = useSetAtom(beefUnderlinedAtom);
  const setBattleUnderlined = useSetAtom(battleUnderlinedAtom);
  const [loginUnderlined, setLoginUnderlined] = useAtom(loginUnderlinedAtom);

  const removeUnderlines: RemoveUnderlinesFn = () => {
    setNewCharacterUnderlined(false);
    setCharacterSheetUnderlined(false);
    setBeefUnderlined(false);
    setBattleUnderlined(false);
    setLoginUnderlined(false);
  };

  function handleLogoutClick() {
    logout();
    navigate("/");
  }

  function handleNewCharacterClick() {
    removeUnderlines();
    setNewCharacterUnderlined(true);
    setGamePage(Scene.NewCharacter);
    navigate("/");
  }

  function handleLoginClick() {
    removeUnderlines();
    setLoginUnderlined(true);
    navigate("/login");
  }

  function handleHomeClick() {
    removeUnderlines();
    navigate("/");
  }

  return (
    <>
      <nav className="flex justify-between items-baseline">
        <div>
          <button className="text-xl" onClick={handleHomeClick}>
            <span>🐮</span> Beef<span className="text-purple-500">!</span>
          </button>
        </div>
        <div>
          {loggedIn ? (
            <>
              {character ? (
                <CharacterNavElements
                  sharedCssClasses={sharedCssClasses}
                  removeUnderlines={removeUnderlines}
                />
              ) : (
                <NavItem
                  sharedCssClasses={sharedCssClasses}
                  handleClick={handleNewCharacterClick}
                  icon="user"
                  underlined={newCharacterUnderlined}
                  testId="new-character"
                >
                  New Character
                </NavItem>
              )}
              <NavItem
                sharedCssClasses={sharedCssClasses}
                handleClick={handleLogoutClick}
                icon="right-from-bracket"
                underlined={false}
              >
                Logout
              </NavItem>
            </>
          ) : (
            <NavItem
              sharedCssClasses={sharedCssClasses}
              icon={["fas", "door-open"]}
              handleClick={handleLoginClick}
              underlined={loginUnderlined}
            >
              {" "}
              Login
            </NavItem>
          )}
        </div>
      </nav>
    </>
  );
};

export default Nav;
