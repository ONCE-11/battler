import { atom } from "jotai";
import { CharacterWithAbilities } from "../../types/custom";
import { Tables } from "../../types/supabase";

export type FightWithPlayers = Tables<"fights"> & {
  player1: CharacterWithAbilities;
  player2: CharacterWithAbilities;
};

export const fightAtom = atom<FightWithPlayers>();
