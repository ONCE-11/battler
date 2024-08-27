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
import Fights from "./components/Fights.tsx";
import { Provider } from "jotai";
import Home from "./components/Home.tsx";
import CurrentCharacter from "./components/CurrentCharacter.tsx";

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
            <Fights />
          </ProtectedRoute>
        ),
      },
      {
        path: "/current-character",
        element: (
          <ProtectedRoute>
            <CurrentCharacter />
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
