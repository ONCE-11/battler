import { Navigate, useLocation } from "react-router-dom";
import { PropsWithChildren } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { messageAtom, loggedInAtom } from "../atoms";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const loggedIn = useAtomValue(loggedInAtom);
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
