import { atom, useAtom } from "jotai";
import Title from "../../Title";
import { useEffect, useMemo } from "react";
import { supabase } from "../../../utils";
import { CharacterWithAbilities } from "../../../types/custom";
import Player from "./Player";
import { Tables } from "../../../types/supabase";
import { fightAtom, FightWithPlayers } from "../types";
import { SetStateAction } from "jotai/vanilla";

type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

type BattleProps = {
  fight: FightWithPlayers;
  character: CharacterWithAbilities;
  fightAtom: typeof fightAtom;
  setFight: SetAtom<[SetStateAction<FightWithPlayers | undefined>], void>;
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
    winnerId: Tables<"characters">["id"];
  };
};

const player1DisabledAtom = atom(false);
const player2DisabledAtom = atom(false);
const gameOverTitleAtom = atom("");

export default function Battle({ fight, character }: BattleProps) {
  const [player1, setPlayer1] = useAtom(
    useMemo(() => atom<CharacterWithAbilities>(fight.player1), [fight.player1])
  );
  const [player2, setPlayer2] = useAtom(
    useMemo(() => atom<CharacterWithAbilities>(fight.player2), [fight.player2])
  );
  const [_turn, setTurn] = useAtom(
    useMemo(() => atom(fight.turn), [fight.turn])
  );
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
    updatedPlayer1Data: CharacterWithAbilities,
    updatedPlayer2Data: CharacterWithAbilities,
    updatedTurn: Tables<"fights">["turn"],
    updatedGameOver: Tables<"fights">["game_over"],
    updatedCurrentTurnPlayerId: Tables<"fights">["current_turn_player_id"],
    winnerId: Tables<"characters">["id"]
  ) {
    setPlayer1((previousPlayer1) => ({
      ...previousPlayer1,
      attack: updatedPlayer1Data.attack,
      defense: updatedPlayer1Data.defense,
      current_health: updatedPlayer1Data.current_health,
      alive: updatedPlayer1Data.alive,
    }));

    setPlayer2((previousPlayer2) => ({
      ...previousPlayer2,
      attack: updatedPlayer2Data.attack,
      defense: updatedPlayer2Data.defense,
      current_health: updatedPlayer2Data.current_health,
      alive: updatedPlayer2Data.alive,
    }));

    setTimeout(() => {
      setTurn(updatedTurn);
      setCurrentTurnPlayerId(updatedCurrentTurnPlayerId);
      setGameOver(updatedGameOver);

      if (updatedGameOver) {
        setGameOverTitle(winnerId === player1.id ? "P1 Wins" : "P2 Wins");
      }
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
              winnerId,
              fight: { turn, game_over, current_turn_player_id },
            },
          } = payload.new as RealtimeMetadata;

          updateStates(
            player1,
            player2,
            turn,
            game_over,
            current_turn_player_id,
            winnerId
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
              winnerId,
              fight: { turn, game_over, current_turn_player_id },
            },
          } = payload.new as RealtimeMetadata;

          updateStates(
            player1,
            player2,
            turn,
            game_over,
            current_turn_player_id,
            winnerId
          );
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
