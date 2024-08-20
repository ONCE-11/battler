import { useAtom } from "jotai";
import { messageAtom } from "../state";

const GlobalMessage = () => {
  const [{ type, text }, setMessage] = useAtom(messageAtom);

  const handleClick = () => {
    setMessage({});
  };

  return (
    <h2
      className={`text-xl p-4  rounded relative ${
        type === "info"
          ? "text-green-700 bg-green-300"
          : "text-red-700 bg-red-300"
      }`}
    >
      <span>{text}</span>
      <button className="absolute right-4" onClick={handleClick}>
        x
      </button>
    </h2>
  );
};

export default GlobalMessage;
