import Character from "./Character";
import Title from "./Title";
import { AbilityButtonHandleClick } from "../types/custom";
import { useAtom, atom, useAtomValue } from "jotai";
import { supabase } from "../utils";
import { currentUserAtom } from "../state";
import { useEffect } from "react";
import AbilityButton from "./AbilityButton";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { Tables } from "../types/supabase";

type CharacterWithAbilitiesRecord = Tables<"characters"> & {
  ability_1?: Tables<"abilities">;
  ability_2?: Tables<"abilities">;
  ability_3?: Tables<"abilities">;
};

const playerAtom = atom<Tables<"characters">>();
const opponentAtom = atom<Tables<"characters">>();
const player1AbilitiesAtom = atom<
  [Tables<"abilities">, Tables<"abilities">, Tables<"abilities">] | []
>([]);
const player2AbilitiesAtom = atom<
  [Tables<"abilities">, Tables<"abilities">, Tables<"abilities">] | []
>([]);
const fightLogAtom = atom<string[]>([]);
const gameOverAtom = atom(false);
const player1AttackingAtom = atom(false);
const player2AttackingAtom = atom(false);
// const opponentDefeatedAtom = atom(false);
// const winnerAtom = atom<number>();
const currentPlayerAtom = atom<Tables<"characters">>();

// const calculateHealthPercentage = (health: number, maxHealth: number) => {
//   return (health / maxHealth) * 100;
// };

