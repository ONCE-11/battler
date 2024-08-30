import { useEffect } from "react";
import { supabase } from "../utils";
import { Database } from "../types/supabase";
import Title from "./Title";
import Button from "./Button";
import { atom, useAtom, useSetAtom, useAtomValue } from "jotai";
import { currentUserAtom, messageAtom } from "../state";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const itemsAtom = atom<Database["public"]["Tables"]["items"]["Row"][]>([]);
const pesosAtom =
  atom<Database["public"]["Tables"]["profiles"]["Row"]["pesos"]>(0);
const characterIdAtom =
  atom<Database["public"]["Tables"]["characters"]["Row"]["id"]>("");

const Bodega = () => {
  const [items, setItems] = useAtom(itemsAtom);
  const [pesos, setPesos] = useAtom(pesosAtom);
  const [characterId, setCharacterId] = useAtom(characterIdAtom);
  const setMessage = useSetAtom(messageAtom);
  const currentUser = useAtomValue(currentUserAtom);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("items").select();

      if (error) throw error;

      setItems(data);
    };

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("pesos")
        .eq("user_id", currentUser!.id)
        .single();

      if (error) throw error;

      setPesos(data.pesos);
    };

    const fetchCharacter = async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", currentUser!.id)
        .eq("alive", true)
        .single();

      if (error) throw error;

      setCharacterId(data.id);
    };

    try {
      fetchItems();
      fetchProfile();
      fetchCharacter();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleClick = async (
    _: React.MouseEvent<HTMLButtonElement>,
    itemId: string
  ) => {
    const {
      data: { remainingPesos },
      error,
    } = await supabase.functions.invoke("buyItem", {
      body: { characterId, itemId, userId: currentUser!.id },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setPesos(remainingPesos);
  };

  return (
    <>
      <Title className="flex justify-between items-end">
        <div>
          <FontAwesomeIcon icon="store" /> <span>Bodega</span>
        </div>
        <span className="inline-block text-right text-xl py-2 pr-2 border-t">
          <span className="text-green-900">{pesos}</span> ch
        </span>
      </Title>
      <table className="w-full">
        <tbody>
          {items.map(({ name, description, price, id }, index) => (
            <tr key={index}>
              <td className="capitalize py-4">{name}</td>
              <td>{description}</td>
              <td>{price}</td>
              <td className="text-right">
                <Button
                  text="cop"
                  handleClick={(e) => handleClick(e, id)}
                  disabled={pesos < price}
                >
                  <FontAwesomeIcon icon={["fas", "money-check-dollar"]} />{" "}
                  <span>Cop</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Bodega;
