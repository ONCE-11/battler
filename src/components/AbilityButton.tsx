import { Ability } from "../types/custom";

interface AbilityButtonProps {
  disabled: boolean;
  ability: Ability;
  handleClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    ability: Ability
  ) => void;
}

const AbilityButton = ({
  disabled,
  ability,
  handleClick,
}: AbilityButtonProps) => {
  return (
    <button
      className={`first:ml-0 ml-10 bg-slate-500 py-2 px-4 text-white rounded active:shadow-inner active:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400 hover:bg-slate-600`}
      disabled={disabled}
      onClick={(e) => handleClick(e, ability)}
    >
      {ability.name}
    </button>
  );
};

export default AbilityButton;
