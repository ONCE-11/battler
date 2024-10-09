import { useEffect } from "react";
import { supabase } from "../../../utils";
import { Tables } from "../../../types/supabase";
import { atom, useAtom, useAtomValue } from "jotai";
import { characterAtom } from "../../../atoms";
import { CharacterWithAbilities } from "../../../types/custom";

type FightWithPlayers = Tables<"fights"> & {
  player1: Tables<"characters">;
  player2: Tables<"characters">;
};

const pastFightsAtom = atom<FightWithPlayers[]>([]);

export default function PastBeef() {
  const [pastFights, setPastFights] = useAtom(pastFightsAtom);
  const character = useAtomValue(characterAtom);

  if (!character) {
    console.error("Character is not defined");
    return;
  }

  useEffect(function () {
    async function fetchData(character: CharacterWithAbilities) {
      const { data: pastFightsData, error: fetchPastFightsError } =
        await supabase
          .from("fights")
          .select("*, player1:player1_id(*), player2:player2_id(*)")
          .or(`player1_id.in.(${character.id}),player2_id.in.(${character.id})`)
          .eq("game_over", true)
          .returns<FightWithPlayers[]>();

      if (fetchPastFightsError) {
        console.error(fetchPastFightsError);
        return;
      }

      console.log({ pastFightsData });

      setPastFights(pastFightsData);
    }

    fetchData(character);
  }, []);

  return (
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
            {pastFights.map(({ player1, player2, id, winner_id }) => (
              <tr key={id}>
                <td className="p-4">
                  {player1.id === character.id ? player2.name : player1.name}
                </td>
                <td className="p-4">
                  {winner_id === character.id ? "W" : "L"}
                </td>
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
  );
}
