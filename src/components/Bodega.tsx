import { useEffect } from "react";
import { supabase } from "../utilities";
import { Database } from "../types/supabase";
import Title from "./Title";
import Button from "./Button";
import useAuth from "./hooks/useAuth";
import { atom, useAtom, useSetAtom } from "jotai";
import { messageAtom } from "../main";

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
  const { currentUser } = useAuth();

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
      if (currentUser === null) return;

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
        .select()
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

    // console.log(itemId);

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
      <Title text="Bodega" />
      <table className="w-full">
        <tbody>
          {items.map(({ name, description, price, id }, index) => (
            <tr key={index}>
              <td className="capitalize">{name}</td>
              <td>{description}</td>
              <td>{price} P</td>
              <td>
                <Button text="Buy" handleClick={(e) => handleClick(e, id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t-black border-t mt-4 pt-4">PESOS: {pesos}</div>
    </>
  );
};

export default Bodega;
