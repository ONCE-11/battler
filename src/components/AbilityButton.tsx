import {
  Ability,
  AbilitySlot,
  AbilityButtonHandleClick,
} from "../types/custom";
import { Tables } from "../types/supabase";

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
  return (
    ability && (
      <button
        className={`first:ml-0 ml-10 bg-slate-500 py-2 px-4 text-white rounded active:shadow-inner active:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400 hover:bg-slate-600`}
        disabled={disabled}
        onClick={(e) =>
          handleClick(e, ability, abilitySlot, initiator, receiver)
        }
      >
        {ability.name}
      </button>
    )
  );
};

export default AbilityButton;
