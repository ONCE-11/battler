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
        type === "info" ? "text-white bg-slate-800" : "text-red-700 bg-red-300"
      }`}
    >
      <span>{text}</span>
      <button className="absolute right-4" onClick={handleClick}>
        <span className="font-bold hover:text-slate-800">x</span>
      </button>
    </h2>
  );
};

export default GlobalMessage;
