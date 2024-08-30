import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Ability,
  AbilitySlot,
  AbilityButtonHandleClick,
} from "../types/custom";
import { Tables } from "../types/supabase";
import { useState } from "react";

type AbilityButtonProps = {
  disabled: boolean;
  ability?: Ability;
  initiator: Tables<"characters">;
  receiver: Tables<"characters">;
  abilitySlot: AbilitySlot;
  handleClick: AbilityButtonHandleClick;
};
const AbilityButton = ({
  disabled,
  ability,
  abilitySlot,
  handleClick,
  initiator,
  receiver,
}: AbilityButtonProps) => {
  // TODO: use jotai for this somehow 🤔
  const [hover, setHover] = useState<boolean>(false);

  return (
    ability && (
      <button
        className={`first:ml-0 inline-block ml-10 py-2 px-4 text-zinc-50 rounded active:shadow-inner active:bg-purple-600 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-black disabled:border-zinc-900 hover:bg-purple-500 hover:text-black shadow-md shadow-black border border-purple-500`}
        disabled={disabled}
        onClick={(e) =>
          handleClick(e, ability, abilitySlot, initiator, receiver)
        }
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <FontAwesomeIcon
          icon="hand-fist"
          className={`text-purple-500 ${hover ? " text-black" : ""}${
            disabled ? " text-black" : ""
          }`}
        />{" "}
        {ability.name}
      </button>
    )
  );
};

export default AbilityButton;
