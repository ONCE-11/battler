interface ButtonProps {
  text: string;
  handleClick?: (e: any, extraParam?: any) => void;
  additionalCssClasses?: string[];
  type?: "button" | "submit";
}

const Button = ({
  text,
  handleClick,
  additionalCssClasses,
  type,
}: ButtonProps) => {
  return (
    <button
      className={`bg-slate-500 py-2 px-4 text-white rounded active:shadow-inner active:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400 hover:bg-slate-600 ${additionalCssClasses?.join(
        ""
      )}`}
      onClick={handleClick}
      type={type === undefined || type === "button" ? "button" : "submit"}
    >
      {text}
    </button>
  );
};

export default Button;
