import Title from "../Title";
import { supabase } from "../../utils";
import { characterAtom, currentUserAtom } from "../../atoms";
import { useAtomValue, useSetAtom } from "jotai";
import Button from "../Button";
import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
  User,
} from "@supabase/supabase-js";
import { CharacterWithAbilities } from "../../types/custom";

export default function NewCharacter() {
  const currentUser = useAtomValue(currentUserAtom);
  const setCharacter = useSetAtom(characterAtom);

  if (!currentUser) {
    console.error("Current user is not defined");
    return;
  }

  const handleClick = async (currentUser: User) => {
    const { data: character, error } =
      await supabase.functions.invoke<CharacterWithAbilities>(
        "createCharacter",
        {
          body: { userId: currentUser.id },
        }
      );

    if (error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      console.error("Function returned an error", errorMessage);
      return;
    } else if (error instanceof FunctionsRelayError) {
      console.error("Relay error:", error.message);
      return;
    } else if (error instanceof FunctionsFetchError) {
      console.error("Fetch error:", error.message);
      return;
    }

    if (!character) {
      console.error("Character is not set");
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
        className="mt-4"
        handleClick={(_e) => handleClick(currentUser)}
      />
    </>
  );
}
