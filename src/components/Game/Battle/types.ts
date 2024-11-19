import { atom } from "jotai";

export enum BattleStatus {
  Player1Turn,
  Player2Turn,
  Player1Attacking,
  Player2Attacking,
  Player1Wins,
  Player2Wins,
  Player1Defending,
  Player2Defending,
}

export const musicPlayer = atom<HTMLAudioElement>();
