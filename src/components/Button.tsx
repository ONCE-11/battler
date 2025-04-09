import { FC, MouseEvent, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = PropsWithChildren<{
  text?: string;
  handleClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}>;

const Button: FC<ButtonProps> = function ({
  text,
  handleClick,
  type,
  disabled,
  children,
  className,
}) {
  // hover:bg-purple-600 hover:text-zinc-50
  return (
    // className={`bg-purple-500 shadow-md shadow-black py-2 px-4 text-lg text-zinc-900 font-bold rounded active:shadow-inner active:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-zinc-300${
    //   className ? ` ${className}` : ""
    // }`}
    <button
      className={twMerge(
        "bg-purple-500 shadow-md shadow-black py-2 px-4 text-lg text-zinc-900 font-bold rounded active:shadow-inner active:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-zinc-300",
        className
      )}
      onClick={handleClick}
      type={type === undefined || type === "button" ? "button" : "submit"}
      disabled={disabled ?? false}
    >
      {children ?? text}
    </button>
  );
};

export default Button;
