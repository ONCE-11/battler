import { FC, PropsWithChildren } from "react";

// TODO: adjust this, this seems dirty
type TitleProps = PropsWithChildren<{ text?: string; className?: string }>;

const Title: FC<TitleProps> = ({ text, children, className }) => {
  return (
    <h1
      className={`text-6xl font-bold py-4${className ? ` ${className}` : ""}`}
    >
      {children ?? text}
    </h1>
  );
};

export default Title;
