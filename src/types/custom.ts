export interface Ability {
  type: "heal" | "damage";
  name: string;
}

export interface CharacterData {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  image: string;
  abilities: Ability[];
}
