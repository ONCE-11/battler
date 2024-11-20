import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Button from "../../Button";
import Title from "../../Title";
import { audioAtom, characterAtom, sceneAtom } from "../../../atoms";
import { CharacterWithAbilities, Scene } from "../../../types/custom";
import { FightWithPlayers } from "../types";
import { fightAtom } from "../atoms";
import { BattleStatus } from "./types";

type BattleTitleProps = {
  characterId: CharacterWithAbilities["id"];
  winnerId: FightWithPlayers["winner_id"];
  battleStatus: BattleStatus;
};

export default function BattleTitle({
  characterId,
  winnerId,
  battleStatus,
}: BattleTitleProps) {
  const setScene = useSetAtom(sceneAtom);
  const setFight = useSetAtom(fightAtom);
  const [character, setCharacter] = useAtom(characterAtom);
  const audio = useAtomValue(audioAtom);

  function handleWinClick() {
    setFight(null);
    setCharacter({ ...character, fighting: false } as CharacterWithAbilities);
    setScene(Scene.Beef);
    audio.pause();
  }

  function handleLossClick() {
    setFight(null);
    setCharacter(null);
    setScene(Scene.NewCharacter);
    audio.pause();
  }

  switch (battleStatus) {
    case BattleStatus.Player1Attacking:
      return <Title>P1 Attacks</Title>;
    case BattleStatus.Player2Attacking:
      return <Title>P2 Attacks</Title>;
    case BattleStatus.Player1Defending:
      return <Title>P1 Defends</Title>;
    case BattleStatus.Player2Defending:
      return <Title>P2 Defends</Title>;
    case BattleStatus.Player1Wins:
    case BattleStatus.Player2Wins:
      return (
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
      );
    case BattleStatus.Player1Turn:
      return <Title>P1 Turn</Title>;
    case BattleStatus.Player2Turn:
      return <Title>P2 Turn</Title>;
    default:
      return <Title>&nbsp;</Title>;
  }
}
