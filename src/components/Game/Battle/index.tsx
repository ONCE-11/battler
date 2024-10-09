import { atom, useAtom, useSetAtom } from "jotai";
import Title from "../../Title";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../utils";
import { CharacterWithAbilities } from "../../../types/custom";
import Player from "./Player";
import { Tables } from "../../../types/supabase";
import { FightWithPlayers } from "../types.js";
import { SetStateAction } from "jotai/vanilla";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { fightAtom } from "../state.js";

type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

type BattleProps = {
  fight: FightWithPlayers;
  character: CharacterWithAbilities;
  fightAtom: typeof fightAtom;
  setFight: SetAtom<[SetStateAction<FightWithPlayers | undefined>], void>;
};

type RealtimePayloadData = {
  metadata: {
    player_1: CharacterWithAbilities;
    player_2: CharacterWithAbilities;
    turn: Tables<"fights">["turn"];
    winner_id: Tables<"fights">["winner_id"];
    game_over: Tables<"fights">["game_over"];
    current_turn_player_id: Tables<"fights">["current_turn_player_id"];
  };
};

const player1DisabledAtom = atom(false);
const player2DisabledAtom = atom(false);
const gameOverTitleAtom = atom("");

export default function Battle({ fight, character }: BattleProps) {
  const [player1, setPlayer1] = useState(fight.player1);
  const [player2, setPlayer2] = useState(fight.player2);

  // const [player1, setPlayer1] = useAtom(
  //   useMemo(() => atom<CharacterWithAbilities>(fight.player1), [fight.player1])
  // );
  // const [player2, setPlayer2] = useAtom(
  //   useMemo(() => atom<CharacterWithAbilities>(fight.player2), [fight.player2])
  // );
  const setTurn = useSetAtom(useMemo(() => atom(fight.turn), [fight.turn]));
  const [gameOver, setGameOver] = useAtom(
    useMemo(() => atom(fight.game_over), [fight.game_over])
  );
  const [player1Disabled, setPlayer1Disabled] = useAtom(player1DisabledAtom);
  const [player2Disabled, setPlayer2Disabled] = useAtom(player2DisabledAtom);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useAtom(
    useMemo(
      () => atom(fight.current_turn_player_id),
      [fight.current_turn_player_id]
    )
  );
  const [gameOverTitle, setGameOverTitle] = useAtom(gameOverTitleAtom);

  useEffect(function () {
    if (character.id === fight.player1_id) {
      setPlayer2Disabled(true);
    } else {
      setPlayer1Disabled(true);
    }

    initiatePlayer1RealtimeUpdates(fight.player1.id);
    initiatePlayer2RealtimeUpdates(fight.player2.id);
  }, []);

  function updateStates(
    payload: RealtimePostgresInsertPayload<RealtimePayloadData>
  ) {
    const {
      player_1,
      player_2,
      turn,
      game_over,
      current_turn_player_id,
      winner_id,
    } = payload.new.metadata;

    console.log({
      p1_current_health: player_1.current_health,
      p2_current_health: player_2.current_health,
    });

    setPlayer1({ ...player_1 });
    setPlayer2({ ...player_2 });

    setTimeout(() => {
      setTurn(turn);
      setCurrentTurnPlayerId(current_turn_player_id);
      setGameOver(game_over);

      if (game_over) {
        setGameOverTitle(winner_id === player1.id ? "P1 Wins" : "P2 Wins");
      }
    }, 1000);
  }

  function initiatePlayer1RealtimeUpdates(id: string) {
    supabase
      .channel(`player 1 actions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "actions",
          filter: `initiator=eq.${id}`,
        },
        async (payload: RealtimePostgresInsertPayload<RealtimePayloadData>) => {
          console.log(`player 1 action`, payload);

          updateStates(payload);
        }
      )
      .subscribe();
  }

  function initiatePlayer2RealtimeUpdates(id: string) {
    supabase
      .channel(`player 2 actions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "actions",
          filter: `initiator=eq.${id}`,
        },
        async (payload: RealtimePostgresInsertPayload<RealtimePayloadData>) => {
          console.log(`player 2 action`, payload);

          updateStates(payload);
        }
      )
      .subscribe();
  }

  return (
    <>
      {gameOver ? (
        <Title>{gameOverTitle}</Title>
      ) : (
        <Title>
          {currentTurnPlayerId === player1.id ? "P1's Turn" : "P2's Turn"}
        </Title>
      )}
      <div>
        {player1 && player2 && (
          <>
            <Player
              player={player1}
              isCurrentPlayer={true}
              hidden={currentTurnPlayerId !== player1.id}
              healthPercentage={100}
              opponentId={player2.id}
              fightId={fight.id}
              disabled={gameOver || player1Disabled}
            />
            <Player
              player={player2}
              reverse={true}
              healthPercentage={100}
              isCurrentPlayer={false}
              hidden={currentTurnPlayerId !== player2.id}
              opponentId={player1.id}
              fightId={fight.id}
              disabled={gameOver || player2Disabled}
            />
          </>
        )}
      </div>
    </>
  );
}
