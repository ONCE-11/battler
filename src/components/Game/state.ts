import { atom } from "jotai";
import { Tables } from "../../types/supabase";

export const fightAtom = atom<Tables<"fights">>();
