import { useAtom, useAtomValue } from "jotai";
import { GamePage } from "../../types/custom";
import CharacterSheet from "./CharacterSheet";
import Battle from "./Battle";
import Beef from "./Beef";
import { characterAtom, currentUserAtom, gamePageAtom } from "../../state";
import { useEffect } from "react";
import useCharacter from "../../hooks/useCharacter";
import NewCharacter from "./NewCharacter";

export default function Game() {
  const gamePage = useAtomValue(gamePageAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const [character, setCharacter] = useAtom(characterAtom);
  const { fetchCharacterWithAbilities } = useCharacter();
  let componentToRender;

  useEffect(() => {
    async function fetchData() {
      if (!currentUser) return;

      const character = await fetchCharacterWithAbilities(currentUser.id);

      if (!character) return;

      setCharacter(character);
      console.log({ character });
    }

    fetchData();
  }, []);

  if (!character) {
    componentToRender = <NewCharacter setCharacter={setCharacter} />;
  } else {
    switch (gamePage) {
      case GamePage.CharacterSheet:
        componentToRender = <CharacterSheet character={character} />;
        break;
      case GamePage.Beef:
        componentToRender = <Beef character={character} />;
        break;
      case GamePage.Battle:
        componentToRender = <Battle />;
        break;
    }
  }

  return componentToRender;
}
