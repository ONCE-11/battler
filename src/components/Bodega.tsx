import { useEffect } from "react";
import { supabase } from "../utils";
import { Database } from "../types/supabase";
import Title from "./Title";
import Button from "./Button";
import { atom, useAtom, useSetAtom, useAtomValue } from "jotai";
import { currentUserAtom, messageAtom } from "../state";

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

      if (error) {
        console.error(error);
        setMessage({ type: "error", text: error.message });
        return;
      }

      setItems(data);
    };

    const fetchProfile = async () => {
      if (!currentUser) return;

      console.log({ currentUser });

      const { data, error } = await supabase
        .from("profiles")
        .select("pesos")
        .eq("user_id", currentUser.id)
        .single();

      if (error) {
        console.error(error);
        setMessage({ type: "error", text: error.message });
        return;
      }

      setPesos(data.pesos);
    };

    const fetchCharacter = async () => {
      console.log({ currentUserId: currentUser!.id });

      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", currentUser!.id)
        .single();

      if (error) {
        console.error(error);
        setMessage({ type: "error", text: error.message });
        return;
      }

      console.log({ data });

      setCharacterId(data.id);
    };

    fetchItems();
    fetchProfile();
    fetchCharacter();
  }, []);

  const handleClick = async (
    _: React.MouseEvent<HTMLButtonElement>,
    itemId: string
  ) => {
    if (!currentUser) return;

    const {
      data: { remainingPesos },
      error,
    } = await supabase.functions.invoke("buyItem", {
      body: { characterId, itemId, userId: currentUser.id },
    });

    console.log(remainingPesos);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setPesos(remainingPesos);
  };

  return (
    <>
      <Title className="flex justify-between items-end">
        <span>Bodega</span>
        <span className="inline-block text-right text-xl py-2 pr-2 border-t">
          <span className="text-green-900">{pesos}</span> ch
        </span>
      </Title>
      <table className="w-full">
        <tbody>
          {items.map(({ name, description, price, id }, index) => (
            <tr key={index}>
              <td className="capitalize">{name}</td>
              <td>{description}</td>
              <td>{price}</td>
              <td className="text-right">
                <Button text="cop" handleClick={(e) => handleClick(e, id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="border-t-black border-t mt-4 pt-4">{pesos} CH</div> */}
    </>
  );
};

export default Bodega;
