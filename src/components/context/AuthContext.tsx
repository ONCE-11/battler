import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utilities";
import { User } from "@supabase/supabase-js";
import { PropsWithChildren } from "react";
import { useMessage } from "./MessageContext";
import { useNavigate } from "react-router-dom";

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

  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      console.error(error.message);
    } else {
      setMessage({ type: "info", text: "You have logged in successfully" });
      console.log("logged in", data);
      setLoggedIn(true);
      setCurrentUser(data.user);
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
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);

      if (session?.user) {
        console.log("session retreived");
        setCurrentUser(session.user);
        setLoggedIn(true);
      }

      // if (event === "SIGNED_OUT") {
      // }

      // if (event === 'INITIAL_SESSION') {
      //   // handle initial session
      // } else if (event === 'SIGNED_IN') {
      //   // handle sign in event
      // } else if (event === 'SIGNED_OUT') {
      //   // handle sign out event
      // } else if (event === 'PASSWORD_RECOVERY') {
      //   // handle password recovery event
      // } else if (event === 'TOKEN_REFRESHED') {
      //   // handle token refreshed event
      // } else if (event === 'USER_UPDATED') {
      //   // handle user updated event
      // }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
