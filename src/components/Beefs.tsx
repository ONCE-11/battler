import Title from "./Title";
import { supabase } from "../utils";
import { useEffect } from "react";
import { Tables } from "../types/supabase";
import { atom, useAtom, useAtomValue } from "jotai";
import { currentUserAtom } from "../state";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClearButton from "./ClearButton";

type FightWithPlayers = Tables<"fights"> & {
  player1: Tables<"characters">;
  player2: Tables<"characters">;
};

const fightsWithPlayersAtom = atom<FightWithPlayers[]>([]);
const currentCharacterAtom = atom<Tables<"characters">>();
const charactersAtom = atom<Tables<"characters">[]>([]);
const pastFightsWithPlayersAtom = atom<FightWithPlayers[]>([]);

const Beefs = () => {
  const [fightsWithPlayers, setFightsWithPlayers] = useAtom(
    fightsWithPlayersAtom
  );
  const [pastFightsWithPlayers, setPastFightsWithPlayers] = useAtom(
    pastFightsWithPlayersAtom
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

        const { data: fights, error: fetchFightsError } = await supabase
          .from("fights")
          .select("*, player1:player1_id(*), player2:player2_id(*)")
          .or(`player1_id.eq.${character.id},player2_id.eq.${character.id}`)
          .returns<FightWithPlayers[]>();

        if (fetchFightsError) throw fetchFightsError;

        setFightsWithPlayers(fights);

        const { data: characters, error: fetchCharactersError } = await supabase
          .from("characters")
          .select("*")
          .not("user_id", "eq", currentUser!.id)
          .eq("alive", true);

        if (fetchCharactersError) throw fetchCharactersError;

        setCharacters(
          characters.filter(
            ({ id }) =>
              !fights.find(
                (fight) => fight.player1_id === id || fight.player2_id === id
              )
          )
        );

        const { data: allCharacterIdsResult, error: fetchAllCharactersError } =
          await supabase
            .from("characters")
            .select("id")
            .eq("user_id", currentUser!.id);

        if (fetchAllCharactersError) throw fetchAllCharactersError;

        const characterIdStrings = allCharacterIdsResult
          .map(({ id }) => id)
          .join(",");

        console.log({ userId: currentUser!.id });
        console.log({ characterIdStrings });

        const { data: pastFights, error: fetchPastFightsError } = await supabase
          .from("fights")
          .select("*, player1:player1_id(*), player2:player2_id(*)")
          .or(
            `player1_id.in.(${characterIdStrings}),player2_id.in.(${characterIdStrings})`
          )
          .returns<FightWithPlayers[]>();

        if (fetchPastFightsError) throw fetchPastFightsError;

        console.log({ pastFights });

        setPastFightsWithPlayers(pastFights);
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
      <Title>
        <FontAwesomeIcon icon="skull-crossbones" /> <span>Let's cook</span>
      </Title>
      {characters && (
        <>
          <p className="text-xl w-full bg-purple-500 text-white py-2 px-4 shadow-lg shadow-black">
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
                      additionalCssClasses={["text-right"]}
                      handleClick={() => startBeefin(id)}
                    >
                      <FontAwesomeIcon icon={["fas", "face-angry"]} />{" "}
                    </Button>
                  </span>
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
      )}
      {fightsWithPlayers.length > 0 && (
        <table className="table-auto w-full">
          <caption className="text-xl w-full bg-purple-500 text-white py-2 px-4 text-left shadow-lg shadow-black">
            Ongoing Beef
          </caption>
          <thead className="border-b border-black">
            <tr>
              <th className="text-left p-4">Player 1</th>
              {/* <th className="text-left p-4">Player 2</th> */}
              {/* <th className="text-left p-4">Game Over</th> */}
              <th className="text-left p-4">Winner</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {fightsWithPlayers.map(
              ({ player1, player2, id, game_over, winner }, index) => (
                <tr key={index}>
                  <td className="p-4">{player1.name}</td>
                  {/* <td className="p-4">{player2.name}</td> */}
                  {/* <td className="p-4">{game_over ? "Y" : "N"}</td> */}
                  <td className="p-4">
                    {Object.is(winner, null) ? "" : winner}
                  </td>
                  <td className="p-4 text-right">
                    <ClearButton
                      text="Peep"
                      handleClick={() => navigate(`/beefs/${id}`)}
                    >
                      <FontAwesomeIcon icon={["far", "eye"]} />
                    </ClearButton>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
      {pastFightsWithPlayers.length > 0 && (
        <table className="table-auto w-full">
          <caption className="text-xl w-full bg-purple-500 text-white py-2 px-4 text-left shadow-lg shadow-black">
            Past Beef
          </caption>
          <thead className="border-b border-black">
            <tr>
              <th className="text-left p-4">Player 1</th>
              {/* <th className="text-left p-4">Player 2</th> */}
              {/* <th className="text-left p-4">Game Over</th> */}
              <th className="text-left p-4">Winner</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {pastFightsWithPlayers.map(
              ({ player1, player2, id, game_over, winner }, index) => (
                <tr key={index}>
                  <td className="p-4">{player1?.name}</td>
                  {/* <td className="p-4">{player2?.name}</td> */}
                  {/* <td className="p-4">{game_over ? "Y" : "N"}</td> */}
                  <td className="p-4">
                    {Object.is(winner, null) ? "" : winner}
                  </td>
                  <td className="p-4 text-right">
                    <ClearButton
                      text="Peep"
                      handleClick={() => navigate(`/beefs/${id}`)}
                    >
                      <FontAwesomeIcon icon={["far", "eye"]} />
                    </ClearButton>
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

export default Beefs;
