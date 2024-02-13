import { useState } from "react";
import Button from "./Button";
import Title from "./Title";
import { useAuth } from "./context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth()!;
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log({ state });

  const handleClick = async () => {
    // choose where to go after login with callback
    if (state?.redirectPath) {
      login(email, password, () => navigate(state.redirectPath));
    } else {
      login(email, password, () => navigate("/"));
    }
  };

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
