import Button from "./Button";
import Title from "./Title";
import { atom, useAtomValue, useAtom } from "jotai";
import { useEffect } from "react";
import { currentUserAtom } from "../atoms";
import useCharacter from "../hooks/useCharacter";
import { CharacterWithAbilities } from "../types/custom";
import { supabase } from "../utils";
import { MouseEvent } from "react";

// const characterAtom = atom<Tables<"characters">>();
const characterAtom = atom<CharacterWithAbilities>();

const New = () => {
  // const [character, setCharacter] = useAtom(characterAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const [character, setCharacter] = useAtom(characterAtom);
  const { fetchCharacterWithAbilities } = useCharacter();

  const handleClick = async (_event: MouseEvent<HTMLButtonElement>) => {
    const { data: character, error } = await supabase.functions.invoke(
      "createCharacter",
      {
        body: { userId: currentUser!.id },
      }
    );

    if (error) console.error(error);

    // console.log(character);

    setCharacter(character);
  };

  useEffect(() => {
    const fetchData = async () => {
      const character = await fetchCharacterWithAbilities(currentUser!.id);

      setCharacter(character);
    };
    fetchData();
  }, []);

  return (
    <>
      <Title>
        <h1>
          {character ? (
            <>
              <img
                className="h-20 grayscale rounded-lg inline-block"
                src={character?.avatar_url}
              />
              <span className="inline-block ml-2">{character?.name}</span>
            </>
          ) : (
            "Character"
          )}
        </h1>
      </Title>

      {character ? (
        <div className="rounded b">
          <ul>
            <h2 className="text-2xl">Attributes</h2>
            <li>Attack: {character.attack}</li>
            <li>Defense: {character.defense}</li>
            <li>Max Health: {character.max_health}</li>
            <li>Current Health: {character.current_health}</li>
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
            handleClick={handleClick}
          />
        </>
      )}
    </>
  );
};

export default New;
