import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../Button";
import { supabase } from "../../../utils";
import { CharacterWithAbilities, GamePage } from "../../../types/custom";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentUserAtom, gamePageAtom } from "../../../state";
import { useEffect } from "react";

type PotentialOpponentProps = {
  character: CharacterWithAbilities;
};

const potentialOpponentsAtom = atom<CharacterWithAbilities[]>([]);

export default function PotentialOpponents({
  character,
}: PotentialOpponentProps) {
  const currentUser = useAtomValue(currentUserAtom);
  const [potentialOpponents, setPotentialOpponents] = useAtom(
    potentialOpponentsAtom
  );

  useEffect(function () {
    async function fetchData() {
      const { data: potentialOpponents, error: fetchCharactersError } =
        await supabase
          .from("characters")
          .select("*")
          .not("user_id", "eq", currentUser!.id)
          .eq("alive", true)
          .eq("fighting", false)
          .returns<CharacterWithAbilities[]>();

      if (fetchCharactersError) throw fetchCharactersError;

      console.log({ potentialOpponents });
      setPotentialOpponents(potentialOpponents);
    }

    fetchData();
  }, []);

  const setGamePage = useSetAtom(gamePageAtom);

  async function startBeefin(player2_id: string) {
    try {
      let { error } = await supabase.rpc("start_beefin", {
        character_id: character.id,
        opponent_id: player2_id,
      });

      if (error) throw error;

      setGamePage(GamePage.Battle);
    } catch (error) {
      console.error(error);
    }
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
                    handleClick={() => startBeefin(id)}
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
