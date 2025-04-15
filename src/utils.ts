import { createClient } from "@supabase/supabase-js";
import { Database, Tables } from "./types/supabase";
import { CharacterWithAbilities } from "./types/custom";
import { characterAtom } from "./atoms";

const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY, VITE_ENV } = import.meta.env;

let globalSupabaseHeaders;

export const ngrokTunnelHeaders = {
  "ngrok-skip-browser-warning": "true",
};

if (VITE_ENV === "development") {
  globalSupabaseHeaders = { ...ngrokTunnelHeaders };
} else {
  globalSupabaseHeaders = {};
}

export const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_KEY,
  {
    global: {
      headers: globalSupabaseHeaders,
    },
  }
);

export async function fetchImage(
  imageUrl: string,
  callback: (imageBlob: Blob) => void
) {
  const response = await fetch(imageUrl, {
    headers: { ...ngrokTunnelHeaders },
  });

  callback(await response.blob());
}

export async function getCharacter(userId: string) {
  const { data, error } = await supabase
    .from("characters")
    .select(
      "*, ability1:ability_1_id (*), ability2:ability_2_id (*), ability3:ability_3_id (*)"
    )
    .eq("user_id", userId)
    .eq("alive", true)
    .returns<CharacterWithAbilities[]>()
    .single();

  if (error) console.error(error);

  return data;
}
