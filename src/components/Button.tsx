import { ButtonHandleClick } from "../types/custom";
import { FC, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{
  text?: string;
  handleClick?: ButtonHandleClick;
  additionalCssClasses?: string[];
  type?: "button" | "submit";
  disabled?: boolean;
}>;

const Button: FC<ButtonProps> = ({
  text,
  handleClick,
  additionalCssClasses,
  type,
  disabled,
  children,
}) => {
  return (
    <button
      className={`bg-purple-500 shadow-md shadow-black py-2 px-4 text-zinc-900 font-bold rounded active:shadow-inner active:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-400 hover:bg-purple-600 hover:text-zinc-50 ${additionalCssClasses?.join(
        ""
      )}`}
      onClick={handleClick}
      type={type === undefined || type === "button" ? "button" : "submit"}
      disabled={disabled ?? false}
    >
      {children ?? text}
    </button>
  );
};

export default Button;
