import "./pokemon.css";

interface SinglePokemonProps {
  singlePokemon: {
    name?: string;
    height?: string;
    weight?: string;
    image?: string;
    abilities?: Array<string>;
  };
  handleBackClick: React.MouseEventHandler;
}

export default function SinglePokemon({
  singlePokemon,
  handleBackClick,
}: SinglePokemonProps) {
  const { name, height, weight, image, abilities } = singlePokemon;

  return (
    <ul>
      <li>
        <img src={image} />
        <button onClick={handleBackClick}>Back</button>
      </li>
      <li>Name: {name}</li>
      <li>Height: {height}</li>
      <li>Weight: {weight}</li>
      <li>
        {abilities?.map((ability, index) => (
          <p key={index}>{ability}</p>
        ))}
      </li>
    </ul>
  );
}
