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
const attackingAtom = atom(false);
const opponentDefeatedAtom = atom(false);

// const calculateHealthPercentage = (health: number, maxHealth: number) => {
//   return (health / maxHealth) * 100;
// };

const Fight = () => {
  const [opponent, setOpponent] = useAtom(opponentAtom);
  const [player, setPlayer] = useAtom(playerAtom);
  const [fightLog, setFightLog] = useAtom(fightLogAtom);
  // const [gameOver, setGameOver] = useAtom(gameOverAtom);
  const gameOver = useAtomValue(gameOverAtom);
  const [attacking, setAttacking] = useAtom(attackingAtom);
  // const [opponentDefeated, setOpponentDefeated] = useAtom(opponentDefeatedAtom);
  const opponentDefeated = useAtomValue(opponentDefeatedAtom);
  const [player1Abilities, setPlayer1Abilities] = useAtom(player1AbilitiesAtom);
  const [player2Abilities, setPlayer2Abilities] = useAtom(player2AbilitiesAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const { fightId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

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

      if (fetchFightsError) {
        console.error(fetchFightsError);
        return;
      }
      const { player1_id: player1Id, player2_id: player2Id } = data!;

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

      if (fetchPlayer1Error) console.error(fetchPlayer1Error);
      if (fetchPlayer2Error) console.error(fetchPlayer2Error);

      if (!player1 || !player2) {
        console.error("Player 1 or 2 was not retreived");
        return;
      }

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

      console.log({ data, fightId, player1Id, player2Id, player1, player2 });

      // live updates
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
            // console.error(errors)
            console.log(payload);
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
            console.log(payload);
            setOpponent(payload.new as Tables<"characters">);
          }
        )
        .subscribe();
    };

    fetchData();
  }, []);

  const handleClick: AbilityButtonHandleClick = async (
    _button,
    ability,
    abilitySlot
  ) => {
    setAttacking(true);
    let action = "";

    if (player?.id) {
      const { data, error } = await supabase.functions.invoke("useAbility", {
        body: {
          abilityNumber: abilitySlot,
          playerId: player.id,
          opponentId: "72894403-0559-4308-aa13-95b42a77130f",
        },
      });

      console.log({ data, error });
    }
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

    setTimeout(() => setAttacking(false), 500);

    setFightLog([...fightLog, action]);
  };

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
              attacking={attacking}
              ability1={player1Abilities[0]}
              ability2={player1Abilities[1]}
              ability3={player1Abilities[2]}
              // reverse={true}
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
              defeated={opponentDefeated}
              reverse={true}
              healthPercentage={100}
              ability1={player2Abilities[0]}
              ability2={player2Abilities[1]}
              ability3={player2Abilities[2]}
            />
          )}
        </section>
      </div>
      <div className="mt-10">
        <h2 className="text-xl">Choose an ability</h2>
        <section className="mt-6">
          {player && (
            <>
              <AbilityButton
                disabled={gameOver}
                ability={player1Abilities[0]}
                handleClick={handleClick}
                abilitySlot={1}
              />
              <AbilityButton
                disabled={gameOver}
                ability={player1Abilities[1]}
                handleClick={handleClick}
                abilitySlot={2}
              />
              <AbilityButton
                disabled={gameOver}
                ability={player1Abilities[2]}
                handleClick={handleClick}
                abilitySlot={3}
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
