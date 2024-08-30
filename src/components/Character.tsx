import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tables } from "../types/supabase";

interface CharacterProps {
  character: Tables<"characters">;
  attacking?: boolean;
  reverse?: boolean;
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
  healthPercentage,
  ability1,
  ability2,
  ability3,
  isCurrentPlayer,
}: CharacterProps) => {
  const {
    avatar_url,
    max_health,
    current_health,
    attack,
    defense,
    alive,
    name,
  } = character;

  return (
    <>
      <div
        className={`bg-purple-500 p-4 rounded-lg border-slate-200 w-80 text-black shadow-md shadow-black ${
          attacking ? "animate-bounce" : ""
        }`}
      >
        <div className="w-full">
          <ul className="flex justify-between items-start pb-2">
            {/* <div> */}
            <li>
              <FontAwesomeIcon icon="notes-medical" />{" "}
              {/* <span className="font-bold">H:</span>  */}
              {current_health}/{max_health}
            </li>
            <li>
              <FontAwesomeIcon icon="hand-fist" />{" "}
              {/* <span className="font-bold">Att:</span> */}
              {attack}
            </li>
            <li>
              <FontAwesomeIcon icon="shield" />{" "}
              {/* <span className="font-bold">Def:</span>  */}
              {defense}
            </li>
            {/* </div> */}
          </ul>
          <div
            className="w-full bg-black rounded h-2 shadow-md shadow-black"
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>
        <div className="overflow-clip rounded-lg mt-2 relative shadow-md shadow-black">
          {isCurrentPlayer && (
            <span
              className={`absolute text-white z-10 top-0 font-bold text-xl ${
                reverse ? "right-2" : "left-2"
              }`}
            >
              c
            </span>
          )}
          <img
            className={`${reverse ? "-scale-x-100 " : ""}${
              !alive ? "sepia" : "grayscale"
            } w-full z-0`}
            src={avatar_url}
          />
          <h2
            className={`text-white capitalize text-l absolute bottom-2 ${
              reverse ? "right-2" : "left-2"
            }`}
          >
            {name}
          </h2>
        </div>
        <section className="pt-4">
          {reverse ? (
            <ul className="text-right text-lg pl-2 w-full">
              <li>{ability1?.name} : 1</li>
              <li>{ability2?.name} : 2</li>
              <li>{ability3?.name} : 3</li>
            </ul>
          ) : (
            <ul className="text-left text-lg pl-2 w-full">
              <li>1 : {ability1?.name}</li>
              <li>2 : {ability2?.name}</li>
              <li>3 : {ability3?.name}</li>
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default Character;
