import { Navigate, useLocation, useRouteLoaderData } from "react-router-dom";
import { PropsWithChildren } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { messageAtom, loggedInAtom } from "../atoms";
import { RootLoaderResponse } from "../types/custom";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const loggedIn = useAtomValue(loggedInAtom);
  const setMessage = useSetAtom(messageAtom);
  const location = useLocation();
  const { session } = useRouteLoaderData("root") as RootLoaderResponse;

  console.log("user is", session);

  if (!session && !loggedIn) {
    console.log("not logged in");

    setMessage({
      type: "error",
      text: "You must be logged in to access this page",
    });

    // user is not authenticated
    return <Navigate to="/login" state={{ redirectPath: location.pathname }} />;
  }

  console.log("logged in");

  return children;
}
