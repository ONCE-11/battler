type AllPokemonProps = {
  pokemon: string[];
  activePokemonId: number | null;
  // handleClick: React.MouseEventHandler;
  handleClick: (
    event: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) => void;
};

const AllPokemon = ({
  pokemon,
  activePokemonId,
  handleClick,
}: AllPokemonProps) => {
  return (
    <ul>
      {pokemon.map((name, index: number) => (
        <li key={index}>
          <a
            href={`/pokemon/${name}`}
            onClick={(e) => handleClick(e, index)}
            className={`hover:text-green-700 text-indigo-600 ${
              index === activePokemonId && "text-green-700 underline"
            }`}
          >
            {name}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default AllPokemon;
