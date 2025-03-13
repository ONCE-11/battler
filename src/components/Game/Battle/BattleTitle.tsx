import { useSetAtom } from "jotai";
import Button from "../../Button";
import Title from "../../Title";
import { characterAtom, sceneAtom } from "../../../atoms";
import { CharacterWithAbilities, Music, Scene } from "../../../types/custom";
import { fightAtom } from "../atoms";
import { BattleStatus } from "./types";
import { useAudio } from "../../../hooks/useAudio";

type BattleTitleProps = {
  characterId: CharacterWithAbilities["id"];
  battleStatus: BattleStatus;
  winner: CharacterWithAbilities | null;
};

export default function BattleTitle({
  characterId,
  battleStatus,
  winner,
}: BattleTitleProps) {
  const setScene = useSetAtom(sceneAtom);
  const setFight = useSetAtom(fightAtom);
  const setCharacter = useSetAtom(characterAtom);
  const { switchAudioSrc } = useAudio();

  function handleWinClick() {
    setFight(null);
    setCharacter({ ...winner, fighting: false } as CharacterWithAbilities);
    setScene(Scene.Beef);
    switchAudioSrc(Music.Default);
  }

  function handleLossClick() {
    setFight(null);
    setCharacter(null);
    setScene(Scene.NewCharacter);
    switchAudioSrc(Music.Default);
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
    case BattleStatus.Player1Missed:
      return <Title>P1 Missed</Title>;
    case BattleStatus.Player2Missed:
      return <Title>P2 Missed</Title>;
    case BattleStatus.Player1Wins:
    case BattleStatus.Player2Wins:
      return (
        <Title className="flex justify-between">
          {winner?.id === characterId ? (
            <>
              <span>You win!</span>
              <Button handleClick={handleWinClick} className={`text-xl`}>
                Dip
              </Button>
            </>
          ) : (
            <>
              <span>You lost!</span>
              <Button handleClick={handleLossClick} className={`text-xl`}>
                Dip
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
