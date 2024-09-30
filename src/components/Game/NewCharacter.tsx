import Title from "../Title";
import { supabase } from "../../utils";
import { characterAtom, currentUserAtom } from "../../state";
import { useAtomValue, useSetAtom } from "jotai";
import Button from "../Button";
import { User } from "@supabase/supabase-js";

export default function NewCharacter() {
  const currentUser = useAtomValue(currentUserAtom);
  const setCharacter = useSetAtom(characterAtom);

  if (!currentUser) {
    console.error("Current user is not defined");
    return;
  }

  const handleClick = async (currentUser: User) => {
    const { data: character, error } = await supabase.functions.invoke(
      "createCharacter",
      {
        body: { userId: currentUser.id },
      }
    );

    if (error) {
      console.error(error);
      return;
    }

    console.log({ character });

    setCharacter(character);
  };

  return (
    <>
      <Title>New Character</Title>
      <Button
        text="Go"
        additionalCssClasses={["mt-4"]}
        handleClick={(_e) => handleClick(currentUser)}
      />
    </>
  );
}
