import { FC, MouseEvent, PropsWithChildren } from "react";

type ClearButtonProps = PropsWithChildren<{
  text?: string;
  handleClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  additionalCssClasses?: string[];
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}>;

const ClearButton: FC<ClearButtonProps> = function ({
  text,
  handleClick,
  additionalCssClasses,
  type,
  disabled,
  children,
  className,
}) {
  //  hover:bg-purple-600 hover:text-zinc-50
  return (
    <button
      className={`bg-zinc-900 border border-purple-500 shadow-md shadow-black py-4 px-8 text-lg text-purple-500 font-bold rounded active:shadow-inner active:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:border-none disabled:text-zinc-300 ${additionalCssClasses?.join(
        ""
      )} ${className}`}
      onClick={handleClick}
      type={type === undefined || type === "button" ? "button" : "submit"}
      disabled={disabled ?? false}
    >
      {children ?? text}
    </button>
  );
};

export default ClearButton;
