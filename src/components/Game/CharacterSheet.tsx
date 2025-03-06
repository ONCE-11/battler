import { useAtomValue } from "jotai";
import Title from "../Title";
import { characterAtom } from "../../atoms";
import { useEffect, useState } from "react";
import { fetchImage } from "../../utils";
const { VITE_SUPABASE_URL, VITE_ENV } = import.meta.env;

export default function CharacterSheet() {
  const character = useAtomValue(characterAtom);
  const [avatarUrl, setAvatarUrl] = useState<string>();

  if (!character) {
    console.error("Character is not defined");
    return;
  }

  useEffect(function () {
    // to bypass warning screen when downloading image using free ngrok
    if (VITE_ENV === "development") {
      let blobUrl: string;

      fetchImage(
        `${VITE_SUPABASE_URL}${character.avatar_path}`,
        (imageBlob) => {
          blobUrl = URL.createObjectURL(imageBlob);
          setAvatarUrl(blobUrl);
        }
      );

      return () => URL.revokeObjectURL(blobUrl);
    } else {
      setAvatarUrl(`${VITE_SUPABASE_URL}${character.avatar_path}`);
    }
  }, []);

  return (
    <>
      <Title>
        <img
          className="h-20 grayscale rounded-lg inline-block"
          src={avatarUrl}
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
