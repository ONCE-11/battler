import { useEffect, useState } from "react";
import { supabase } from "../utilities";
import { Database } from "../types/supabase";
import Title from "./Title";
import { useMessage } from "./context/MessageContext";
import Button from "./Button";
import { useAuth } from "./context/AuthContext";

const Bodega = () => {
  const [items, setItems] = useState<
    Database["public"]["Tables"]["items"]["Row"][]
  >([]);
  const [pesos, setPesos] =
    useState<Database["public"]["Tables"]["profiles"]["Row"]["pesos"]>(0);

  const [characterId, setCharacterId] =
    useState<Database["public"]["Tables"]["characters"]["Row"]["id"]>("");
  const { setMessage } = useMessage()!;
  const { currentUser } = useAuth()!;

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("items").select();

      if (error) {
        console.error(error);
        setMessage({ type: "error", text: error.message });
        return;
      }

      // console.log({ data });

      setItems(data);
    };

    const fetchProfile = async () => {
      if (currentUser === null) return;

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

      // console.log({ data });

      // console.log({ currentUser });

      setPesos(data.pesos);
    };

    const fetchCharacter = async () => {
      if (currentUser === null) return;

      console.log({ currentUserId: currentUser.id });

      const { data, error } = await supabase
        .from("characters")
        .select()
        .eq("user_id", currentUser.id)
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

    const { data, error } = await supabase.functions.invoke("buyItem", {
      body: { characterId, itemId, userId: currentUser.id },
    });
    console.log(data);

    if (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  supabase
    .channel("changes")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "profiles",
        // filter: 'body=eq.hey',
      },
      ({ new: { pesos } }): void => {
        // console.log(pesos);
        setPesos(pesos);
      }
    )
    .subscribe();

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
