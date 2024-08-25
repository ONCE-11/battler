import { supabase } from "../../utils";
import { useSetAtom, useAtomValue } from "jotai";
import { currentUserAtom, currentCharacterAtom } from "../../state";
import { CreatedCharacter } from "../../types/custom";

const useCharacter = () => {
  const setCurrentCharacter = useSetAtom(currentCharacterAtom);
  const currentUser = useAtomValue(currentUserAtom);

  const createCharacter = async () => {
    const { data: character, error } = await supabase.functions.invoke(
      "createCharacter",
      {
        body: { userId: currentUser!.id },
      }
    );

    if (error) console.error(error);

    console.log(character);

    setCurrentCharacter(character);
  };

  const fetchCurrentCharacter = async () => {
    console.log(currentUser);

    const {
      data: character,
      error,
    }: { data: CreatedCharacter | null; error: object | null } = await supabase
      .from("characters")
      .select(
        "id, attack, defense, maxHealth:max_health, currentHealth:current_health, avatarUrl:avatar_url, createdAt:created_at, ability1:ability_1_id (*), ability2:ability_2_id (*), ability3:ability_3_id (*)"
      )
      .eq("user_id", currentUser!.id)
      .eq("alive", true)
      .single();

    // Try changing 'abilities' to one of the following: 'abilities!characters_ability_1_id_fkey', 'abilities!characters_ability_2_id_fkey', 'abilities!characters_ability_3_id_fkey'. Find the desired relationship in the 'details' key.

    if (error) {
      console.error(error);
    }

    if (!character) {
      return;
    }

    console.log("current character = ", character);

    setCurrentCharacter(character);

    return character;
  };

  const fetchCharacter = async (id: string) => {
    const {
      data: character,
      error,
    }: { data: CreatedCharacter | null; error: object | null } = await supabase
      .from("characters")
      .select(
        "id, attack, defense, maxHealth:max_health, currentHealth:current_health, avatarUrl:avatar_url, createdAt:created_at, ability1:ability_1_id (*), ability2:ability_2_id (*), ability3:ability_3_id (*)"
      )
      .eq("user_id", id)
      .eq("alive", true)
      .single();

    if (error) console.error(error);

    return character;
  };

  return { createCharacter, fetchCurrentCharacter, fetchCharacter };
};

export default useCharacter;
