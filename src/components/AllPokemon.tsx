type AllPokemonProps = {
  pokemon: string[];
  activePokemonId: number | null;
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
    <ul className="leading-10">
      {pokemon.map((name, index: number) => (
        <li key={index}>
          <a
            href={`/pokemon/${name}`}
            onClick={(e) => handleClick(e, index)}
            className={`text-4xl hover:text-green-700 text-indigo-600 ${
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
