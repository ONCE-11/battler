import stylex from "@stylexjs/stylex";

const styles = stylex.create({
  image: {
    width: "100%",
    height: "300px",
  },
  card: {
    padding: "1rem",
    margin: "1rem 0",
    borderRadius: ".25rem",
    width: "300px",
    transform: {
      // default: "rotate(-5deg) scale(0.9)",
      // ":hover": "rotate(0) scale(1)",
    },
    boxShadow: "0px 0px 4px 0px",
    transition: "all .5s",
    backgroundColor: "#efefef",
  },
  p: {
    margin: 0,
  },
  name: {
    margin: 0,
    color: "green",
    textTransform: "capitalize",
  },
  stats: {
    margin: 0,
    display: "flex",
    justifyContent: "space-between",
  },
  height: {
    color: "magenta",
  },
  weight: {
    color: "blue",
  },
  abilitiesList: {
    padding: 0,
    margin: 0,
    textAlign: "right",
  },
  ability: {
    listStyleType: "none",
  },
  backButton: {
    marginLeft: 0,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #333",
    paddingTop: "1rem",
  },
  header: {
    padding: 0,
  },
});

type SinglePokemonProps = {
  singlePokemon: {
    name: string;
    height: string;
    weight: string;
    image: string;
    abilities: string[];
  };
  handleClick: () => void;
};

const SinglePokemon = ({ singlePokemon, handleClick }: SinglePokemonProps) => {
  const { name, height, weight, image, abilities } = singlePokemon;

  return (
    <>
      <h1 {...stylex.props(styles.header)}>Entity</h1>
      <div {...stylex.props(styles.card)}>
        <p {...stylex.props(styles.stats)}>
          <span {...stylex.props(styles.height)}>{height}</span>
          <span {...stylex.props(styles.weight)}>{weight} </span>
        </p>
        <img src={image} {...stylex.props(styles.image)} />
        <section {...stylex.props(styles.footer)}>
          <h2 {...stylex.props(styles.name)}>{name}</h2>

          <ul {...stylex.props(styles.abilitiesList)}>
            {abilities.map((ability, index) => (
              <li key={index} {...stylex.props(styles.ability)}>
                {ability}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <button onClick={handleClick} {...stylex.props(styles.backButton)}>
        Back
      </button>
    </>
  );
};

export default SinglePokemon;
