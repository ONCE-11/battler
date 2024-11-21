import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { CharacterWithAbilities, Music, Scene } from "../../types/custom";
import CharacterSheet from "./CharacterSheet";
import Battle from "./Battle";
import Beef from "./Beef";
import {
  characterAtom,
  currentUserAtom,
  sceneAtom,
  loadingAtom,
  audioAtom,
} from "../../atoms.js";
import { useEffect, useState } from "react";
import NewCharacter from "./NewCharacter";
import { RealtimePostgresInsertPayload, User } from "@supabase/supabase-js";
import { supabase, switchAudioSource } from "../../utils";
import { FightWithPlayers } from "./types.js";
import { fightAtom } from "./atoms.js";
import { Tables } from "../../types/supabase.js";

const NO_ROWS_RETURNED = "PGRST116";

export default function Game() {
  const [scene, setScene] = useAtom(sceneAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const [character, setCharacter] = useAtom(characterAtom);
  const setFight = useSetAtom(fightAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [component, setComponent] = useState<JSX.Element | undefined>();
  const audio = useAtomValue(audioAtom);

  if (!currentUser) {
    console.error("Current user is not defined");
    return;
  }

  // console.log({ character });

  useEffect(
    function () {
      setLoading(true);

      async function fetchCharacter(userId: User["id"]): Promise<void> {
        const { data: characterWithAbilities, error: fetchCharacterError } =
          await supabase
            .from("characters")
            .select(
              "*, ability1:ability_1_id (*), ability2:ability_2_id (*), ability3:ability_3_id (*)"
            )
            .eq("user_id", userId)
            .eq("alive", true)
            .returns<CharacterWithAbilities[]>()
            .single();

        if (fetchCharacterError) {
          if (fetchCharacterError.code === NO_ROWS_RETURNED) {
            console.log("No character found");
            audio.src = Music.Default;
            return;
          }

          throw fetchCharacterError;
        }

        // console.log({ characterWithAbilities });

        // currently causes an error when user has not interacted with the
        //  document
        if (characterWithAbilities.fighting) {
          switchAudioSource(audio, Music.Battle);
        } else {
          switchAudioSource(audio, Music.Default);
        }

        setCharacter(characterWithAbilities);
      }

      fetchCharacter(currentUser.id);
    },
    [currentUser.id]
  );

  useEffect(
    function () {
      // console.log({ character });

      if (!character) {
        // console.log("new char");
        setScene(Scene.NewCharacter);
      } else if (character.fighting) {
        // console.log("fighting");
        setScene(Scene.Battle);

        // TODO: the following is probably bad... fix this when you have the time
        // this is done to appease the typescript type checker
        return () => {};
      } else {
        console.log("char sheet");

        // o: to capture the realtime event where a fight is initiated with your current character
        const fightInitiatorChannel = supabase.channel(`fight initiation`).on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "fights",
            filter: `player2_id=eq.${character.id}`,
          },
          async (payload: RealtimePostgresInsertPayload<Tables<"fights">>) => {
            console.log(`fight initiation`, payload);
            setScene(Scene.Battle);
          }
        );

        fightInitiatorChannel.subscribe();

        setScene(Scene.CharacterSheet);

        return () => fightInitiatorChannel.unsubscribe();
      }
    },
    [character?.id]
  );

  useEffect(
    function () {
      switch (scene) {
        case Scene.NewCharacter:
          setComponent(<NewCharacter />);
          break;
        case Scene.CharacterSheet:
          setComponent(<CharacterSheet />);
          break;
        case Scene.Beef:
          setComponent(<Beef />);
          break;
        case Scene.Battle:
          if (!character) {
            console.error(new Error("Character is not defined"));
            return;
          }

          async function fetchFight(
            characterId: CharacterWithAbilities["id"],
            callback: (fight: FightWithPlayers | null) => void
          ): Promise<void> {
            const { data: fightWithPlayers, error: fetchFightError } =
              await supabase
                .from("fights")
                .select(
                  "*, player1: player1_id(*, ability1: ability_1_id(*), ability2: ability_2_id(*), ability3: ability_3_id(*)), player2: player2_id(*, ability1: ability_1_id(*), ability2: ability_2_id(*), ability3: ability_3_id(*))"
                )
                .or(`player1_id.eq.${characterId},player2_id.eq.${characterId}`)
                .eq("game_over", false)
                .returns<FightWithPlayers[]>()
                .single();

            if (fetchFightError) {
              if (fetchFightError.code === NO_ROWS_RETURNED) {
                setFight(null);
                callback(null);
                return;
              }

              throw fetchFightError;
            }

            // console.log({ fightWithPlayers });

            setFight(fightWithPlayers);

            callback(fightWithPlayers);
          }

          fetchFight(character.id, function (newFight) {
            // console.log({ newFight });

            if (!newFight) {
              console.error(
                new Error(
                  `There is no fight associated with character with id of "${character.id}"`
                )
              );
              return;
            } else {
              // console.log("setComponent");
              setComponent(
                <Battle fight={newFight} characterId={character.id} />
              );
            }
          });
      }
    },
    [scene]
  );

  useEffect(
    function () {
      // console.log("Loading");
      setLoading(false);
    },
    [component]
  );

  return loading ? "LOADING" : component;
}
