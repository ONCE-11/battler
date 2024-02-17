import { useEffect } from "react";
import axios from "axios";
import AllCharacters from "./AllCharacters";
import Character from "./Character";
import { CharacterData } from "../types/custom";
import Title from "./Title";
import { useAtom, atom } from "jotai";

type CharacterName = string;
type CharacterIndex = number | null;

const charactersAtom = atom<CharacterName[]>([]);
const currentCharacterAtom = atom<CharacterData>({
  name: "",
  hp: 0,
  attack: 0,
  defense: 0,
  image: "",
  abilities: [],
});
const showDetailsAtom = atom(false);
const activeCharacterIndexAtom = atom<CharacterIndex>(null);

const Info = () => {
  const [characters, setCharacters] = useAtom(charactersAtom);
  const [currentCharacter, setCurrentCharacter] = useAtom(currentCharacterAtom);
  const [showDetails, setShowDetails] = useAtom(showDetailsAtom);
  const [activeCharacterIndex, setActiveCharacterIndex] =
    useAtom(activeCharacterIndexAtom);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const {
          data: { results },
        } = await axios.get("https://pokeapi.co/api/v2/pokemon/");
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
        abilities: abilities.map((ability: { ability: { name: string } }) => ({
          name: ability.ability.name,
          type: "damage",
        })),
      });
      setShowDetails(true);
      setActiveCharacterIndex(characterIndex);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Title text="Characters" />
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
            <Character character={currentCharacter} />
          </section>
        )}
      </div>
    </>
  );
};

export default Info;
