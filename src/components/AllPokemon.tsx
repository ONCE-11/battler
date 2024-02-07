import stylex from "@stylexjs/stylex";

const styles = stylex.create({
  ul: {
    padding: 0,
    margin: 0,
  },
  li: {
    listStyleType: "none",
  },
});

type AllPokemonProps = {
  pokemon: string[];
  handleClick: React.MouseEventHandler;
};

const AllPokemon = ({ pokemon, handleClick }: AllPokemonProps) => {
  return (
    <>
      <h1>Entities</h1>
      <ul {...stylex.props(styles.ul)}>
        {pokemon.map((name, index: number) => (
          <li key={index} {...stylex.props(styles.li)}>
            <a href={`/pokemon/${name}`} onClick={handleClick}>
              {name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AllPokemon;
