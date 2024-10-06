import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CharacterWithAbilities } from "../../../types/custom";
import Button from "../../Button";
import ClearButton from "../../ClearButton";
import { supabase } from "../../../utils";
import { Tables } from "../../../types/supabase";

type PlayerProps = {
  player: CharacterWithAbilities;
  attacking?: boolean;
  reverse?: boolean;
  healthPercentage: number;
  isCurrentPlayer: boolean;
  opponentId: string;
  fightId: Tables<"fights">["id"];
  hidden?: boolean;
  disabled: boolean;
};

function Player({
  player,
  reverse,
  healthPercentage,
  isCurrentPlayer,
  opponentId,
  fightId,
  hidden,
  disabled,
}: PlayerProps) {
  const {
    avatar_url,
    max_health,
    current_health,
    attack,
    defense,
    alive,
    name,
    ability1,
    ability2,
    ability3,
  } = player;

  const useAbility = async (abilitySlot: number) => {
    const { error } = await supabase.functions.invoke("useAbility", {
      body: {
        abilityNumber: abilitySlot,
        initiatorId: player.id,
        receiverId: opponentId,
        fightId: fightId,
      },
    });

    if (error) {
      console.error(error);
    }
  };

  return (
    <section className={`${hidden && "hidden"}`}>
      <div
        className={`bg-purple-500 min-w-full p-4 rounded-lg border-slate-200 text-black shadow-md shadow-black`}
      >
        <div className="w-full">
          <ul className="flex justify-between items-start pb-2">
            <li>
              <FontAwesomeIcon icon="notes-medical" /> {current_health}/
              {max_health}
            </li>
            <li>
              <FontAwesomeIcon icon="gun" /> {attack}
            </li>
            <li>
              <FontAwesomeIcon icon="shield" /> {defense}
            </li>
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
      </div>
      <ClearButton
        disabled={disabled}
        className="mt-4 py-4 w-full"
        handleClick={(_e) => useAbility(1)}
      >
        {ability1.name}
      </ClearButton>
      <ClearButton
        disabled={disabled}
        className="mt-4 py-4 w-full"
        handleClick={(_e) => useAbility(2)}
      >
        {ability2.name}
      </ClearButton>
      <Button
        disabled={disabled}
        className="my-4 py-4 w-full"
        handleClick={(_e) => useAbility(3)}
      >
        {ability3.name}
      </Button>
    </section>
  );
}

export default Player;
