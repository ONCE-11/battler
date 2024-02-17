import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Fight from "./components/Fight.tsx";
import CharacterInfo from "./components/CharacterInfo.tsx";
import Layout from "./Layout.tsx";
import LoginForm from "./components/Login.tsx";
import { AuthProvider } from "./components/context/AuthContext.tsx";
import { ErrorProvider } from "./components/context/MessageContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import Bodega from "./components/Bodega.tsx";
import Equipment from "./components/Equipment.tsx";
import Fights from "./components/Fights.tsx";
import { Provider, atom } from "jotai";

export interface MessageType {
  type?: "info" | "error";
  text?: string;
}

export const loadingAtom = atom(false);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorProvider>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </ErrorProvider>
    ),
    children: [
      {
        index: true,
        element: <CharacterInfo />,
      },
      {
        path: "/fight",
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
        path: "/shop",
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
        path: "/fights",
        element: (
          <ProtectedRoute>
            <Fights />
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
