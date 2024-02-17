import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../utilities";
import { User } from "@supabase/supabase-js";
import { PropsWithChildren } from "react";
import { useMessage } from "./MessageContext";
import { useSetAtom } from "jotai";
import { loadingAtom } from "../../main";

type LoginFunction = (
  email: string,
  password: string,
  callback: () => void
) => void;

export interface AuthContextData {
  loggedIn: boolean;
  currentUser: User | null;
  login: LoginFunction;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { setMessage } = useMessage()!;
  const setLoading = useSetAtom(loadingAtom);

  const login = async (
    email: string,
    password: string,
    callback?: () => void
  ) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      console.error(error.message);
    } else {
      setMessage({ type: "info", text: "You have logged in successfully" });
      // console.log("logged in", { data });
      setLoggedIn(true);
      setCurrentUser(data.user);
      callback && callback();
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage({ type: "error", text: error.message });
      console.error(error.message);
    } else {
      // console.log("logged out");
      setMessage({ type: "info", text: "You have logged out successfully" });
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        return;
      }

      if (!session) {
        setLoggedIn(false);
      } else {
        setCurrentUser(session.user);
        setLoggedIn(true);

        // console.log("session retrieved", {
        //   loading,
        //   loggedIn,
        //   currentUser: session.user,
        // });
      }

      setLoading(false);

      // supabase.auth.onAuthStateChange((_event, session) => {
      //   console.log("auth", session);

      //   if (session?.user) {
      //     console.log("session retrieved");
      //     setCurrentUser(session.user);
      //     setLoggedIn(true);
      //   }

      //   // if (event === "SIGNED_OUT") {
      //   // }

      //   // if (event === 'INITIAL_SESSION') {
      //   //   // handle initial session
      //   // } else if (event === 'SIGNED_IN') {
      //   //   // handle sign in event
      //   // } else if (event === 'SIGNED_OUT') {
      //   //   // handle sign out event
      //   // } else if (event === 'PASSWORD_RECOVERY') {
      //   //   // handle password recovery event
      //   // } else if (event === 'TOKEN_REFRESHED') {
      //   //   // handle token refreshed event
      //   // } else if (event === 'USER_UPDATED') {
      //   //   // handle user updated event
      //   // }
      // });
    };

    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
