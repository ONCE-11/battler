import { atom, useSetAtom } from "jotai";
import Title from "../../Title";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../utils";
import { CharacterWithAbilities, Scene } from "../../../types/custom";
import Player from "./Player";
import { Tables } from "../../../types/supabase";
import { FightWithPlayers } from "../types.js";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import Button from "../../Button.js";
import { sceneAtom } from "../../../atoms.js";

type BattleProps = {
  fight: FightWithPlayers;
  character: CharacterWithAbilities;
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

export default function Battle({ fight, character }: BattleProps) {
  const [player1, setPlayer1] = useState(fight.player1);
  const [player2, setPlayer2] = useState(fight.player2);

  const setTurn = useSetAtom(useMemo(() => atom(fight.turn), [fight.turn]));
  const [gameOver, setGameOver] = useState(fight.game_over);
  const [player1Disabled, setPlayer1Disabled] = useState(false);
  const [player2Disabled, setPlayer2Disabled] = useState(false);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(
    fight.current_turn_player_id
  );
  const [winnerId, setWinnerId] = useState(fight.winner_id);
  const setScene = useSetAtom(sceneAtom);

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
      setWinnerId(winner_id);
      setGameOver(game_over);
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
        <>
          <Title className="flex justify-between">
            {winnerId === character.id ? (
              <>
                <span>You win!</span>
                <Button
                  handleClick={() => setScene(Scene.Beef)}
                  className={`text-xl`}
                >
                  Take your W
                </Button>
              </>
            ) : (
              <>
                <span>You lost!</span>
                <Button
                  handleClick={() => setScene(Scene.NewCharacter)}
                  className={`text-xl`}
                >
                  Dip out
                </Button>
              </>
            )}
          </Title>
        </>
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
