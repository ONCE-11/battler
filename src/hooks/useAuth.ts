import { supabase } from "../utils";
import { useSetAtom } from "jotai";
import { messageAtom, loggedInAtom, currentUserAtom } from "../atoms";
import { useAudio } from "./useAudio";

const useAuth = () => {
  const setLoggedIn = useSetAtom(loggedInAtom);
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setMessage = useSetAtom(messageAtom);
  const { pauseAudio, playAudio } = useAudio();

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
      setMessage({
        type: "error",
        text: `${error?.status} - ${error.message}`,
      });
      console.error(error.message);
    } else {
      setMessage({ type: "info", text: "You have logged in successfully" });
      setLoggedIn(true);
      setCurrentUser(data.user);
      playAudio();

      if (callback) callback();
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
      setCurrentUser(undefined);
      pauseAudio();
    }
  };

  const fetchSession = async (callback?: () => void) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) console.error(error);

    if (session) {
      // console.log({ user: session.user });
      setCurrentUser(session.user);
      setLoggedIn(true);

      if (callback) callback();
    } else {
      setLoggedIn(false);
    }
  };

  return { logout, login, fetchSession };
};

export default useAuth;
