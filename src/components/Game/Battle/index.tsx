import { atom, useAtom } from "jotai";
import Title from "../../Title";
import { useEffect } from "react";
import { supabase } from "../../../utils";
import { CharacterWithAbilities } from "../../../types/custom";
import Player from "./Player";
import { Tables } from "../../../types/supabase";
import { FightWithPlayers } from "../types";

type BattleProps = {
  fight: FightWithPlayers;
  character: CharacterWithAbilities;
};

type RealtimeMetadata = {
  metadata: {
    player1: CharacterWithAbilities;
    player2: CharacterWithAbilities;
    fight: {
      turn: Tables<"fights">["turn"];
      winner: Tables<"fights">["winner"];
      game_over: Tables<"fights">["game_over"];
      current_turn_player_id: Tables<"fights">["current_turn_player_id"];
    };
  };
};

const player1Atom = atom<CharacterWithAbilities>();
const player2Atom = atom<CharacterWithAbilities>();
const turnAtom = atom(0);
const gameOverAtom = atom(false);
const player1DisabledAtom = atom(false);
const player2DisabledAtom = atom(false);
const currentTurnPlayerIdAtom = atom();

function isPlayer1Turn(turn: number): boolean {
  return turn % 2 === 0;
}

function isPlayer2Turn(turn: number): boolean {
  return turn % 2 !== 0;
}

export default function Battle({ fight, character }: BattleProps) {
  const [player1, setPlayer1] = useAtom(player1Atom);
  const [player2, setPlayer2] = useAtom(player2Atom);
  const [turn, setTurn] = useAtom(turnAtom);
  const [_gameOver, setGameOver] = useAtom(gameOverAtom);
  const [player1Disabled, setPlayer1Disabled] = useAtom(player1DisabledAtom);
  const [player2Disabled, setPlayer2Disabled] = useAtom(player2DisabledAtom);
  const [_currentTurnPlayerId, setCurrentTurnPlayerId] = useAtom(
    currentTurnPlayerIdAtom
  );

  useEffect(function () {
    setPlayer1(fight.player1);
    setPlayer2(fight.player2);
    setCurrentTurnPlayerId(fight.current_turn_player_id);

    if (character.id === fight.player1_id) {
      setPlayer2Disabled(true);
    } else {
      setPlayer1Disabled(true);
    }

    setTurn(fight.turn);

    initiatePlayer1RealtimeUpdates(fight.player1.id);
    initiatePlayer2RealtimeUpdates(fight.player2.id);
  }, []);

  function updateStates(
    updatedPlayer1Data: Tables<"characters">,
    updatedPlayer2Data: Tables<"characters">,
    updatedTurn: Tables<"fights">["turn"],
    updatedGameOver: Tables<"fights">["game_over"],
    updatedCurrentTurnPlayerId: Tables<"fights">["current_turn_player_id"]
  ) {
    setPlayer1((previousPlayer1) => {
      if (!previousPlayer1) {
        console.error("Player 1 is not set");
        return;
      }

      return {
        ...previousPlayer1,
        attack: updatedPlayer1Data.attack,
        defense: updatedPlayer1Data.defense,
        current_health: updatedPlayer1Data.current_health,
        alive: updatedPlayer1Data.alive,
      };
    });

    setPlayer2((previousPlayer2) => {
      if (!previousPlayer2) {
        console.error("Player 2 is not set");
        return;
      }

      return {
        ...previousPlayer2,
        attack: updatedPlayer2Data.attack,
        defense: updatedPlayer2Data.defense,
        current_health: updatedPlayer2Data.current_health,
        alive: updatedPlayer2Data.alive,
      };
    });

    setTimeout(() => {
      setTurn(updatedTurn);
      setCurrentTurnPlayerId(updatedCurrentTurnPlayerId);
      setGameOver(updatedGameOver);
    }, 500);
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
        async (payload) => {
          console.log(`player 1 action`, payload);

          const {
            metadata: {
              player1,
              player2,
              fight: { turn, game_over, current_turn_player_id },
            },
          } = payload.new as RealtimeMetadata;

          updateStates(
            player1,
            player2,
            turn,
            game_over,
            current_turn_player_id
          );
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
        async (payload) => {
          console.log(`player 2 action`, payload);

          const {
            metadata: {
              player1,
              player2,
              fight: { turn, game_over, current_turn_player_id },
            },
          } = payload.new as RealtimeMetadata;

          updateStates(
            player1,
            player2,
            turn,
            game_over,
            current_turn_player_id
          );
        }
      )
      .subscribe();
  }

  return (
    <>
      <Title>Battle</Title>
      <div>
        {player1 && player2 && (
          <>
            <Player
              player={player1}
              isCurrentPlayer={true}
              hidden={isPlayer1Turn(turn)}
              healthPercentage={100}
              opponentId={player2.id}
              fightId={fight.id}
              disabled={player1Disabled}
            />
            <Player
              player={player2}
              reverse={true}
              healthPercentage={100}
              isCurrentPlayer={false}
              hidden={isPlayer2Turn(turn)}
              opponentId={player1.id}
              fightId={fight.id}
              disabled={player2Disabled}
            />
          </>
        )}
      </div>
    </>
  );
}
