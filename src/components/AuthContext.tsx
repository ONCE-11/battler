import { createContext, useContext, useState } from "react";
import { supabase } from "./utilities";
import { Session } from "@supabase/supabase-js";
import { PropsWithChildren } from "react";

export interface AuthContextData {
  loggedIn: boolean;
  session: Session | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
    } else {
      setLoggedIn(true);
      console.log(data);

      const {
        data: { session: supabaseSession },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.log(error);
      } else {
        setSession(supabaseSession);
      }
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    } else {
      setLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider value={{ loggedIn, session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
