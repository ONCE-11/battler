import Character from "./Character";
import Title from "./Title";
import { Ability, CharacterData } from "../types/custom";
import { useAtom, atom } from "jotai";
import { supabase } from "../utilities";
// import { currentCharacterAtom } from "../state";
// import { useAtomValue } from "jotai";
import { useEffect } from "react";
import useCharacter from "./hooks/useCharacter";

const opponentAtom = atom<CharacterData>({
  name: "Bison",
  hp: 20,
  attack: 5,
  defense: 22,
  abilities: [
    { name: "throw poop", type: "damage" },
    { name: "eat", type: "heal" },
    { name: "shower", type: "heal" },
  ],
  image: "https://fightersgeneration.com/characters/bison-rev.jpg",
});

const playerAtom = atom<CharacterData>({
  name: "Guile",
  hp: 10,
  attack: 50,
  defense: 56,
  abilities: [
    { name: "throw poop", type: "damage" },
    { name: "eat", type: "heal" },
    { name: "shower", type: "heal" },
  ],
  image:
    "https://www.fightersgeneration.com/np2/char2/char/guile-sfa3-side.jpg",
});

const fightLogAtom = atom<string[]>([]);
const gameOverAtom = atom(false);
const attackingAtom = atom(false);
const opponentDefeatedAtom = atom(false);

const Battler = () => {
  const [opponent, setOpponent] = useAtom(opponentAtom);
  const [player, setPlayer] = useAtom(playerAtom);
  const [fightLog, setFightLog] = useAtom(fightLogAtom);
  const [gameOver, setGameOver] = useAtom(gameOverAtom);
  const [attacking, setAttacking] = useAtom(attackingAtom);
  const [opponentDefeated, setOpponentDefeated] = useAtom(opponentDefeatedAtom);
  // const currentCharacter = useAtomValue(currentCharacterAtom);
  const { fetchCurrentCharacter } = useCharacter();

  useEffect(() => {
    const syncData = async () => {
      const currentCharacter = await fetchCurrentCharacter();

      await supabase
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

      console.log(currentCharacter);
    };

    syncData();
  }, []);

  const handleClick = (
    _: React.MouseEvent<HTMLButtonElement>,
    ability: Ability
  ) => {
    setAttacking(true);
    let action = "";

    if (ability.type === "heal") {
      action = `${player.name} has just used ${ability.name} and healed themselves for ${player.attack} hp`;

      setPlayer({ ...player, hp: player.hp + 10 });
    } else {
      let newHP = opponent.hp - 10;

      if (newHP <= 0) {
        newHP = 0;
        setOpponentDefeated(true);
        setGameOver(true);
        action = "The game is now over";
      } else {
        action = `${player.name} has just used ${ability.name} and damaged ${opponent.name} for ${player.attack} hp`;
      }

      setOpponent({ ...opponent, hp: newHP });
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
            character={opponent}
            playerOne={true}
            defeated={opponentDefeated}
          />
        </section>
        <section className="self-center font-bold text-8xl">VS</section>
        <section>
          <Character character={player} attacking={attacking} />
        </section>
      </div>
      <div className="mt-10">
        <h2 className="text-xl">Choose an ability</h2>
        <section className="mt-6">
          {player.abilities.map((ability, index) => (
            <button
              className={`first:ml-0 ml-10 bg-slate-500 py-2 px-4 text-white rounded active:shadow-inner active:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400 hover:bg-slate-600`}
              disabled={gameOver}
              onClick={(e) => handleClick(e, ability)}
              key={index}
            >
              {ability.name}
            </button>
          ))}
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

export default Battler;
