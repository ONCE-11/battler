import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { PropsWithChildren } from "react";
import { useMessage } from "./context/MessageContext";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { loggedIn } = useAuth()!;
  const { setMessage } = useMessage()!;

  if (!loggedIn) {
    setMessage({
      type: "error",
      text: "You must be logged in to access this page",
    });

    // user is not authenticated
    return <Navigate to="/login" />;
  }

  return children;
};
