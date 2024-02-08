interface SinglePokemonProps {
  singlePokemon: {
    name: string;
    hp: number | null;
    attack: number | null;
    defense: number | null;
    image: string;
    abilities: string[];
  };
}

const SinglePokemon = ({ singlePokemon }: SinglePokemonProps) => {
  const { name, hp, attack, defense, image, abilities } = singlePokemon;

  return (
    <div className="p-4 rounded shadow-lg bg-slate-200">
      <p className="flex justify-between">
        <span className="text-purple-700 text-2xl">{hp}</span>
        <span className="text-blue-700 text-2xl">{attack} </span>
        <span className="text-red-700 text-2xl">{defense}</span>
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
