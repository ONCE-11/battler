type AllCharactersProps = {
  characters: string[];
  currentCharacterIndex: number | null;
  handleClick: (
    event: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) => void;
};

const AllCharacters = ({
  characters,
  currentCharacterIndex,
  handleClick,
}: AllCharactersProps) => {
  return (
    <ul className="leading-10">
      {characters.map((name, index: number) => (
        <li key={index}>
          <a
            href={`/character/${name}`}
            onClick={(e) => handleClick(e, index)}
            className={`text-4xl hover:text-green-700 text-indigo-600 ${
              index === currentCharacterIndex && "text-green-700 underline"
            }`}
          >
            {name}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default AllCharacters;
