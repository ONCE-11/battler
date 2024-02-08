import { useState, useEffect } from "react";
import axios from "axios";
import AllCharacters from "./AllCharacters";
import Fighter from "./Character";

interface CharacterData {
  name: string;
  hp: number | null;
  attack: number | null;
  defense: number | null;
  image: string;
  abilities: string[];
}

type CharacterName = string;
type CharacterIndex = number | null;

const Info = () => {
  const [characters, setCharacters] = useState<CharacterName[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<CharacterData>({
    name: "",
    hp: null,
    attack: null,
    defense: null,
    image: "",
    abilities: [],
  });
  const [showDetails, setShowDetails] = useState(false);
  const [activeCharacterIndex, setActiveCharacterIndex] =
    useState<CharacterIndex>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const {
          data: { results },
        } = await axios.get("https://pokeapi.co/api/v2/pokemon/");
        console.log(results);
        setCharacters(results.map((result: { name: string }) => result.name));
      } catch (err) {
        console.error(err);
      }
    };

    fetchPokemon();
  }, []);

  const handleAnchorClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    characterIndex: number
  ) => {
    event.preventDefault();

    try {
      const {
        data: { name, sprites, abilities, stats },
      } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${event.currentTarget.innerText}`
      );

      setCurrentCharacter({
        name,
        hp: Number(stats[0].base_stat),
        attack: Number(stats[1].base_stat),
        defense: Number(stats[2].base_stat),
        image: sprites.other["official-artwork"]["front_default"],
        abilities: abilities.map(
          (ability: { ability: { name: string } }) => ability.ability.name
        ),
      });
      setShowDetails(true);
      setActiveCharacterIndex(characterIndex);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1 className="text-6xl font-bold mb-4 mt-8">Characters</h1>
      <div className="flex items-start">
        <section>
          <AllCharacters
            characters={characters}
            currentCharacterIndex={activeCharacterIndex}
            handleClick={handleAnchorClick}
          />
        </section>
        {showDetails && (
          <section className="ml-14">
            <Fighter character={currentCharacter} />
          </section>
        )}
      </div>
    </>
  );
};

export default Info;
