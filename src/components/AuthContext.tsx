import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./utilities";
import { User } from "@supabase/supabase-js";
import { PropsWithChildren } from "react";

export interface AuthContextData {
  loggedIn: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchSession = async () => {
    const {
      data: { session: supabaseSession },
      error,
    } = await supabase.auth.getSession();

    // console.log(supabaseSession?.user);

    if (error) {
      console.error(error);
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
      console.error(error);
    } else {
      fetchSession();
      console.log("logged in");
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    } else {
      console.log("logged out");
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

export const useAuthContext = () => useContext(AuthContext);
