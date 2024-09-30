import { GamePage } from "../../types/custom";
import { RemoveUnderlinesFn } from "./types";
import { useNavigate } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { gamePageAtom } from "../../state";
import NavItem from "./NavItem";
import {
  characterSheetUnderlinedAtom,
  beefUnderlinedAtom,
  battleUnderlinedAtom,
} from "./state";

type CharacterNavElementsProps = {
  sharedCssClasses: string;
  removeUnderlines: RemoveUnderlinesFn;
};

export default function CharacterNavElements({
  sharedCssClasses,
  removeUnderlines,
}: CharacterNavElementsProps) {
  const setGamePage = useSetAtom(gamePageAtom);
  const [characterSheetUnderlined, setCharacterSheetUnderlined] = useAtom(
    characterSheetUnderlinedAtom
  );
  const [beefUnderlined, setBeefUnderlined] = useAtom(beefUnderlinedAtom);
  const [battleUnderlined, setBattleUnderlined] = useAtom(battleUnderlinedAtom);
  const navigate = useNavigate();

  function handleClick(gamePage: GamePage, callbackFn: () => void) {
    removeUnderlines();
    setGamePage(gamePage);
    callbackFn();
    navigate("/");
  }

  return (
    <>
      <NavItem
        sharedCssClasses={sharedCssClasses}
        handleClick={(_e) =>
          handleClick(GamePage.CharacterSheet, () =>
            setCharacterSheetUnderlined(true)
          )
        }
        icon="user"
        underlined={characterSheetUnderlined}
        testId="character-sheet"
      >
        Character
      </NavItem>
      <NavItem
        sharedCssClasses={sharedCssClasses}
        handleClick={(_e) =>
          handleClick(GamePage.Beef, () => setBeefUnderlined(true))
        }
        icon="skull"
        underlined={beefUnderlined}
      >
        Beefs
      </NavItem>
      <NavItem
        sharedCssClasses={sharedCssClasses}
        handleClick={(_e) =>
          handleClick(GamePage.Battle, () => setBattleUnderlined(true))
        }
        icon="skull-crossbones"
        underlined={battleUnderlined}
      >
        Battle
      </NavItem>
    </>
  );
}
