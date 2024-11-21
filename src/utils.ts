import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/supabase";

const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } = import.meta.env;

export const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_KEY
);

export function switchAudioSource(audio: HTMLMediaElement, src: string) {
  audio.pause();
  audio.src = src;
  audio.load();
}
