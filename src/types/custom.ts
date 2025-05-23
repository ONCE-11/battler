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

export type CharacterWithAbilities = Tables<"characters"> & {
  ability1: Tables<"abilities">; // TODO: correct these types at some point
  ability2: Tables<"abilities">;
  ability3: Tables<"abilities">;
};

export enum Scene {
  NewCharacter,
  CharacterSheet,
  Beef,
  Battle,
}

export enum Music {
  Battle = "battle.mp3",
  Default = "music.mp3",
}

export type SetAtom<Args extends any[], Result> = (...args: Args) => Result;
