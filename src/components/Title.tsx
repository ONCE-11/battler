interface TitleProps {
  text: string;
}

const Title = ({ text }: TitleProps) => {
  return <h1 className="text-6xl font-bold mb-4 mt-8">{text}</h1>;
};

export default Title;
