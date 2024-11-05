/// <reference types="vite/client" />
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { fightWithPlayersMock } from "./db";

const { VITE_SUPABASE_URL } = import.meta.env;

export const server = setupServer(
  http.get(`${VITE_SUPABASE_URL}/rest/v1/fights*`, () =>
    HttpResponse.json(fightWithPlayersMock)
  ),
  http.get(`${VITE_SUPABASE_URL}/realtime/v1/websocket*`, () =>
    HttpResponse.json(true)
  )
  // http.get(`${VITE_SUPABASE_URL}/rest/v1/characters*`, () => {
  //   characterMock.fighting = true;
  //   return HttpResponse.json(characterMock);
  // })
);
