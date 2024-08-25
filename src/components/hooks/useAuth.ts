import { supabase } from "../../utils";
import { useSetAtom } from "jotai";
import {
  loadingAtom,
  messageAtom,
  loggedInAtom,
  currentUserAtom,
} from "../../state";

const useAuth = () => {
  const setLoggedIn = useSetAtom(loggedInAtom);
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setMessage = useSetAtom(messageAtom);
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
      setLoggedIn(true);
      setCurrentUser(data.user);

      if (callback) {
        callback();
      }
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage({ type: "error", text: error.message });
      console.error(error.message);
    } else {
      setMessage({ type: "info", text: "You have logged out successfully" });
      setLoggedIn(false);
    }
  };

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
    }

    setLoading(false);
  };

  return { logout, login, fetchSession };
};

export default useAuth;
