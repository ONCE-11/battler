import { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import AllPokemon from "./AllPokemon";
import SinglePokemon from "./SinglePokemon";
import stylex from "@stylexjs/stylex";

const styles = stylex.create({
  app: {
    backgroundColor: "#ccc",
  },
});

type SinglePokemon = {
  name: string;
  height: string;
  weight: string;
  image: string;
  abilities: string[];
};

type PokemonName = string;

const emptyPokemon = {
  name: "",
  height: "",
  weight: "",
  image: "",
  abilities: [],
};

const Info = () => {
  const [pokemonNames, setPokemonNames] = useState<PokemonName[]>([]);
  const [singlePokemon, setSinglePokemon] =
    useState<SinglePokemon>(emptyPokemon);

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
    event: React.MouseEvent<HTMLAnchorElement>
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackClick = () => {
    setSinglePokemon(emptyPokemon);
  };

  return (
    <div {...stylex.props(styles.app)}>
      {_.isEqual(singlePokemon, emptyPokemon) ? (
        <AllPokemon pokemon={pokemonNames} handleClick={handleAnchorClick} />
      ) : (
        <SinglePokemon
          singlePokemon={singlePokemon}
          handleClick={handleBackClick}
        />
      )}
    </div>
  );
};

export default Info;
