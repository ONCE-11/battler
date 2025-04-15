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
export const currentUserAtom = atom<User | null>();
export const currentCharacterAtom = atom<CharacterWithAbilities | null>();
export const sceneAtom = atom<Scene>();
export const characterAtom = atom<CharacterWithAbilities | null>();
