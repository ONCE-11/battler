import { User } from "@supabase/supabase-js";
import { CharacterWithAbilities } from "../src/types/custom";
import { FightWithPlayers } from "../src/components/Game/types";

export const currentUserMock = {
  id: "f68fedbf-4413-4e3e-b270-d758a5d5869c",
} as User;

export const characterMock: CharacterWithAbilities = {
  id: "f68fedbf-4413-4e3e-b290-d758a5d5869c",
  attack: 20,
  defense: 30,
  max_health: 100,
  current_health: 100,
  avatar_url: "",
  avatar_path: "",
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
  defense_item_id: null,
  alive: true,
  accessory_item_id: null,
  attack_item_id: null,
  consumable_id: null,
  fighting: false,
  user_id: currentUserMock.id,
};

const characterMockPlayer2: CharacterWithAbilities = {
  ...characterMock,
  id: "f68fedbf-4413-4e3e-g270-d758a5d5869c",
  name: "Iron Giant",
  fighting: true,
  user_id: "f68fedbf-0513-4e3e-b270-d758a5d5869c",
  ability1: {
    id: "",
    name: "work out",
    metadata: "{}",
    created_at: "",
    description: "",
  },
  ability2: {
    id: "",
    name: "deck",
    metadata: "{}",
    created_at: "",
    description: "",
  },
  ability3: {
    id: "",
    name: "kick",
    metadata: "{}",
    created_at: "",
    description: "",
  },
};

export const fightWithPlayersMock: FightWithPlayers = {
  id: "f68hedbf-4413-4e3e-b270-d758a5d5869c",
  player1_id: characterMock.id,
  player2_id: characterMockPlayer2.id,
  player1: characterMock,
  player2: characterMockPlayer2,
  game_over: false,
  current_turn_player_id: characterMock.id,
  turn: 1,
  winner_id: null,
  created_at: "",
};
