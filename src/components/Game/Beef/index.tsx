import Title from "../../Title";
import { CharacterWithAbilities } from "../../../types/custom";
import PotentialOpponents from "./PotentialOpponents";
import PastBeef from "./PastBeef";

type BeefProps = {
  character: CharacterWithAbilities;
};

export default function Beef({ character }: BeefProps) {
  return (
    <>
      <Title>Beef</Title>
      <PotentialOpponents character={character} />
      <PastBeef character={character} />
    </>
  );
}
