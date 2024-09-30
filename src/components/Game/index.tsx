import { useAtom, useAtomValue } from "jotai";
import { GamePage } from "../../types/custom";
import CharacterSheet from "./CharacterSheet";
import Battle from "./Battle";
import Beef from "./Beef";
import { characterAtom, currentUserAtom, gamePageAtom } from "../../state";
import { useEffect } from "react";
import useCharacter from "../../hooks/useCharacter";
import NewCharacter from "./NewCharacter";
import { User } from "@supabase/supabase-js";

export default function Game() {
  const gamePage = useAtomValue(gamePageAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const [character, setCharacter] = useAtom(characterAtom);
  const { fetchCharacterWithAbilities } = useCharacter();
  let componentToRender;

  if (!currentUser) {
    console.error("Current user is not defined");
    return;
  }

  console.log({ currentUser });

  useEffect(() => {
    async function fetchData(currentUser: User) {
      // if (!currentUser) return;

      const character = await fetchCharacterWithAbilities(currentUser.id);

      setCharacter(character);
      console.log({ character });
    }

    fetchData(currentUser);
  }, []);

  if (!character) {
    componentToRender = <NewCharacter />;
  } else {
    switch (gamePage) {
      case GamePage.CharacterSheet:
        componentToRender = <CharacterSheet />;
        break;
      case GamePage.Beef:
        componentToRender = <Beef />;
        break;
      case GamePage.Battle:
        componentToRender = <Battle />;
        break;
    }
  }

  return componentToRender;
}
