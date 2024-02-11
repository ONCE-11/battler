import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utilities";
import { User } from "@supabase/supabase-js";
import { PropsWithChildren } from "react";
import { useMessage } from "./MessageContext";
import { useNavigate } from "react-router-dom";
import { MessageData } from "./MessageContext";

export interface AuthContextData {
  loggedIn: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { setMessage } = useMessage()!;
  const navigate = useNavigate();

  const fetchSession = async () => {
    const {
      data: { session: supabaseSession },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      setMessage({ type: "error", text: error.message });
      console.error(error.message);
    }

    if (supabaseSession) {
      setLoggedIn(true);
      setCurrentUser(supabaseSession.user);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      console.error(error.message);
    } else {
      fetchSession();
      setMessage({ type: "info", text: "You have logged in successfully" });
      console.log("logged in");
      navigate("/");
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage({ type: "error", text: error.message });
      console.error(error.message);
    } else {
      console.log("logged out");
      setMessage({ type: "info", text: "You have logged out successfully" });
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
