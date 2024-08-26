import { Tables } from "../types/supabase";

interface CharacterProps {
  character: Tables<"characters">;
  attacking?: boolean;
  reverse?: boolean;
  defeated?: boolean;
  name: string;
  healthPercentage: number;
  isCurrentPlayer: boolean;
  ability1?: Tables<"abilities">;
  ability2?: Tables<"abilities">;
  ability3?: Tables<"abilities">;
}

const Character = ({
  character,
  reverse,
  attacking,
  defeated,
  name,
  healthPercentage,
  ability1,
  ability2,
  ability3,
  isCurrentPlayer,
}: CharacterProps) => {
  const { avatar_url, max_health, current_health, attack, defense } = character;

  return (
    <>
      {isCurrentPlayer && <h1>Current Player</h1>}
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
            <ul>
              <li>max health = {max_health}</li>
              <li>current_health = {current_health}</li>
              <li>attack = {attack}</li>
              <li>defense = {defense}</li>
            </ul>
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
        <div className="overflow-clip rounded-lg mt-4">
          <img
            className={`${reverse ? "-scale-x-100 " : ""}${
              defeated ? "sepia" : "grayscale"
            } w-full`}
            src={avatar_url}
          />
        </div>
        <section className="flex justify-between border-solid pt-4">
          <h2 className="text-green-700 capitalize text-2xl">{name}</h2>

          <ul className="text-right text-lg">
            <li>{ability1?.name}</li>
            <li>{ability2?.name}</li>
            <li>{ability3?.name}</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default Character;
