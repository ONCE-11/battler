import { useState, useEffect } from "react";
import axios from "axios";
import AllPokemon from "./AllPokemon";
import SinglePokemon from "./SinglePokemon";

interface SinglePokemonData {
  name: string;
  hp: number | null;
  attack: number | null;
  defense: number | null;
  image: string;
  abilities: string[];
}

type PokemonId = number | null;

const Info = () => {
  const [pokemonList, setPokemonNames] = useState<string[]>([]);
  const [singlePokemon, setSinglePokemon] = useState<SinglePokemonData>({
    name: "",
    hp: null,
    attack: null,
    defense: null,
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
        data: { name, sprites, abilities, stats },
      } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${event.currentTarget.innerText}`
      );

      setSinglePokemon({
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
      setActivePokemonId(pokemonIndex);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1 className="text-6xl font-bold mb-4 mt-8">Entities</h1>
      <div className="flex items-start">
        <section>
          <AllPokemon
            pokemon={pokemonList}
            activePokemonId={activePokemonId}
            handleClick={handleAnchorClick}
          />
        </section>
        {showDetails && (
          <section className="ml-14">
            <SinglePokemon singlePokemon={singlePokemon} />
          </section>
        )}
      </div>
    </>
  );
};

export default Info;
