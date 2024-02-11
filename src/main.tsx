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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