const Fight = () => {
  const [opponent, setOpponent] = useAtom(opponentAtom);
  const [player, setPlayer] = useAtom(playerAtom);
  const [fightLog, setFightLog] = useAtom(fightLogAtom);
  // const [gameOver, setGameOver] = useAtom(gameOverAtom);
  const gameOver = useAtomValue(gameOverAtom);
  const [player1Attacking, setPlayer1Attacking] = useAtom(player1AttackingAtom);
  const [player2Attacking, setPlayer2Attacking] = useAtom(player2AttackingAtom);
  // const [opponentDefeated, setOpponentDefeated] = useAtom(opponentDefeatedAtom);
  // const opponentDefeated = useAtomValue(opponentDefeatedAtom);
  const [player1Abilities, setPlayer1Abilities] = useAtom(player1AbilitiesAtom);
  const [player2Abilities, setPlayer2Abilities] = useAtom(player2AbilitiesAtom);
  const currentUser = useAtomValue(currentUserAtom);
  // const winner = useAtomValue(winnerAtom);
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom);
  const { fightId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        const tableName = "characters";
        const tablesSelect = [
          "*",
          "ability_1:ability_1_id (*)",
          "ability_2:ability_2_id (*)",
          "ability_3:ability_3_id (*)",
        ];

        const { data, error: fetchFightsError } = await supabase
          .from("fights")
          .select("*")
          .eq("id", fightId!)
          .single();

        if (fetchFightsError) throw fetchFightsError;

        const { player1_id: player1Id, player2_id: player2Id } = data;

        const [
          { data: player1, error: fetchPlayer1Error },
          { data: player2, error: fetchPlayer2Error },
        ] = await Promise.all([
          supabase
            .from(tableName)
            .select(tablesSelect.join(", "))
            .eq("id", player1Id)
            .returns<CharacterWithAbilitiesRecord[]>()
            .single(),
          supabase
            .from(tableName)
            .select(tablesSelect.join(", "))
            .eq("id", player2Id)
            .returns<CharacterWithAbilitiesRecord[]>()
            .single(),
        ]);

        if (fetchPlayer1Error) throw fetchPlayer1Error;
        if (fetchPlayer2Error) throw fetchPlayer2Error;

        setPlayer(player1);
        setPlayer1Abilities([
          player1.ability_1!,
          player1.ability_2!,
          player1.ability_3!,
        ]);
        setOpponent(player2);
        setPlayer2Abilities([
          player2.ability_1!,
          player2.ability_2!,
          player2.ability_3!,
        ]);

        // delete unused data
        delete player1.ability_1;
        delete player1.ability_2;
        delete player1.ability_3;
        delete player2.ability_1;
        delete player2.ability_2;
        delete player2.ability_3;

        if (player1.user_id === currentUser.id) {
          setCurrentPlayer(player1);
        } else {
          setCurrentPlayer(player2);
        }

        console.log({
          data,
          fightId,
          player1Id,
          player2Id,
          player1,
          player2,
        });

        // subscribe to live updates from characters table
        supabase
          .channel("player1 attacks")
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "characters",
              filter: `id=eq.${player1.id}`,
            },
            (payload) => {
              console.log(
                // payload,
                // currentPlayer,
                payload.new
                // currentPlayer === payload.new
              );
              // const player1Data = payload.new as Tables<"characters">;
              setPlayer(payload.new as Tables<"characters">);
            }
          )
          .subscribe();

        supabase
          .channel("player2 attacks")
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "characters",
              filter: `id=eq.${player2.id}`,
            },
            (payload) => {
              console.log(
                // payload,
                payload.new
                // currentPlayer,
                // currentPlayer === payload.new
              );
              setOpponent(payload.new as Tables<"characters">);
            }
          )
          .subscribe();
      } catch (error) {
        console.error(error);
        return;
      }
    };

    fetchData();
  }, []);

  const handleClick: AbilityButtonHandleClick = async (
    _button,
    ability,
    abilitySlot,
    initiator,
    receiver
  ) => {
    if (initiator.id === player?.id) {
      setPlayer1Attacking(true);
    } else {
      setPlayer2Attacking(true);
    }

    let action = "";

    const { data, error } = await supabase.functions.invoke("useAbility", {
      body: {
        abilityNumber: abilitySlot,
        playerId: initiator.id,
        opponentId: receiver.id,
      },
    });

    console.log({ data, error });
    // if (ability.metadata.type === "heal") {
    //   action = `Guile has just used ${ability.name} and healed themselves for ${player.attack} health`;

    //   setPlayer({ ...player, currentHealth: player.currentHealth + 10 });
    // } else {

    // let newOpponentHealth = opponent.currentHealth;
    // let newPlayerHealth = player.currentHealth;
    // let opponentHealthPercentage = 100;
    // let playerHealthPercentage = 100;

    // console.log("metadata: ", ability.metadata);

    // if (ability.metadata?.attack) {
    //   newOpponentHealth =
    //     opponent.currentHealth - player.attack * ability.metadata.attack;
    // } else if (_.isEmpty(ability.metadata)) {
    //   newOpponentHealth = opponent.currentHealth - player.attack;
    // }

    // if (ability.metadata?.health) {
    //   newPlayerHealth = Math.min(
    //     player.currentHealth + ability.metadata.health,
    //     player.maxHealth
    //   );
    // }

    // calculate opponent health
    // if (newOpponentHealth <= 0) {
    //   newOpponentHealth = 0;
    //   opponentHealthPercentage = 0;
    //   setOpponentDefeated(true);
    //   setGameOver(true);
    //   action = "The game is now over";
    // } else {
    //   opponentHealthPercentage = calculateHealthPercentage(
    //     newOpponentHealth,
    //     opponent.maxHealth
    //   );
    //   console.log({ opponentHealthPercentage: opponentHealthPercentage });
    //   action = `Guile has just used ${ability.name} and damaged Bison for ${player.attack} health`;
    // }

    // calculate player health
    // playerHealthPercentage = calculateHealthPercentage(
    //   newPlayerHealth,
    //   player.maxHealth
    // );
    // console.log({ playerHealthPercentage: playerHealthPercentage });

    // setOpponent({
    //   ...opponent,
    //   currentHealth: newOpponentHealth,
    //   healthPercentage: opponentHealthPercentage,
    // });

    // setPlayer({
    //   ...player,
    //   currentHealth: newPlayerHealth,
    // });
    // }

    action = `Guile has just used ${ability.name}.`;

    setTimeout(() => {
      setPlayer1Attacking(false);
      setPlayer2Attacking(false);
    }, 500);

    setFightLog([...fightLog, action]);
  };

  console.log(currentPlayer, opponent, currentPlayer?.id === opponent?.id);

  return (
    <>
      <Title text="Fight!" />
      <div className="flex justify-between relative">
        {gameOver && (
          <p className="absolute text-9xl -rotate-12 text-red-600 z-10 top-32 left-12">
            GAME OVER
          </p>
        )}
        <section>
          {player && (
            <Character
              name={"Guile"}
              character={player}
              attacking={player1Attacking}
              ability1={player1Abilities[0]}
              ability2={player1Abilities[1]}
              ability3={player1Abilities[2]}
              isCurrentPlayer={currentPlayer?.id === player?.id}
              healthPercentage={100}
              
            />
          )}
        </section>
        <section className="self-center font-bold text-8xl">VS</section>
        <section>
          {opponent && (
            <Character
              name={"Bison"}
              character={opponent}
              attacking={player2Attacking}
              reverse={true}
              healthPercentage={100}
              isCurrentPlayer={currentPlayer?.id === opponent?.id}
              ability1={player2Abilities[0]}
              ability2={player2Abilities[1]}
              ability3={player2Abilities[2]}
            />
          )}
        </section>
      </div>
      <div className="mt-10">
        <h2
          className={`text-xl${
            currentPlayer?.id === opponent?.id ? " text-right" : ""
          }`}
        >
          Choose an ability
        </h2>
        <section
          className={`mt-6${
            currentPlayer?.id === opponent?.id ? " text-right" : ""
          }`}
        >
          {currentPlayer?.id === player?.id && (
            <>
              <AbilityButton
                disabled={gameOver}
                ability={player1Abilities[0]}
                handleClick={handleClick}
                abilitySlot={1}
                initiator={player!}
                receiver={opponent!}
              />
              <AbilityButton
                disabled={gameOver}
                ability={player1Abilities[1]}
                handleClick={handleClick}
                abilitySlot={2}
                initiator={player!}
                receiver={opponent!}
              />
              <AbilityButton
                disabled={gameOver}
                ability={player1Abilities[2]}
                handleClick={handleClick}
                abilitySlot={3}
                initiator={player!}
                receiver={opponent!}
              />
            </>
          )}
          {currentPlayer?.id === opponent?.id && (
            <>
              <AbilityButton
                disabled={gameOver}
                ability={player2Abilities[0]}
                handleClick={handleClick}
                abilitySlot={1}
                initiator={opponent!}
                receiver={player!}
              />
              <AbilityButton
                disabled={gameOver}
                ability={player2Abilities[1]}
                handleClick={handleClick}
                abilitySlot={2}
                initiator={opponent!}
                receiver={player!}
              />
              <AbilityButton
                disabled={gameOver}
                ability={player2Abilities[2]}
                handleClick={handleClick}
                abilitySlot={3}
                initiator={opponent!}
                receiver={player!}
              />
            </>
          )}
        </section>
      </div>
      <div className="mt-10 text-xl">Fight Log</div>
      <ul className="mt-6 leading-loose overflow-y-auto h-72">
        {fightLog.map((action, index) => (
          <li key={index}>{action}</li>
        ))}
      </ul>
    </>
  );
};

export default Fight;
