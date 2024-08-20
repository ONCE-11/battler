import { Tables } from "./supabase";

export interface Ability {
  type: "heal" | "damage";
  name: string;
}

export interface CharacterData {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  image: string;
  abilities: Ability[];
}

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
