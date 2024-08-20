import { atom } from "jotai";
import { User } from "@supabase/supabase-js";
import { CreatedCharacter } from "./types/custom";
// import { supabase } from "./utilities";

interface MessageType {
  type?: "info" | "error";
  text?: string;
}

export const loadingAtom = atom(true);
export const messageAtom = atom<MessageType>({});
export const loggedInAtom = atom(false);
export const currentUserAtom = atom<User | null>(null);
// export const currentCharacterAtom = atom(async (get) => {
//   const currentUser = get(currentUserAtom);

//   console.log(currentUser);

//   const {
//     data: character,
//     error,
//   }: { data: CreatedCharacter | null; error: object | null } = await supabase
//     .from("characters")
//     .select(
//       "id, attack, defense, maxHealth:max_health, currentHealth:current_health, avatarUrl:avatar_url, createdAt:created_at, ability1:ability_1_id (*), ability2:ability_2_id (*), ability3:ability_3_id (*)"
//     )
//     .eq("user_id", currentUser!.id)
//     .eq("alive", true)
//     .single();

//   // Try changing 'abilities' to one of the following: 'abilities!characters_ability_1_id_fkey', 'abilities!characters_ability_2_id_fkey', 'abilities!characters_ability_3_id_fkey'. Find the desired relationship in the 'details' key.

//   if (error) {
//     console.error(error);
//   }

//   if (!character) {
//     return null;
//   }

//   console.log("current character = ", character);

//   return character;
// }, (async (get, set, newUser) => {
//   const { data: character } = await supabase.functions.invoke(
//     "createCharacter",
//     {
//       body: { userId: get(currentUserAtom)!.id },
//     }
//   );

//   console.log(character);

//   set(character);
// }));
export const currentCharacterAtom = atom<CreatedCharacter | null>(null);
