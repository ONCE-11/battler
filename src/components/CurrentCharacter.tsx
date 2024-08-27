import Button from "./Button";
import Title from "./Title";
import { atom, useAtomValue, useAtom } from "jotai";
import { useEffect } from "react";
import { currentUserAtom } from "../state";
import useCharacter from "./hooks/useCharacter";
import { CreatedCharacter } from "../types/custom";

// const characterAtom = atom<Tables<"characters">>();
const characterAtom = atom<CreatedCharacter>();

const New = () => {
  // const [character, setCharacter] = useAtom(characterAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const [character, setCharacter] = useAtom(characterAtom);
  const { createCharacter, fetchCharacterWithAbilities } = useCharacter();

  useEffect(() => {
    const fetchData = async () => {
      const character = await fetchCharacterWithAbilities(currentUser!.id);

      setCharacter(character);
    };
    // fetchCurrentCharacter();
    fetchData();
  }, []);

  return (
    <>
      <Title>
        <h1>
          <img
            className="h-20 grayscale rounded-lg inline-block"
            src={character?.avatarUrl}
          />
          <span className="inline-block ml-2">{character?.name}</span>
        </h1>
      </Title>

      {character ? (
        <div className="rounded b">
          <ul>
            <h2 className="text-2xl">Attributes</h2>
            <li>Attack: {character.attack}</li>
            <li>Defense: {character.defense}</li>
            <li>Max Health: {character.maxHealth}</li>
            <li>Current Health: {character.currentHealth}</li>
          </ul>
          <ol className="mt-2">
            <h2 className="text-2xl">Abilities</h2>
            <li>1: {character.ability1.name}</li>
            <li>2: {character.ability2.name}</li>
            <li>3: {character.ability3.name}</li>
          </ol>
          <ul className="mt-2">
            <h2 className="text-2xl">Gear</h2>
            <li>W: Coming Soon!</li>
            <li>D: Coming Soon!</li>
            <li>I: Coming Soon!</li>
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
