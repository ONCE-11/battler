import Button from "./Button";
import Title from "./Title";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { messageAtom, loggedInAtom } from "../atoms";
import ClearButton from "./ClearButton";

const emailAtom = atom("");
const passwordAtom = atom("");

export default function LoginForm() {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const setMessage = useSetAtom(messageAtom);
  const { login } = useAuth();
  const loggedIn = useAtomValue(loggedInAtom);
  const { state } = useLocation();
  const navigate = useNavigate();

  async function handleLogin() {
    // choose where to go after login with callback
    if (state?.redirectPath) {
      login(email, password, () => navigate(state.redirectPath));
    } else {
      login(email, password, () => navigate("/"));
    }
  }

  async function handleCancel() {
    navigate("/");
  }

  if (loggedIn) {
    setMessage({
      type: "error",
      text: "You are already logged in",
    });

    // user is already authenticated
    navigate("/");
  }

  return (
    <>
      <Title text="Login" className="text-5xl pb-10" />
      <form className="mt-6">
        <input
          type="text"
          name="email"
          placeholder="Email"
          className="block text-lg px-4 py-4 text-zinc-950 w-full rounded-sm bg-white"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="block text-lg mt-8 px-4 py-4 text-zinc-950 w-full rounded-sm bg-white"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <div className="flex justify-between">
          <ClearButton
            text="Cancel"
            className="mt-8 mr-4 w-full py-4"
            handleClick={handleCancel}
          />
          <Button
            text="Login"
            className="mt-8 w-full py-4"
            handleClick={handleLogin}
          />
        </div>
      </form>
    </>
  );
}
