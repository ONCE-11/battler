import { supabase } from "../utilities";

import { useEffect } from "react";

const Fights = () => {
  // const changes = supabase
  //   .channel("table-filter-changes")
  //   .on(
  //     "postgres_changes",
  //     {
  //       event: "UPDATE",
  //       schema: "public",
  //       table: "profiles",
  //       filter: "id=eq.ede554ef-f3c1-4437-b509-866b3f20dafc",
  //     },
  //     (payload) => console.log(payload)
  //   )
  //   .subscribe();
  // const handleClick = async () => {
  //   console.log("click");
  //   const response = await supabase.functions.invoke("hello", {
  //     body: { name: "Functions" },
  //   });
  //   console.log(response);
  // };
  // return <button onClick={handleClick}>Test Function</button>;

  useEffect(() => {
    const fetchHello = async () => {
      const response = await supabase.functions.invoke("hello", {
        body: { foo: "bar" },
      });
      console.log(response);
    };

    fetchHello();
  }, []);

  return "Fights";
};

export default Fights;
