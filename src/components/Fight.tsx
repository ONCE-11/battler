import Character from "./Character";
import Title from "./Title";
import { Ability, CharacterData } from "../types/custom";
import { useAtom, atom } from "jotai";
import { supabase } from "../utilities";
import { currentCharacterAtom } from "../state";
import { useEffect } from "react";
import { atomEffect } from "jotai-effect";
import useCharacter from "./hooks/useCharacter";
import AbilityButton from "./AbilityButton";

const opponentAtom = atom<CharacterData>({
  name: "Bison",
  attack: 5,
  defense: 22,
  ability1: { name: "throw poop", type: "damage" },
  ability2: { name: "eat", type: "heal" },
  ability3: { name: "shower", type: "heal" },
  avatarUrl: "https://fightersgeneration.com/characters/bison-rev.jpg",
  maxHealth: 150,
  currentHealth: 150,
  healthPercentage: 100,
});

const playerAtom = atom<CharacterData>({
  name: "Guile",
  attack: 50,
  defense: 56,
  ability1: { name: "throw poop", type: "damage" },
  ability2: { name: "eat", type: "heal" },
  ability3: { name: "shower", type: "heal" },
  avatarUrl:
    "https://www.fightersgeneration.com/np2/char2/char/guile-sfa3-side.jpg",
  maxHealth: 150,
  currentHealth: 150,
  healthPercentage: 100,
});

const fightLogAtom = atom<string[]>([]);
const gameOverAtom = atom(false);
const attackingAtom = atom(false);
const opponentDefeatedAtom = atom(false);

const currentCharacterEffect = atomEffect((get) => {
  const currentCharacter = get(currentCharacterAtom);

  console.log("The current character is: ", currentCharacter);

  supabase
    .channel("attacks")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "characters",
        filter: `id=eq.${currentCharacter?.id}`,
      },
      (payload) => console.log(payload)
    )
    .subscribe();
});

const Fight = () => {
  const [opponent, setOpponent] = useAtom(opponentAtom);
  const [player, setPlayer] = useAtom(playerAtom);
  const [fightLog, setFightLog] = useAtom(fightLogAtom);
  const [gameOver, setGameOver] = useAtom(gameOverAtom);
  const [attacking, setAttacking] = useAtom(attackingAtom);
  const [opponentDefeated, setOpponentDefeated] = useAtom(opponentDefeatedAtom);
  const { fetchCurrentCharacter } = useCharacter();

  useEffect(() => {
    fetchCurrentCharacter();
  }, []);

  useAtom(currentCharacterEffect);

  const handleClick = (
    _: React.MouseEvent<HTMLButtonElement>,
    ability: Ability
  ) => {
    setAttacking(true);
    let action = "";

    if (ability.type === "heal") {
      action = `${player.name} has just used ${ability.name} and healed themselves for ${player.attack} health`;

      setPlayer({ ...player, currentHealth: player.currentHealth + 10 });
    } else {
      let newHealth = opponent.currentHealth - player.attack;
      let healthPercentage;

      if (newHealth <= 0) {
        newHealth = 0;
        healthPercentage = 0;
        setOpponentDefeated(true);
        setGameOver(true);
        action = "The game is now over";
      } else {
        healthPercentage = (newHealth / opponent.maxHealth) * 100;
        console.log({ healthPercentage });
        action = `${player.name} has just used ${ability.name} and damaged ${opponent.name} for ${player.attack} health`;
      }

      setOpponent({
        ...opponent,
        currentHealth: newHealth,
        healthPercentage,
      });
    }

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
          <Character
            character={player}
            attacking={attacking}
            playerOne={true}
          />
        </section>
        <section className="self-center font-bold text-8xl">VS</section>
        <section>
          <Character character={opponent} defeated={opponentDefeated} />
        </section>
      </div>
      <div className="mt-10">
        <h2 className="text-xl">Choose an ability</h2>
        <section className="mt-6">
          <AbilityButton
            disabled={gameOver}
            ability={player.ability1}
            handleClick={handleClick}
          />
          <AbilityButton
            disabled={gameOver}
            ability={player.ability2}
            handleClick={handleClick}
          />
          <AbilityButton
            disabled={gameOver}
            ability={player.ability3}
            handleClick={handleClick}
          />
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
