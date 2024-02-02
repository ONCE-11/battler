export interface AllPokemonProps {
  pokemon: Array<{ name: string }>;
  handleClick: React.MouseEventHandler;
}

export default function AllPokemon({ pokemon, handleClick }: AllPokemonProps) {
  return (
    <>
      {pokemon.map(({ name }: { name: string }, index: number) => (
        <li key={index}>
          <a href={`/pokemon/${name}`} onClick={handleClick}>
            {name}
          </a>
        </li>
      ))}
    </>
  );
}
