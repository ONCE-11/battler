import { FC, MouseEvent, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{
  text?: string;
  handleClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  additionalCssClasses?: string[];
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}>;

const Button: FC<ButtonProps> = function ({
  text,
  handleClick,
  additionalCssClasses,
  type,
  disabled,
  children,
  className,
}) {
  return (
    <button
      className={`bg-purple-500 shadow-md shadow-black py-2 px-4 text-zinc-900 font-bold rounded active:shadow-inner active:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-400 hover:bg-purple-600 hover:text-zinc-50 ${additionalCssClasses?.join(
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

export default Button;
