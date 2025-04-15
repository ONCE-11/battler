import { supabase } from "../utils";
import { useSetAtom, useAtomValue } from "jotai";
import { currentUserAtom, currentCharacterAtom } from "../atoms";
import { CharacterWithAbilities } from "../types/custom";

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

    // console.log(character);

    setCurrentCharacter(character);
  };

  const fetchCharacter = async (userId: string) => {
    const {
      data: character,
      error,
    }: { data: CharacterWithAbilities | null; error: object | null } =
      await supabase
        .from("characters")
        .select(
          "*, ability1:ability_1_id (*), ability2:ability_2_id (*), ability3:ability_3_id (*)"
        )
        .eq("user_id", userId)
        .eq("alive", true)
        .single();

    if (error) {
      console.error(error);
    }

    if (!character) {
      return;
    }

    setCurrentCharacter(character);

    return character;
  };

  // const fetchCharacter = async (userId: string) => {
  //   const { data: character, error } = await supabase
  //     .from("characters")
  //     .select("*")
  //     .eq("user_id", userId)
  //     .eq("alive", true)
  //     .single();

  //   console.info("character info", character);

  //   if (error) {
  //     console.error(error);
  //     return;
  //   }

  //   return character;
  // };

  return { createCharacter, fetchCharacter };
};

export default useCharacter;
