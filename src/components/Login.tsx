import { useState } from "react";
import Button from "./Button";
import Title from "./Title";
import { useAuth } from "./context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth()!;

  const handleClick = async () => {
    login(email, password);
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
