import { useAtom, useAtomValue } from "jotai";
import { CharacterWithAbilities, Scene } from "../../types/custom";
import CharacterSheet from "./CharacterSheet";
import Battle from "./Battle";
import Beef from "./Beef";
import { characterAtom, currentUserAtom, gamePageAtom } from "../../atoms.js";
import { useEffect } from "react";
import NewCharacter from "./NewCharacter";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../utils";
import { FightWithPlayers } from "./types.js";
import { fightAtom } from "./atoms.js";

export default function Game() {
  const [gamePage, setGamePage] = useAtom(gamePageAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const [character, setCharacter] = useAtom(characterAtom);
  const [fight, setFight] = useAtom(fightAtom);
  let componentToRender;

  if (!currentUser) {
    console.error("Current user is not defined");
    return;
  }

  useEffect(() => {
    async function fetchData(currentUser: User) {
      try {
        const { data: characterWithAbilities, error: fetchCharacterError } =
          await supabase
            .from("characters")
            .select(
              "*, ability1:ability_1_id (*), ability2:ability_2_id (*), ability3:ability_3_id (*)"
            )
            .eq("user_id", currentUser.id)
            .eq("alive", true)
            .returns<CharacterWithAbilities[]>()
            .single();

        if (fetchCharacterError) throw fetchCharacterError;

        console.log({ characterWithAbilitiesData: characterWithAbilities });

        setCharacter(characterWithAbilities);

        const { data: fightWithPlayers, error: fetchFightError } =
          await supabase
            .from("fights")
            .select(
              "*, player1: player1_id(*, ability1: ability_1_id(*), ability2: ability_2_id(*), ability3: ability_3_id(*)), player2: player2_id(*, ability1: ability_1_id(*), ability2: ability_2_id(*), ability3: ability_3_id(*))"
            )
            .or(
              `player1_id.eq.${characterWithAbilities.id},player2_id.eq.${characterWithAbilities.id}`
            )
            .eq("game_over", false)
            .returns<FightWithPlayers[]>()
            .single();

        if (fetchFightError) {
          if (fetchFightError.code === "PGRST116") return;
          throw fetchFightError;
        }

        console.log({ fightWithPlayersData: fightWithPlayers });

        setFight(fightWithPlayers);
        setGamePage(Scene.Battle);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData(currentUser);
  }, []);

  if (!character) {
    componentToRender = <NewCharacter />;
  } else {
    switch (gamePage) {
      case Scene.CharacterSheet:
        componentToRender = <CharacterSheet />;
        break;
      case Scene.Beef:
        componentToRender = <Beef />;
        break;
      case Scene.Battle:
        if (!fight) {
          console.error("Fight is not set");
          return;
        }

        componentToRender = (
          <Battle
            fight={fight}
            character={character}
            fightAtom={fightAtom}
            setFight={setFight}
          />
        );
        break;
    }
  }

  return componentToRender;
}
