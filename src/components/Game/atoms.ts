import { atom } from "jotai";
import { FightWithPlayers } from "./types";

export const fightAtom = atom<FightWithPlayers | null>(null);
export const characterLoadingAtom = atom(false);
