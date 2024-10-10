import { User } from "@supabase/supabase-js";
import { CharacterWithAbilities } from "../../../types/custom";
import { FightWithPlayers } from "../types";

export const characterMock = {
  id: "",
  attack: 20,
  defense: 30,
  max_health: 100,
  current_health: 100,
  avatar_url: "",
  created_at: "",
  name: "Rocky Balboa",
  ability1: {
    id: "",
    name: "heal me",
    metadata: "{}",
    created_at: "",
    description: "",
  },
  ability2: {
    id: "",
    name: "run away",
    metadata: "{}",
    created_at: "",
    description: "",
  },
  ability3: {
    id: "",
    name: "basic punch",
    metadata: "{}",
    created_at: "",
    description: "",
  },
  ability_1_id: "",
  ability_2_id: "",
  ability_3_id: "",
  alive: true,
  accessory_item_id: null,
  attack_item_id: null,
  consumable_id: null,
} as CharacterWithAbilities;

export const currentUserMock = {
  id: "some-sort-of-id",
} as User;

export const fightWithPlayersMock = {
  id: "",
  player1_id: characterMock.id,
  player2_id: characterMock.id,
  player1: characterMock,
  player2: characterMock,
  game_over: false,
  current_turn_player_id: characterMock.id,
  turn: 1,
} as FightWithPlayers;
