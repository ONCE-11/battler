import Title from "./Title";
import { supabase } from "../utils";
import { useEffect } from "react";
import { Tables } from "../types/supabase";
import { atom, useAtom, useAtomValue } from "jotai";
import { currentUserAtom } from "../state";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

type FightWithPlayers = Tables<"fights"> & {
  player1: Tables<"characters">;
  player2: Tables<"characters">;
};

const fightsWithPlayersAtom = atom<FightWithPlayers[]>([]);
const currentCharacterAtom = atom<Tables<"characters">>();
const charactersAtom = atom<Tables<"characters">[]>([]);

const Fights = () => {
  const [fightsWithPlayers, setFightsWithPlayers] = useAtom(
    fightsWithPlayersAtom
  );
  const [currentCharacter, setCurrentCharacter] = useAtom(currentCharacterAtom);
  const [characters, setCharacters] = useAtom(charactersAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: character, error: fetchCurrentCharacterError } =
          await supabase
            .from("characters")
            .select("*")
            .eq("user_id", currentUser!.id)
            .eq("alive", true)
            .single();

        if (fetchCurrentCharacterError) throw fetchCurrentCharacterError;

        setCurrentCharacter(character);

        const { data: characters, error: fetchCharactersError } = await supabase
          .from("characters")
          .select("*")
          .not("user_id", "eq", currentUser!.id)
          .eq("alive", true);

        if (fetchCharactersError) throw fetchCharactersError;

        setCharacters(characters);

        const { data: fights, error: fetchFightsError } = await supabase
          .from("fights")
          .select("*, player1:player1_id(*), player2:player2_id(*)")
          .or(`player1_id.eq.${character.id},player2_id.eq.${character.id}`)
          .returns<FightWithPlayers[]>();

        if (fetchFightsError) throw fetchFightsError;

        setFightsWithPlayers(fights);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const startBeefin = async (player2_id: string) => {
    try {
      const { data: fight, error } = await supabase
        .from("fights")
        .insert({ player1_id: currentCharacter!.id, player2_id })
        .select("id")
        .single();

      if (error) throw error;

      navigate(`/beefs/${fight.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Title text={`${currentCharacter?.name}`} />
      {characters && (
        <>
          <p className="text-xl w-full bg-slate-500 text-white py-2 px-4">
            Players
          </p>
          <ul>
            {characters.length > 0 ? (
              characters.map(({ name, id }, index) => (
                <li
                  key={index}
                  className="p-4 flex justify-between items-center"
                >
                  <span>{name}</span>
                  <span className="text-right">
                    <Button
                      text="Start beefin"
                      additionalCssClasses={["text-right"]}
                      handleClick={() => startBeefin(id)}
                    ></Button>
                  </span>
                </li>
              ))
            ) : (
              <li className="p-4">No players in the system are alive</li>
            )}
          </ul>
        </>
      )}
      {fightsWithPlayers.length > 0 && (
        <table className="table-auto w-full">
          <caption className="text-xl w-full bg-slate-500 text-white py-2 px-4 text-left">
            Ongoing Beef
          </caption>
          <thead className="border-b border-black">
            <tr>
              <th className="text-left p-4">Player 1</th>
              <th className="text-left p-4">Player 2</th>
              <th className="text-left p-4">Game Over</th>
              <th className="text-left p-4">Winner</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {fightsWithPlayers.map(
              ({ player1, player2, id, game_over, winner }, index) => (
                <tr key={index}>
                  <td className="p-4">{player1.name}</td>
                  <td className="p-4">{player2.name}</td>
                  <td className="p-4">{game_over ? "Y" : "N"}</td>
                  <td className="p-4">
                    {Object.is(winner, null) ? "" : winner}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      text="Peep"
                      handleClick={() => navigate(`/beefs/${id}`)}
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Fights;
