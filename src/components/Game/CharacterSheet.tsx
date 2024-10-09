import { useAtomValue } from "jotai";
import Title from "../Title";
import { characterAtom } from "../../atoms";

export default function CharacterSheet() {
  const character = useAtomValue(characterAtom);

  if (!character) {
    console.error("Character is not defined");
    return;
  }

  return (
    <>
      <Title>
        <img
          className="h-20 grayscale rounded-lg inline-block"
          src={character.avatar_url}
        />
        <span className="inline-block ml-2" data-testid="character">
          {character.name}
        </span>
      </Title>
      <div className="rounded b">
        <ul>
          <h2 className="text-2xl">Attributes</h2>
          <li>Attack: {character.attack}</li>
          <li>Defense: {character.defense}</li>
          <li>Max Health: {character.max_health}</li>
          <li>Current Health: {character.current_health}</li>
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
