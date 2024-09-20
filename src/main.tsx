import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Fight from "./components/Fight.tsx";
import Layout from "./Layout.tsx";
import LoginForm from "./components/Login.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import Bodega from "./components/Bodega.tsx";
import Equipment from "./components/Equipment.tsx";
import Beefs from "./components/Beefs.tsx";
import { Provider } from "jotai";
import Home from "./components/Home/index.tsx";
import CharacterSheet from "./components/CharacterSheet.tsx";
import Game from "./components/Game/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/beefs/:fightId",
        element: (
          <ProtectedRoute>
            <Fight />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/bodega",
        element: (
          <ProtectedRoute>
            <Bodega />
          </ProtectedRoute>
        ),
      },
      {
        path: "/equipment",
        element: (
          <ProtectedRoute>
            <Equipment />
          </ProtectedRoute>
        ),
      },
      {
        path: "/beefs",
        element: (
          <ProtectedRoute>
            <Beefs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/character",
        element: (
          <ProtectedRoute>
            <CharacterSheet />
          </ProtectedRoute>
        ),
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
