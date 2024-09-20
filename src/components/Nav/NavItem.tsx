import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent, FC, PropsWithChildren } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type NavItemProps = PropsWithChildren<{
  sharedCssClasses: string;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  icon: IconProp;
  underlined: boolean;
  testId?: string;
}>;

const NavItem: FC<NavItemProps> = ({
  sharedCssClasses,
  handleClick,
  icon,
  children,
  underlined,
  testId,
}: NavItemProps) => {
  function underlineClassName() {
    return underlined ? " underline" : "";
  }

  return (
    <button
      className={`ml-4  ${sharedCssClasses}`}
      onClick={handleClick}
      data-testid={testId}
    >
      <FontAwesomeIcon icon={icon} className="text-base align-middle" />
      <span className="hidden md:inline-block">&nbsp;</span>
      <span
        className={`hidden md:inline-block hover:underline${underlineClassName()}`}
      >
        {children}
      </span>
    </button>
  );
};

export default NavItem;
