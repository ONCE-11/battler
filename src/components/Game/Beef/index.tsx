import Title from "../../Title";
import PotentialOpponents from "./PotentialOpponents";
import PastBeef from "./PastBeef";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../../utils";
import { CharacterWithAbilities } from "../../../types/custom";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "../../../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../Button";

export default function Beef() {
  const [potentialOpponents, setPotentialOpponents] = useState<
    CharacterWithAbilities[]
  >([]);
  const currentUser = useAtomValue(currentUserAtom);
  const [loading, setLoading] = useState(false);

  if (!currentUser) {
    console.error("Current user is not defined");
    return;
  }

  useEffect(function () {
    fetchData(currentUser.id);
  }, []);

  async function fetchData(currentUserId: User["id"]) {
    setLoading(true);

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

    setLoading(false);
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
      {loading ? (
        <FontAwesomeIcon
          icon={"circle-notch"}
          className={"text-purple-500 text-lg fa-spin"}
          onClick={() => fetchData(currentUser.id)}
        />
      ) : (
        <>
          <PotentialOpponents potentialOpponents={potentialOpponents} />
          <PastBeef />
        </>
      )}
    </>
  );
}
