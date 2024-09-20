import { CreatedCharacter } from "../../types/custom";
import Title from "../Title";

type CharacterSheetProps = {
  character: CreatedCharacter;
};

export default function CharacterSheet({ character }: CharacterSheetProps) {
  return (
    <>
      <Title>
        <img
          className="h-20 grayscale rounded-lg inline-block"
          src={character?.avatarUrl}
        />
        <span className="inline-block ml-2">{character?.name}</span>
      </Title>
      <div className="rounded b">
        <ul>
          <h2 className="text-2xl">Attributes</h2>
          <li>Attack: {character.attack}</li>
          <li>Defense: {character.defense}</li>
          <li>Max Health: {character.maxHealth}</li>
          <li>Current Health: {character.currentHealth}</li>
        </ul>
        <ol className="mt-2">
          <h2 className="text-2xl">Abilities</h2>
          <li>1: {character.ability1.name}</li>
          <li>2: {character.ability2.name}</li>
          <li>3: {character.ability3.name}</li>
        </ol>
        <ul className="mt-2">
          <h2 className="text-2xl">Gear</h2>
          <li>W: Coming Soon!</li>
          <li>D: Coming Soon!</li>
          <li>I: Coming Soon!</li>
        </ul>
      </div>
    </>
  );
}
