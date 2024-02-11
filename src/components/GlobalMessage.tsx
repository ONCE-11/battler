import { MessageData } from "./context/MessageContext";

interface ErrorProps {
  message: MessageData;
  setMessage: React.Dispatch<React.SetStateAction<MessageData>>;
}

const Error = ({ message: { text, type }, setMessage }: ErrorProps) => {
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

export default Error;
