import Title from "../Title";
import { supabase } from "../../utils";
import { currentUserAtom } from "../../state";
import { useAtomValue } from "jotai";
import { CreatedCharacter } from "../../types/custom";
import { MouseEvent } from "react";
import { ButtonHandleClick } from "../../types/custom";
import Button from "../Button";

type NewCharacterProps = {
  setCharacter: (character: CreatedCharacter) => void;
};

export default function NewCharacter({ setCharacter }: NewCharacterProps) {
  const currentUser = useAtomValue(currentUserAtom);

  const handleClick: ButtonHandleClick = async (
    _event: MouseEvent<HTMLButtonElement>
  ) => {
    const { data: character, error } = await supabase.functions.invoke(
      "createCharacter",
      {
        body: { userId: currentUser!.id },
      }
    );

    if (error) console.error(error);

    console.log(character);

    setCharacter(character);
  };

  return (
    <>
      <Title>New Character</Title>
      <Button
        text="Go"
        additionalCssClasses={["mt-4"]}
        handleClick={handleClick}
      />
    </>
  );
}
