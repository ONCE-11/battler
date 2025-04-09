import { useAtom } from "jotai";
import { messageAtom } from "../atoms";

export default function GlobalMessage() {
  const [{ type, text }, setMessage] = useAtom(messageAtom);

  const handleClick = () => {
    setMessage({});
  };

  return (
    <h2
      className={`p-4 text-sm rounded relative shadow-black shadow-lg ${
        type === "info"
          ? "text-zinc-50 bg-purple-700"
          : "text-red-700 bg-red-300"
      }`}
    >
      <span>{text}</span>
      <button className="absolute right-4" onClick={handleClick}>
        <span className="font-bold text-zinc-950 hover:text-zinc-50">x</span>
      </button>
    </h2>
  );
}
