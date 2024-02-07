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
      <h1 className="text-2xl font-bold mb-4">Entity</h1>
      <div className="p-4 my-4 rounded w-80 shadow-lg bg-slate-200">
        <p className="flex justify-between">
          <span className="text-purple-700">{height}</span>
          <span className="text-blue-700">{weight} </span>
        </p>
        <img src={image} />
        <section className="flex justify-between border-l-0 border-r-0 border-b-0 border border-t-slate-500 border-solid pt-4">
          <h2 className="text-green-700 capitalize text-xl">{name}</h2>

          <ul className="text-right text-xs">
            {abilities.map((ability, index) => (
              <li key={index}>{ability}</li>
            ))}
          </ul>
        </section>
      </div>
      <button onClick={handleClick}>Back</button>
    </>
  );
};

export default SinglePokemon;
