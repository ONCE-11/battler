import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import Layout from "./Layout.tsx";
import LoginForm from "./components/Login.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Home from "./components/Home/index.tsx";
import Game from "./components/Game/index.tsx";
import { supabase } from "./utils.ts";
import { CharacterWithAbilities, GameLoaderObject } from "./types/custom.ts";

async function layoutLoader() {
  const {
    data: { session },
    error: fetchSessionError,
  } = await supabase.auth.getSession();

  if (session) {
    const { data: character, error: fetchCharacterError } = await supabase
      .from("characters")
      .select(
        "*, ability1:ability_1_id (*), ability2:ability_2_id (*), ability3:ability_3_id (*)"
      )
      .eq("user_id", session.user.id)
      .eq("alive", true)
      .returns<CharacterWithAbilities[]>()
      .single();

    return {
      session,
      character,
      error: fetchCharacterError,
    } as GameLoaderObject;
  } else {
    return {
      session: null,
      character: null,
      error: fetchSessionError,
    } as GameLoaderObject;
  }
}

// async function fetchCharacter(userId: User["id"]): Promise<void> {
//   const { data: characterWithAbilities, error: fetchCharacterError } =
//     await supabase
//       .from("characters")
//       .select(
//         "*, ability1:ability_1_id (*), ability2:ability_2_id (*), ability3:ability_3_id (*)"
//       )
//       .eq("user_id", userId)
//       .eq("alive", true)
//       .returns<CharacterWithAbilities[]>()
//       .single();
// }

export default createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: layoutLoader,
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
