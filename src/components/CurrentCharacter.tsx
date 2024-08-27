import Button from "./Button";
import Title from "./Title";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { currentCharacterAtom } from "../state";
import useCharacter from "./hooks/useCharacter";

const New = () => {
  const currentCharacter = useAtomValue(currentCharacterAtom);
  const { fetchCurrentCharacter, createCharacter } = useCharacter();

  useEffect(() => {
    fetchCurrentCharacter();
  }, []);

  return (
    <>
      <Title text="Deets" />

      {currentCharacter ? (
        <div className="rounded b">
          <ul>
            <h2 className="text-2xl">Attributes</h2>
            <li>Attack: {currentCharacter.attack}</li>
            <li>Defense: {currentCharacter.defense}</li>
            <li>Max Health: {currentCharacter.maxHealth}</li>
          </ul>
          <img className="h-20" src={currentCharacter.avatarUrl} />
          <ul>
            <h2 className="text-2xl">Abilities</h2>
            <li>1: {currentCharacter.ability1.name}</li>
            <li>2: {currentCharacter.ability2.name}</li>
            <li>3: {currentCharacter.ability3.name}</li>
          </ul>
        </div>
      ) : (
        <>
          <p>Let's create a new Character</p>
          <Button
            text="Go"
            additionalCssClasses={["mt-4"]}
            handleClick={createCharacter}
          />
        </>
      )}
    </>
  );
};

export default New;
