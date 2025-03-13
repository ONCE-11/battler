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

const ATTACK_TIMEOUT_DELAY = 1000;

export default function Battle({ fight, characterId }: BattleProps) {
  const [player1, setPlayer1] = useState(fight.player1);
  const [player2, setPlayer2] = useState(fight.player2);

  const setTurn = useSetAtom(useMemo(() => atom(fight.turn), [fight.turn]));
  const [gameOver, setGameOver] = useState(fight.game_over);
  const [player1Disabled, setPlayer1Disabled] = useState(true);
  const [player2Disabled, setPlayer2Disabled] = useState(true);
  const [currentVisiblePlayerId, setCurrentVisiblePlayerId] = useState(
    fight.current_turn_player_id
  );
  const [winner, setWinner] = useState<CharacterWithAbilities | null>(null);
  const [battleStatus, setBattleStatus] = useState(
    fight.current_turn_player_id === fight.player1.id
      ? BattleStatus.Player1Turn
      : BattleStatus.Player2Turn
  );

  useEffect(function () {
    if (
      characterId === fight.player1_id &&
      fight.current_turn_player_id === fight.player1_id
    ) {
      setPlayer1Disabled(false);
    } else if (
      characterId === fight.player2_id &&
      fight.current_turn_player_id === fight.player2_id
    ) {
      setPlayer2Disabled(false);
    }

    const [player1ActionsChannel, player1Timeouts] =
      createPlayers1ActionsChannel(fight.player1.id);
    const [player2ActionsChannel, player2Timeouts] =
      createPlayers2ActionsChannel(fight.player2.id);

    player1ActionsChannel.subscribe();
    player2ActionsChannel.subscribe();

    return () => {
      player1ActionsChannel.unsubscribe();
      player2ActionsChannel.unsubscribe();

      player1Timeouts.forEach((timeout) => clearTimeout(timeout));
      player2Timeouts.forEach((timeout) => clearTimeout(timeout));
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

  function createPlayers1ActionsChannel(
    id: string
  ): [RealtimeChannel, NodeJS.Timeout[]] {
    const timeouts: NodeJS.Timeout[] = [];

    const channel = supabase.channel(`player 1 actions`).on(
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
          winner_id,
          missed,
          current_turn_player_id,
        } = payload.new.metadata;

        console.log({
          p1_current_health: player_1.current_health,
          p2_current_health: player_2.current_health,
        });

        setBattleStatus(BattleStatus.Player1Attacking);
        setPlayer1({ ...player_1 });

        const playerSwitchTimeout = setTimeout(() => {
          setTurn(turn);
          setCurrentVisiblePlayerId(player_2.id);

          if (missed) {
            setBattleStatus(BattleStatus.Player1Missed);
          } else {
            setBattleStatus(BattleStatus.Player2Defending);
          }

          const damageTimeout = setTimeout(() => {
            setPlayer2({ ...player_2 });

            if (game_over) {
              setFightToGameOver(winner_id, player_1, player_2);
            } else if (current_turn_player_id === player_2.id) {
              setPlayer2Disabled(player_2.id !== characterId);
              setBattleStatus(BattleStatus.Player2Turn);
            } else {
              // player 1 has skipped a turn
              setBattleStatus(BattleStatus.Player1SkipsTurn);

              const switchBackTimeout = setTimeout(() => {
                // now that we know player 1 has skipped, we switch back to player 1
                setPlayer1Disabled(player_1.id !== characterId);
                setCurrentVisiblePlayerId(player_1.id);
                setBattleStatus(BattleStatus.Player1Turn);
              }, ATTACK_TIMEOUT_DELAY);

              timeouts.push(switchBackTimeout);
            }
          }, ATTACK_TIMEOUT_DELAY);

          timeouts.push(damageTimeout);
        }, ATTACK_TIMEOUT_DELAY);

        timeouts.push(playerSwitchTimeout);
      }
    );

    return [channel, timeouts];
  }

  function createPlayers2ActionsChannel(
    id: string
  ): [RealtimeChannel, NodeJS.Timeout[]] {
    const timeouts: NodeJS.Timeout[] = [];

    const channel = supabase.channel(`player 2 actions`).on(
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
          winner_id,
          missed,
          current_turn_player_id,
        } = payload.new.metadata;

        console.log({
          p1_current_health: player_1.current_health,
          p2_current_health: player_2.current_health,
        });

        setBattleStatus(BattleStatus.Player2Attacking);
        setPlayer2({ ...player_2 });

        const playerSwitchTimeout = setTimeout(() => {
          setTurn(turn);
          setCurrentVisiblePlayerId(player_1.id);

          if (missed) {
            setBattleStatus(BattleStatus.Player2Missed);
          } else {
            setBattleStatus(BattleStatus.Player1Defending);
          }

          const damageTimeout = setTimeout(() => {
            setPlayer1({ ...player_1 });

            if (game_over) {
              setFightToGameOver(winner_id, player_1, player_2);
            } else if (current_turn_player_id === player_1.id) {
              // we check if player 2 skipped a turn
              setPlayer1Disabled(player_1.id !== characterId);
              setBattleStatus(BattleStatus.Player1Turn);
            } else {
              // player 2 has skipped a turn
              setBattleStatus(BattleStatus.Player2SkipsTurn);

              const switchBackTimeout = setTimeout(() => {
                // now that we know player 2 has skipped, we switch back to player 2
                setPlayer2Disabled(player_2.id !== characterId);
                setCurrentVisiblePlayerId(player_2.id);
                setBattleStatus(BattleStatus.Player2Turn);
              }, ATTACK_TIMEOUT_DELAY);

              timeouts.push(switchBackTimeout);
            }
          }, ATTACK_TIMEOUT_DELAY);

          timeouts.push(damageTimeout);
        }, ATTACK_TIMEOUT_DELAY);

        timeouts.push(playerSwitchTimeout);
      }
    );

    return [channel, timeouts];
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
              hidden={currentVisiblePlayerId !== player1.id}
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
              hidden={currentVisiblePlayerId !== player2.id}
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
