import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../Button";
import { supabase } from "../../../utils";
import { CharacterWithAbilities, Scene } from "../../../types/custom";
import { useAtom, useSetAtom } from "jotai";
import { characterAtom, sceneAtom } from "../../../atoms";

type PotentialOpponentsProps = {
  potentialOpponents: CharacterWithAbilities[];
};

export default function PotentialOpponents({
  potentialOpponents,
}: PotentialOpponentsProps) {
  const setScene = useSetAtom(sceneAtom);
  const [character, setCharacter] = useAtom(characterAtom);

  if (!character) {
    console.error("Character is not defined");
    return;
  }

  async function startBeefin(
    character: CharacterWithAbilities,
    player2_id: string
  ) {
    const { error } = await supabase.rpc("start_beefin", {
      character_id: character.id,
      opponent_id: player2_id,
    });

    if (error) {
      console.error(
        new Error(error.message, {
          cause: JSON.stringify(error),
        })
      );
      return;
    }

    console.log({ character });

    setCharacter((priorCharacter) => {
      return priorCharacter
        ? { ...priorCharacter, fighting: true }
        : { ...character, fighting: true };
    });

    setScene(Scene.Battle);
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
                    className="text-right"
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
