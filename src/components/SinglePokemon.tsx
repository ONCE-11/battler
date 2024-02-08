interface SinglePokemonProps {
  singlePokemon: {
    name: string;
    height: string;
    weight: string;
    image: string;
    abilities: string[];
  };
}

const SinglePokemon = ({ singlePokemon }: SinglePokemonProps) => {
  const { name, height, weight, image, abilities } = singlePokemon;

  return (
    <div className="p-4 rounded w-1/2 shadow-lg bg-slate-200 ml-14">
      <p className="flex justify-between">
        <span className="text-purple-700 text-2xl">{height}</span>
        <span className="text-blue-700 text-2xl">{weight} </span>
      </p>
      <img src={image} />
      <section className="flex justify-between border-l-0 border-r-0 border-b-0 border border-t-slate-500 border-solid pt-4">
        <h2 className="text-green-700 capitalize text-2xl">{name}</h2>

        <ul className="text-right text-lg">
          {abilities.map((ability, index) => (
            <li key={index}>{ability}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default SinglePokemon;
