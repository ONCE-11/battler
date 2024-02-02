import { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import "./App.css";
import AllPokemon from "./components/AllPokemon";
import SinglePokemon from "./components/SinglePokemon";

interface SinglePokemonState {
  name?: string;
  height?: string;
  weight?: string;
  image?: string;
  abilities?: Array<string>;
}

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [singlePokemon, setSinglePokemon] = useState<SinglePokemonState>({});

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const {
          data: { results },
        } = await axios.get("https://pokeapi.co/api/v2/pokemon/");
        console.log(results);
        setPokemon(results);
      } catch (err) {
        console.error(err);
      }
    }

    fetchPokemon();
  }, []);

  async function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    // console.log(event.currentTarget.innerText);

    try {
      const {
        data: { name, height, weight, sprites, abilities },
      } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${event.currentTarget.innerText}`
      );

      // console.log(data);
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
  }

  function handleBackClick() {
    setSinglePokemon({});
  }

  return (
    <>
      {_.isEmpty(singlePokemon) ? (
        <AllPokemon pokemon={pokemon} handleClick={handleClick} />
      ) : (
        <SinglePokemon
          singlePokemon={singlePokemon}
          handleBackClick={handleBackClick}
        />
      )}
    </>
  );
}

export default App;
