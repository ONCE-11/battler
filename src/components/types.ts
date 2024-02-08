export interface Ability {
  type: "heal" | "damage";
  name: string;
}

export interface CharacterData {
  name: string;
  hp: number | null;
  attack: number | null;
  defense: number | null;
  image: string;
  abilities: Ability[];
}
