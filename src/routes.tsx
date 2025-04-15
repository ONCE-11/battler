import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import Layout from "./Layout.tsx";
import LoginForm from "./components/Login.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Home from "./components/Home/index.tsx";
import Game from "./components/Game/index.tsx";
import { getCharacter, supabase } from "./utils.ts";
import { CharacterWithAbilities, RootLoaderResponse } from "./types/custom.ts";

async function rootLoader() {
  const {
    data: { session },
    error: fetchSessionError,
  } = await supabase.auth.getSession();

  if (session) {
    const character = await getCharacter(session.user.id);

    return {
      session,
      character,
      error: null,
    } as RootLoaderResponse;
  } else {
    return {
      session: null,
      character: null,
      error: fetchSessionError,
    } as RootLoaderResponse;
  }
}

export default createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: rootLoader,
    id: "root",
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/game",
        element: (
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
