import { atom, useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../utils";
import { CharacterWithAbilities } from "../../../types/custom";
import Player from "./Player";
import { Tables } from "../../../types/supabase";
import { FightWithPlayers } from "../types.js";
import {
  RealtimeChannel,
  RealtimePostgresInsertPayload,
} from "@supabase/supabase-js";
import BattleTitle from "./BattleTitle.js";
import { BattleStatus } from "./types.js";

type BattleProps = {
  fight: FightWithPlayers;
  characterId: CharacterWithAbilities["id"];
};

type RealtimePayloadData = {
  metadata: {
    player_1: CharacterWithAbilities;
    player_2: CharacterWithAbilities;
    turn: Tables<"fights">["turn"];
    winner_id: Tables<"fights">["winner_id"];
    game_over: Tables<"fights">["game_over"];
    current_turn_player_id: Tables<"fights">["current_turn_player_id"];
    missed: boolean;
  };
};

export default function Battle({ fight, characterId }: BattleProps) {
  const [player1, setPlayer1] = useState(fight.player1);
  const [player2, setPlayer2] = useState(fight.player2);

  const setTurn = useSetAtom(useMemo(() => atom(fight.turn), [fight.turn]));
  const [gameOver, setGameOver] = useState(fight.game_over);
  const [player1Disabled, setPlayer1Disabled] = useState(false);
  const [player2Disabled, setPlayer2Disabled] = useState(false);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(
    fight.current_turn_player_id
  );
  const [winner, setWinner] = useState<CharacterWithAbilities | null>(null);
  const [battleStatus, setBattleStatus] = useState(
    fight.current_turn_player_id === fight.player1.id
      ? BattleStatus.Player1Turn
      : BattleStatus.Player2Turn
  );

  useEffect(function () {
    if (characterId === fight.player1_id) {
      setPlayer2Disabled(true);
    } else {
      setPlayer1Disabled(true);
    }

    const player1ActionsChannel = createPlayers1ActionsChannel(
      fight.player1.id
    );
    const player2ActionsChannel = createPlayers2ActionsChannel(
      fight.player2.id
    );

    player1ActionsChannel.subscribe();
    player2ActionsChannel.subscribe();

    return () => {
      player1ActionsChannel.unsubscribe();
      player2ActionsChannel.unsubscribe();
    };
  }, []);

  function setFightToGameOver(
    winner_id: FightWithPlayers["winner_id"],
    player_1: CharacterWithAbilities,
    player_2: CharacterWithAbilities
  ) {
    if (winner_id === player_1.id) {
      setWinner(player_1);
      setBattleStatus(BattleStatus.Player1Wins);
    } else {
      setWinner(player_2);
      setBattleStatus(BattleStatus.Player2Wins);
    }

    setGameOver(true);
  }

  function createPlayers1ActionsChannel(id: string): RealtimeChannel {
    return supabase.channel(`player 1 actions`).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "actions",
        filter: `initiator=eq.${id}`,
      },
      async (payload: RealtimePostgresInsertPayload<RealtimePayloadData>) => {
        console.log(`player 1 action`, payload);

        const {
          player_1,
          player_2,
          turn,
          game_over,
          current_turn_player_id,
          winner_id,
          missed,
        } = payload.new.metadata;

        console.log({
          p1_current_health: player_1.current_health,
          p2_current_health: player_2.current_health,
        });

        setBattleStatus(BattleStatus.Player1Attacking);
        setPlayer1({ ...player_1 });

        setTimeout(() => {
          setTurn(turn);
          setCurrentTurnPlayerId(current_turn_player_id);

          if (missed) {
            setBattleStatus(BattleStatus.Player1Missed);
          } else {
            setBattleStatus(BattleStatus.Player2Defending);
          }

          setTimeout(() => {
            setPlayer2({ ...player_2 });
            setBattleStatus(BattleStatus.Player2Turn);

            if (game_over) {
              setFightToGameOver(winner_id, player_1, player_2);
            }

            setPlayer2Disabled(player_2.id !== characterId);
          }, 1000);
        }, 1000);
      }
    );
  }

  function createPlayers2ActionsChannel(id: string): RealtimeChannel {
    return supabase.channel(`player 2 actions`).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "actions",
        filter: `initiator=eq.${id}`,
      },
      async (payload: RealtimePostgresInsertPayload<RealtimePayloadData>) => {
        console.log(`player 2 action`, payload);

        const {
          player_1,
          player_2,
          turn,
          game_over,
          current_turn_player_id,
          winner_id,
          missed,
        } = payload.new.metadata;

        console.log({
          p1_current_health: player_1.current_health,
          p2_current_health: player_2.current_health,
        });

        setBattleStatus(BattleStatus.Player2Attacking);
        setPlayer2({ ...player_2 });

        setTimeout(() => {
          setTurn(turn);
          setCurrentTurnPlayerId(current_turn_player_id);

          if (missed) {
            setBattleStatus(BattleStatus.Player2Missed);
          } else {
            setBattleStatus(BattleStatus.Player1Defending);
          }

          setTimeout(() => {
            setPlayer1({ ...player_1 });
            setBattleStatus(BattleStatus.Player1Turn);

            if (game_over) {
              setFightToGameOver(winner_id, player_1, player_2);
            }

            setPlayer1Disabled(player_1.id !== characterId);
          }, 1000);
        }, 1000);
      }
    );
  }

  return (
    <>
      <BattleTitle
        characterId={characterId}
        battleStatus={battleStatus}
        winner={winner}
      />
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
              disableAbilities={() => setPlayer1Disabled(true)}
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
              disableAbilities={() => setPlayer2Disabled(true)}
            />
          </>
        )}
      </div>
    </>
  );
}
