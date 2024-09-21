import { useEffect } from "react";
import Title from "../Title";
import { CharacterWithAbilities, GamePage } from "../../types/custom";
import { supabase } from "../../utils";
import { Tables } from "../../types/supabase";
import { currentUserAtom, gamePageAtom } from "../../state";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type FightWithPlayers = Tables<"fights"> & {
  player1: Tables<"characters">;
  player2: Tables<"characters">;
};

type BeefProps = {
  character: CharacterWithAbilities;
};

const potentialOpponentsAtom = atom<Tables<"characters">[]>([]);
const pastFightsAtom = atom<FightWithPlayers[]>([]);

export default function Beef({ character }: BeefProps) {
  const currentUser = useAtomValue(currentUserAtom);
  const setGamePage = useSetAtom(gamePageAtom);
  const [potentialOpponents, setPotentialOpponents] = useAtom(
    potentialOpponentsAtom
  );
  const [pastFights, setPastFights] = useAtom(pastFightsAtom);

  useEffect(function () {
    async function fetchData() {
      const { data: pastFightsData, error: fetchPastFightsError } =
        await supabase
          .from("fights")
          .select("*, player1:player1_id(*), player2:player2_id(*)")
          .or(`player1_id.in.(${character.id}),player2_id.in.(${character.id})`)
          .eq("game_over", true)
          .returns<FightWithPlayers[]>();

      if (fetchPastFightsError) throw fetchPastFightsError;

      console.log({ pastFightsData });

      setPastFights(pastFightsData);

      const { data: potentialOpponents, error: fetchCharactersError } =
        await supabase
          .from("characters")
          .select("*")
          .not("user_id", "eq", currentUser!.id)
          .eq("alive", true)
          .eq("fighting", false)
          .returns<Tables<"characters">[]>();

      if (fetchCharactersError) throw fetchCharactersError;

      console.log({ potentialOpponents });
      setPotentialOpponents(potentialOpponents);
    }

    fetchData();
  }, []);

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
      <Title>Beef</Title>
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

      <table className="table-auto w-full">
        <caption className="text-xl w-full bg-purple-500 text-white py-2 px-4 text-left shadow-lg shadow-black">
          Past Beef
        </caption>
        {pastFights.length > 0 ? (
          <>
            <thead className="border-b border-black">
              <tr>
                <th className="text-left p-4">Opponent</th>
                <th className="text-left p-4">Result</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {pastFights.map(({ player1, player2, id, winner }) => (
                <tr key={id}>
                  <td className="p-4">
                    {player1.id === character.id ? player2.name : player1.name}
                  </td>
                  <td className="p-4">{winner === character.id ? "W" : "L"}</td>
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          <tbody>
            <tr>
              <td colSpan={2} className="p-4">
                You have no past beef... yet
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </>
  );
}
