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
import { LoadingProvider } from "./components/context/LoadingContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LoadingProvider>
        <ErrorProvider>
          <AuthProvider>
            <Layout />
          </AuthProvider>
        </ErrorProvider>
      </LoadingProvider>
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
    <RouterProvider router={router} />
  </React.StrictMode>
);
