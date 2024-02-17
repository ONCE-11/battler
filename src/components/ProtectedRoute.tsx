import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { PropsWithChildren } from "react";
import { useSetAtom } from "jotai";
import { messageAtom } from "../main";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { loggedIn } = useAuth();
  const setMessage = useSetAtom(messageAtom);
  const location = useLocation();

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
