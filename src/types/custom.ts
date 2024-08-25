import { Tables } from "./supabase";

export interface Ability {
  name: Tables<"abilities">["name"];
  description: Tables<"abilities">["description"];
  // metadata: {
  //   attack?: number;
  //   health?: number;
  //   type?: string;
  // };
}

export type AbilitySlot = 1 | 2 | 3;

export type AbilityButtonHandleClick = (
  event: React.MouseEvent<HTMLButtonElement>,
  ability: Ability,
  abilitySlot: AbilitySlot
) => void;

// export type CharacterData = CreatedCharacter & {
//   healthPercentage: number;
// };

// export interface CharacterData {
//   id: Tables<"characters">["id"];
//   attack: Tables<"characters">["attack"];
//   defense: Tables<"characters">["defense"];
//   avatarUrl: Tables<"characters">["avatar_url"];
//   ability1: Tables<"abilities">;
//   ability2: Tables<"abilities">;
//   ability3: Tables<"abilities">;
//   maxHealth: Tables<"characters">["max_health"];
//   currentHealth: Tables<"characters">["current_health"];
//   healthPercentage: number;
// }

export interface CreatedCharacter {
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

export type CharacterWithAbilitiesRecord = Tables<"characters"> & {
  ability_1?: Tables<"abilities">;
  ability_2?: Tables<"abilities">;
  ability_3?: Tables<"abilities">;
};

// export type CharacterWithAbilitiesRecord = {
//   id: Tables<"characters">["id"];
//   attack: Tables<"characters">["attack"];
//   defense: Tables<"characters">["defense"];
//   max_health: Tables<"characters">["max_health"];
//   current_health: Tables<"characters">["current_health"];
//   avatar_url: Tables<"characters">["avatar_url"];
//   ability_1: Tables<"abilities">;
//   ability_2: Tables<"abilities">;
//   ability_3: Tables<"abilities">;
// };
