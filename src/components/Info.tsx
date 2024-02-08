import { useState, useEffect } from "react";
import axios from "axios";
import AllPokemon from "./AllPokemon";
import SinglePokemon from "./SinglePokemon";

interface SinglePokemonData {
  name: string;
  height: string;
  weight: string;
  image: string;
  abilities: string[];
}

type PokemonId = number | null;

const Info = () => {
  const [pokemonList, setPokemonNames] = useState<string[]>([]);
  const [singlePokemon, setSinglePokemon] = useState<SinglePokemonData>({
    name: "",
    height: "",
    weight: "",
    image: "",
    abilities: [],
  });
  const [showDetails, setShowDetails] = useState(false);
  const [activePokemonId, setActivePokemonId] = useState<PokemonId>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const {
          data: { results },
        } = await axios.get("https://pokeapi.co/api/v2/pokemon/");
        console.log(results);
        setPokemonNames(results.map((result: { name: string }) => result.name));
      } catch (err) {
        console.error(err);
      }
    };

    fetchPokemon();
  }, []);

  const handleAnchorClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    pokemonIndex: number
  ) => {
    event.preventDefault();

    try {
      const {
        data: { name, height, weight, sprites, abilities },
      } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${event.currentTarget.innerText}`
      );

      setSinglePokemon({
        name,
        height,
        weight,
        image: sprites.other["official-artwork"]["front_default"],
        abilities: abilities.map(
          (ability: { ability: { name: string } }) => ability.ability.name
        ),
      });
      setShowDetails(true);
      setActivePokemonId(pokemonIndex);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1 className="text-6xl font-bold mb-4 mt-8">Entities</h1>
      <div className="flex items-start">
        <AllPokemon
          pokemon={pokemonList}
          activePokemonId={activePokemonId}
          handleClick={handleAnchorClick}
        />
        {showDetails && <SinglePokemon singlePokemon={singlePokemon} />}
      </div>
    </>
  );
};

export default Info;
