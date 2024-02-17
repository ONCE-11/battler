import Button from "./Button";
import Title from "./Title";
import useAuth from "./hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { atom, useAtom, useSetAtom } from "jotai";
import { messageAtom } from "../main";

const emailAtom = atom("");
const passwordAtom = atom("");

const LoginForm = () => {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const setMessage = useSetAtom(messageAtom);
  const { login, loggedIn } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleClick = async () => {
    console.log({ state });

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
          className="block text-2xl px-4 py-2"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="block text-2xl mt-8 px-4 py-2"
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
