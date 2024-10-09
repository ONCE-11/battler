import { atom } from "jotai";
import { User } from "@supabase/supabase-js";
import { CharacterWithAbilities } from "./types/custom";
import { GamePage } from "./types/custom";
// import { supabase } from "./utilities";

interface MessageType {
  type?: "info" | "error";
  text?: string;
}

export const loadingAtom = atom(true);
export const messageAtom = atom<MessageType>({});
export const loggedInAtom = atom(false);
export const currentUserAtom = atom<User>();
export const currentCharacterAtom = atom<CharacterWithAbilities>();
export const gamePageAtom = atom<GamePage>(GamePage.CharacterSheet);
export const characterAtom = atom<CharacterWithAbilities>();
