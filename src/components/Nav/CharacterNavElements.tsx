import { Scene } from "../../types/custom";
import { RemoveUnderlinesFn } from "./types";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { gamePageAtom } from "../../atoms";
import NavItem from "./NavItem";
import {
  characterSheetUnderlinedAtom,
  beefUnderlinedAtom,
  battleUnderlinedAtom,
} from "./atoms";
import { fightAtom } from "../Game/atoms";

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

  function handleClick(gamePage: Scene, callbackFn: () => void) {
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
              handleClick(Scene.CharacterSheet, () =>
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
              handleClick(Scene.Beef, () => setBeefUnderlined(true))
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
            handleClick(Scene.Battle, () => setBattleUnderlined(true))
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
