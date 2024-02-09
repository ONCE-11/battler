import { CharacterData } from "./types";

interface CharacterProps {
  character: CharacterData;
  playerOne?: boolean;
}

const Character = ({ character, playerOne }: CharacterProps) => {
  const { name, hp, attack, defense, image, abilities } = character;

  return (
    <div className="p-4 rounded shadow-lg bg-slate-200 w-80">
      <p className="flex justify-between">
        <span className="text-purple-700 text-2xl">{hp}</span>
        <span className="text-blue-700 text-2xl">{attack} </span>
        <span className="text-red-700 text-2xl">{defense}</span>
      </p>
      <div className="overflow-clip h-64 rounded-lg mt-4">
        <img className={`${playerOne ? "-scale-x-100" : ""}`} src={image} />
      </div>
      <section className="flex justify-between border-solid pt-4">
        <h2 className="text-green-700 capitalize text-2xl">{name}</h2>

        <ul className="text-right text-lg">
          {abilities.map(({ name }, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Character;
