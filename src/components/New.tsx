import { supabase } from "../utilities";
import Button from "./Button";
import Title from "./Title";
import useAuth from "./hooks/useAuth";
import { useAtom, atom } from "jotai";
import { Database } from "../types/supabase";
import { useEffect } from "react";

interface CreatedCharacter {
  id: Database["public"]["Tables"]["characters"]["Row"]["id"];
  attack: Database["public"]["Tables"]["characters"]["Row"]["attack"];
  defense: Database["public"]["Tables"]["characters"]["Row"]["defense"];
  maxHealth: Database["public"]["Tables"]["characters"]["Row"]["max_health"];
  currentHealth: Database["public"]["Tables"]["characters"]["Row"]["current_health"];
  avatarUrl: Database["public"]["Tables"]["characters"]["Row"]["avatar_url"];
  createdAt: Database["public"]["Tables"]["characters"]["Row"]["created_at"];
  ability1: Database["public"]["Tables"]["abilities"]["Row"];
  ability2: Database["public"]["Tables"]["abilities"]["Row"];
  ability3: Database["public"]["Tables"]["abilities"]["Row"];
}

const currentCharacterAtom = atom<CreatedCharacter | null>(null);

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
      await supabase
        .from("characters")
        .select(
          "id, attack, defense, max_health, current_health, avatar_url, created_at, abilities (*)"
        )
        .eq("user_id", currentUser!.id)
        .eq("alive", true)
        .or("ability_1_id.eq.abilities.id");
    };

    // Try changing 'abilities' to one of the following: 'abilities!characters_ability_1_id_fkey', 'abilities!characters_ability_2_id_fkey', 'abilities!characters_ability_3_id_fkey'. Find the desired relationship in the 'details' key.

    fetchCurrentCharacter();
  }, []);

  return (
    <>
      <Title text="New Character" />
      <p>Let's create a new Character</p>
      <Button
        text="Go"
        additionalCssClasses={["mt-4"]}
        handleClick={handleClick}
      />
      {currentCharacter ? (
        <div className="rounded b">
          <span>{currentCharacter.id}</span>
          <span>{currentCharacter.attack}</span>
          <span>{currentCharacter.defense}</span>
          <span>{currentCharacter.maxHealth}</span>
          <img src={currentCharacter.avatarUrl} />
          <span>{currentCharacter.ability1.name}</span>
          <span>{currentCharacter.ability2.name}</span>
          <span>{currentCharacter.ability3.name}</span>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default New;
