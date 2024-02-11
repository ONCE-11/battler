import { createContext, useContext, useState } from "react";
import { PropsWithChildren } from "react";

export interface MessageData {
  type?: "info" | "error";
  text?: string;
}

interface MessageContextData {
  message: MessageData;
  setMessage: React.Dispatch<React.SetStateAction<MessageData>>;
}

export const MessageContext = createContext<MessageContextData | null>(null);

export const ErrorProvider = ({ children }: PropsWithChildren) => {
  const [message, setMessage] = useState<MessageData>({});

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
