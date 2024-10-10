import { atom } from "jotai";
import { User } from "@supabase/supabase-js";
import { CharacterWithAbilities } from "./types/custom";
import { Scene } from "./types/custom";

interface MessageType {
  type?: "info" | "error";
  text?: string;
}

export const loadingAtom = atom(true);
export const messageAtom = atom<MessageType>({});
export const loggedInAtom = atom(false);
export const currentUserAtom = atom<User>();
export const currentCharacterAtom = atom<CharacterWithAbilities>();
export const gamePageAtom = atom<Scene>(Scene.CharacterSheet);
export const characterAtom = atom<CharacterWithAbilities>();
