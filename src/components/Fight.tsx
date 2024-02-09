import Character from "./Character";
import { Ability, CharacterData } from "./types";
import { useState } from "react";

const Battler = () => {
  const [opponent, setOpponent] = useState<CharacterData>({
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

  const [player, setPlayer] = useState<CharacterData>({
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

  const [fightLog, setFightLog] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const handleClick = (
    _: React.MouseEvent<HTMLButtonElement>,
    ability: Ability
  ) => {
    let action = "";

    if (ability.type === "heal") {
      action = `${player.name} has just used ${ability.name} and healed themselves for ${player.attack} hp`;

      setPlayer({ ...player, hp: player.hp + 10 });
    } else {
      let newHP = opponent.hp - 10;

      if (newHP < 0) {
        newHP = 0;
        setGameOver(true);
        action = "The game is now over";
      } else {
        action = `${player.name} has just used ${ability.name} and damaged ${opponent.name} for ${player.attack} hp`;
        setOpponent({ ...opponent, hp: newHP });
      }
    }

    setFightLog([...fightLog, action]);
  };

  return (
    <>
      <h1 className="text-6xl font-bold mb-4 mt-8">Fight!</h1>
      <div className="flex justify-between">
        <section>
          <Character character={opponent} playerOne={true} />
        </section>
        <section className="self-center font-bold text-8xl">VS</section>
        <section>
          <Character character={player} />
        </section>
      </div>
      <div className="mt-10">
        <h2 className="text-xl">Choose an ability</h2>
        <section className="mt-6">
          {player.abilities.map((ability) => (
            <button
              className={`first:ml-0 ml-10 bg-slate-500 py-2 px-4 text-white rounded active:shadow-inner active:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-400`}
              disabled={gameOver}
              onClick={(e) => handleClick(e, ability)}
            >
              {ability.name}
            </button>
          ))}
        </section>
      </div>
      <div className="mt-10 text-xl">Fight Log</div>
      <ul className="mt-6">
        {fightLog.map((action) => (
          <li>{action}</li>
        ))}
      </ul>
    </>
  );
};

export default Battler;
