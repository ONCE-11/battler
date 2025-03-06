import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/supabase";

const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } = import.meta.env;

export const ngrokTunnelHeaders = {
  "ngrok-skip-browser-warning": "true",
};

export const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_KEY,
  {
    global: {
      headers: { ...ngrokTunnelHeaders },
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
