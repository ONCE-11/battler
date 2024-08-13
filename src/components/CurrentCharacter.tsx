import { supabase } from "../utilities";
import Button from "./Button";
import Title from "./Title";
import useAuth from "./hooks/useAuth";
import { useAtom, atom } from "jotai";
import { Tables } from "../types/supabase";
import { useEffect } from "react";

interface CreatedCharacter {
  id: Tables<"characters">["id"];
  attack: Tables<"characters">["attack"];
  defense: Tables<"characters">["defense"];
  maxHealth: Tables<"characters">["max_health"];
  currentHealth: Tables<"characters">["current_health"];
  avatarUrl: Tables<"characters">["avatar_url"];
  createdAt: Tables<"characters">["created_at"];
  ability1: Tables<"abilities">; // TODO: correct these types at some point
  ability2: Tables<"abilities">;
  ability3: Tables<"abilities">;
}

type CreatedCharacterOrNull = CreatedCharacter | null;

const currentCharacterAtom = atom<CreatedCharacterOrNull>(null);

const New = () => {
  const { currentUser } = useAuth();
  const [currentCharacter, setCurrentCharacter] = useAtom(currentCharacterAtom);

  const handleClick = async () => {
    const { data: character } = await supabase.functions.invoke(
      "createCharacter",
      {
        body: { userId: currentUser!.id },
      }
    );

    console.log(character);

    setCurrentCharacter(character);
  };

  useEffect(() => {
    const fetchCurrentCharacter = async () => {
      const { data: character, error }: { data: CreatedCharacterOrNull } =
        await supabase
          .from("characters")
          .select(
            "id, attack, defense, maxHealth:max_health, currentHealth:current_health, avatarUrl:avatar_url, createdAt:created_at, ability1:ability_1_id (*), ability2:ability_2_id (*), ability3:ability_3_id (*)"
          )
          .eq("user_id", currentUser!.id)
          .eq("alive", true)
          .single();

      console.log(character);

      setCurrentCharacter({
        id: character!.id,
        attack: character!.attack,
        defense: character!.defense,
        maxHealth: character!.maxHealth,
        currentHealth: character!.currentHealth,
        avatarUrl: character!.avatarUrl,
        createdAt: character!.createdAt,
        ability1: character!.ability1,
        ability2: character!.ability2,
        ability3: character!.ability3,
      });
    };

    // Try changing 'abilities' to one of the following: 'abilities!characters_ability_1_id_fkey', 'abilities!characters_ability_2_id_fkey', 'abilities!characters_ability_3_id_fkey'. Find the desired relationship in the 'details' key.

    fetchCurrentCharacter();
  }, []);

  return (
    <>
      <Title text="Current Character" />

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
            handleClick={handleClick}
          />
        </>
      )}
    </>
  );
};

export default New;
