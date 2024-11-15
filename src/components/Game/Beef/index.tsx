import Title from "../../Title";
import PotentialOpponents from "./PotentialOpponents";
import PastBeef from "./PastBeef";
import Button from "../../Button";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../../utils";
import { CharacterWithAbilities } from "../../../types/custom";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "../../../atoms";

export default function Beef() {
  const [potentialOpponents, setPotentialOpponents] = useState<
    CharacterWithAbilities[]
  >([]);

  const currentUser = useAtomValue(currentUserAtom);

  if (!currentUser) {
    console.error("Current user is not defined");
    return;
  }

  useEffect(function () {
    fetchData(currentUser.id);
  }, []);

  async function fetchData(currentUserId: User["id"]) {
    const { data: potentialOpponents, error: fetchCharactersError } =
      await supabase
        .from("characters")
        .select("*")
        .not("user_id", "eq", currentUserId)
        .eq("alive", true)
        .eq("fighting", false)
        .returns<CharacterWithAbilities[]>();

    if (fetchCharactersError) throw fetchCharactersError;

    console.log({ potentialOpponents });
    setPotentialOpponents(potentialOpponents);
  }

  return (
    <>
      <Title className="flex justify-between">
        Beef{" "}
        <Button
          className="text-base"
          handleClick={() => fetchData(currentUser.id)}
        >
          Refresh
        </Button>
      </Title>
      <PotentialOpponents potentialOpponents={potentialOpponents} />
      <PastBeef />
    </>
  );
}
