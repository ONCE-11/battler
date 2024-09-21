import { Tables } from "./supabase";
import { MouseEvent } from "react";

export type Ability = {
  name: Tables<"abilities">["name"];
  description: Tables<"abilities">["description"];
  // metadata: {
  //   attack?: number;
  //   health?: number;
  //   type?: string;
  // };
};

export type AbilitySlot = 1 | 2 | 3;

export type AbilityButtonHandleClick = (
  event: MouseEvent<HTMLButtonElement>,
  ability: Ability,
  abilitySlot: AbilitySlot,
  initiator: Tables<"characters">,
  receiver: Tables<"characters">
) => void;

export type ButtonHandleClick = (
  event: MouseEvent<HTMLButtonElement>,
  extraParam?: any
) => void;

export type CharacterWithAbilities = Tables<"characters"> & {
  ability1: Tables<"abilities">; // TODO: correct these types at some point
  ability2: Tables<"abilities">;
  ability3: Tables<"abilities">;
};

export enum GamePage {
  NewCharacter,
  CharacterSheet,
  Beef,
  Battle,
}
