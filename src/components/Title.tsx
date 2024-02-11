interface TitleProps {
  text: string;
}

const Title = ({ text }: TitleProps) => {
  return <h1 className="text-6xl font-bold py-4">{text}</h1>;
};

export default Title;
