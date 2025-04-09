import { FC, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

// TODO: adjust this, this seems dirty
type TitleProps = PropsWithChildren<{ text?: string; className?: string }>;

const Title: FC<TitleProps> = function ({ text, children, className }) {
  return (
    <h1 className={twMerge("text-4xl font-bold pb-2", className)}>
      {children ?? text}
    </h1>
  );
};

export default Title;
