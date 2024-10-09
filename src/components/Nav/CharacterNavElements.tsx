import { GamePage } from "../../types/custom";
import { RemoveUnderlinesFn } from "./types";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { gamePageAtom } from "../../state";
import NavItem from "./NavItem";
import {
  characterSheetUnderlinedAtom,
  beefUnderlinedAtom,
  battleUnderlinedAtom,
} from "./state";
import { fightAtom } from "../Game/state";

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
  const fight = useAtomValue(fightAtom);

  console.log({ fight });

  function handleClick(gamePage: GamePage, callbackFn: () => void) {
    removeUnderlines();
    setGamePage(gamePage);
    callbackFn();
    navigate("/");
  }

  return (
    <>
      {!fight && (
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
        </>
      )}
      {fight && (
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
      )}
    </>
  );
}
