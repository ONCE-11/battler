import Character from "./Character";
import { Ability, CharacterData } from "./types";
import { useState } from "react";

const Battler = () => {
  const [fightLog, setFightLog] = useState<string[]>([]);

  const playerOne: CharacterData = {
    name: "Character 1",
    hp: 20,
    attack: 5,
    defense: 22,
    abilities: [
      { name: "throw poop", type: "damage" },
      { name: "eat", type: "heal" },
      { name: "shower", type: "heal" },
    ],
    image:
      "https://www.fightersgeneration.com/np2/char2/char/guile-sfa3-side.jpg",
  };

  const playerTwo: CharacterData = {
    name: "Character 2",
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
  };

  const handleClick = (
    _: React.MouseEvent<HTMLButtonElement>,
    ability: Ability
  ) => {
    let action;

    if (ability.type === "heal") {
      action = `${playerTwo.name} has just used ${ability.name} and healed themselves for ${playerTwo.attack} hp`;
    } else {
      action = `${playerTwo.name} has just used ${ability.name} and damaged ${playerOne.name} for ${playerTwo.attack} hp`;
    }

    setFightLog([...fightLog, action]);
  };

  return (
    <>
      <h1 className="text-6xl font-bold mb-4 mt-8">Fight!</h1>
      <div className="flex justify-between">
        <section>
          <Character character={playerOne} playerOne={true} />
        </section>
        <section className="self-center font-bold text-8xl">VS</section>
        <section>
          <Character character={playerTwo} />
        </section>
      </div>
      <div className="mt-10">
        <h2 className="text-xl">Choose an ability</h2>
        <section className="mt-6">
          {playerTwo.abilities.map((ability) => (
            <button
              className="first:ml-0 ml-10 bg-slate-500 py-2 px-4 text-white rounded active:shadow-inner active:bg-slate-600"
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
