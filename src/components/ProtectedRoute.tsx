import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { PropsWithChildren } from "react";
import { useMessage } from "./context/MessageContext";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { loggedIn } = useAuth()!;
  const { setMessage } = useMessage()!;
  const location = useLocation();

  // console.log("protected route: ", { loading, loggedIn, currentUser });

  if (!loggedIn) {
    setMessage({
      type: "error",
      text: "You must be logged in to access this page",
    });

    // user is not authenticated
    return <Navigate to="/login" state={{ redirectPath: location.pathname }} />;
  }

  return children;
};
