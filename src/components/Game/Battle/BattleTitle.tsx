import { useAtom, useSetAtom } from "jotai";
import Button from "../../Button";
import Title from "../../Title";
import { characterAtom, sceneAtom } from "../../../atoms";
import { CharacterWithAbilities, Scene } from "../../../types/custom";
import { FightWithPlayers } from "../types";
import { fightAtom } from "../atoms";

type BattleTitleProps = {
  gameOver: FightWithPlayers["game_over"];
  player1Id: CharacterWithAbilities["id"];
  currentTurnPlayerId: FightWithPlayers["current_turn_player_id"];
  characterId: CharacterWithAbilities["id"];
  winnerId: FightWithPlayers["winner_id"];
};

export default function BattleTitle({
  gameOver,
  player1Id,
  characterId,
  currentTurnPlayerId,
  winnerId,
}: BattleTitleProps) {
  const setScene = useSetAtom(sceneAtom);
  const setFight = useSetAtom(fightAtom);
  const [character, setCharacter] = useAtom(characterAtom);

  function handleWinClick() {
    setFight(null);
    setCharacter({ ...character, fighting: false } as CharacterWithAbilities);
    setScene(Scene.Beef);
  }

  function handleLossClick() {
    setFight(null);
    setCharacter(null);
    setScene(Scene.NewCharacter);
  }

  return gameOver ? (
    <>
      <Title className="flex justify-between">
        {winnerId === characterId ? (
          <>
            <span>You win!</span>
            <Button handleClick={handleWinClick} className={`text-xl`}>
              Take your W
            </Button>
          </>
        ) : (
          <>
            <span>You lost!</span>
            <Button handleClick={handleLossClick} className={`text-xl`}>
              Dip out
            </Button>
          </>
        )}
      </Title>
    </>
  ) : (
    <Title>
      {currentTurnPlayerId === player1Id ? "P1's Turn" : "P2's Turn"}
    </Title>
  );
}
