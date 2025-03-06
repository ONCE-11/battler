import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/supabase";

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
