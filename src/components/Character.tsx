import { CharacterData } from "../types/custom";

interface CharacterProps {
  character: CharacterData;
  attacking?: boolean;
  playerOne?: boolean;
  defeated?: boolean;
}

const Character = ({
  character,
  playerOne,
  attacking,
  defeated,
}: CharacterProps) => {
  const { name, avatarUrl, healthPercentage, ability1, ability2, ability3 } =
    character;

  return (
    <div
      className={`bg-white p-4 rounded-lg border-4 border-black w-80 ${
        attacking ? "animate-bounce" : ""
        // ${playerOne ? "skew-x-3 ml-4" : "-skew-x-3 mr-4"}
      }`}
    >
      <div className="">
        <div className="w-full">
          <div
            className="w-full bg-black rounded h-2"
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>
        {/* <span className="text-purple-700 text-2xl">{hp}</span> */}
        {/* <progress
          value="100"
          max="100"
          className="w-full"
          style={{ background: "black", color: "black", accentColor: "black" }}
        ></progress> */}
        {/* <span className="text-blue-700 text-2xl">{attack} </span>
        <span className="text-red-700 text-2xl">{defense}</span> */}
      </div>
      <div className="overflow-clip h-64 rounded-lg mt-4">
        <img
          className={`${playerOne && "-scale-x-100"} ${
            defeated ? "sepia" : "grayscale"
          }`}
          src={avatarUrl}
        />
      </div>
      <section className="flex justify-between border-solid pt-4">
        <h2 className="text-green-700 capitalize text-2xl">{name}</h2>

        <ul className="text-right text-lg">
          <li>{ability1.name}</li>
          <li>{ability2.name}</li>
          <li>{ability3.name}</li>
        </ul>
      </section>
    </div>
  );
};

export default Character;
