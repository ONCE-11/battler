type AllPokemonProps = {
  pokemon: string[];
  handleClick: React.MouseEventHandler;
};

const AllPokemon = ({ pokemon, handleClick }: AllPokemonProps) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Entities</h1>
      <ul>
        {pokemon.map((name, index: number) => (
          <li key={index}>
            <a
              href={`/pokemon/${name}`}
              onClick={handleClick}
              className="hover:underline text-indigo-600"
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AllPokemon;
