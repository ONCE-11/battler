import Button from "./Button";
import Title from "./Title";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { messageAtom, loggedInAtom } from "../state";

const emailAtom = atom("");
const passwordAtom = atom("");

const LoginForm = () => {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const setMessage = useSetAtom(messageAtom);
  const { login } = useAuth();
  const loggedIn = useAtomValue(loggedInAtom);
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleClick = async () => {
    // choose where to go after login with callback
    if (state?.redirectPath) {
      login(email, password, () => navigate(state.redirectPath));
    } else {
      login(email, password, () => navigate("/"));
    }
  };

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
      <Title text="Enter your credentials" />
      <form>
        <input
          type="text"
          name="email"
          placeholder="Email"
          className="block text-2xl px-4 py-2 text-zinc-950"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="block text-2xl mt-8 px-4 py-2 text-zinc-950"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Button
          text="Login"
          additionalCssClasses={["mt-8"]}
          handleClick={handleClick}
        />
      </form>
    </>
  );
};

export default LoginForm;
