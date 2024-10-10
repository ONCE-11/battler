import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import Layout from "./Layout.tsx";
import LoginForm from "./components/Login.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Home from "./components/Home/index.tsx";
import Game from "./components/Game/index.tsx";

export default createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
