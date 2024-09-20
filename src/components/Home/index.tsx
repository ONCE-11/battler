import { useAtomValue } from "jotai";
import { loggedInAtom } from "../../state";
import Game from "../Game";
import LoggedOut from "./LoggedOut";

const Home = () => {
  const loggedIn = useAtomValue(loggedInAtom);

  return <>{!loggedIn ? <LoggedOut /> : <Game />}</>;
};

export default Home;
