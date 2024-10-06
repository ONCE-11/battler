import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../Button";
import { supabase } from "../../../utils";
import { CharacterWithAbilities, GamePage } from "../../../types/custom";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { characterAtom, currentUserAtom, gamePageAtom } from "../../../state";
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";

const potentialOpponentsAtom = atom<CharacterWithAbilities[]>([]);

export default function PotentialOpponents() {
  const [potentialOpponents, setPotentialOpponents] = useAtom(
    potentialOpponentsAtom
  );
  const setGamePage = useSetAtom(gamePageAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const character = useAtomValue(characterAtom);

  if (!currentUser) {
    console.error("Current user is not defined");
    return;
  }

  if (!character) {
    console.error("Character is not defined");
    return;
  }

  useEffect(function () {
    async function fetchData(currentUser: User) {
      const { data: potentialOpponents, error: fetchCharactersError } =
        await supabase
          .from("characters")
          .select("*")
          .not("user_id", "eq", currentUser.id)
          .eq("alive", true)
          .eq("fighting", false)
          .returns<CharacterWithAbilities[]>();

      if (fetchCharactersError) throw fetchCharactersError;

      // console.log({ potentialOpponents });
      setPotentialOpponents(potentialOpponents);
    }

    fetchData(currentUser);
  }, []);

  async function startBeefin(
    character: CharacterWithAbilities,
    player2_id: string
  ) {
    const { data, error } = await supabase.rpc("start_beefin", {
      character_id: character.id,
      opponent_id: player2_id,
    });

    if (error) {
      console.error(error);
      return;
    }

    console.log({ data });

    setGamePage(GamePage.Battle);
  }

  return (
    <>
      <p className="text-xl w-full bg-purple-500 text-white py-2 px-4 shadow-lg shadow-black">
        Opps
      </p>
      <ul>
        {potentialOpponents.length > 0 ? (
          potentialOpponents.map(({ name, id }) => (
            <li key={id} className="p-4 flex justify-between items-center">
              <span>{name}</span>
              {!character.fighting && (
                <span className="text-right">
                  <Button
                    additionalCssClasses={["text-right"]}
                    handleClick={() => startBeefin(character, id)}
                  >
                    <FontAwesomeIcon icon={["fas", "face-angry"]} />{" "}
                  </Button>
                </span>
              )}
            </li>
          ))
        ) : (
          <li className="p-4">
            Everyone else is dead{" "}
            <FontAwesomeIcon icon={["far", "face-angry"]} />
          </li>
        )}
      </ul>
    </>
  );
}
