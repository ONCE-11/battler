// o: this file is a heavy work in progress

import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
// import Game from "../index.tsx";
import { createStore, Provider } from "jotai";
import { currentUserAtom } from "../../../atoms.ts";
import { characterMock, currentUserMock } from "../../../../mocks/db.ts";
import { server } from "../../../../mocks/msw.ts";
import { http, HttpResponse } from "msw";

const { VITE_SUPABASE_URL } = import.meta.env;

describe("Game", async function () {
  const store = createStore();
  let Game: () => JSX.Element | "LOADING" | undefined;

  beforeEach(async function () {
    Game = (await import("../index.tsx")).default;
    store.set(currentUserAtom, currentUserMock);
    // store.set(loadingAtom, true);
  });

  describe("Character does not exist", function () {
    it("should display the new character scene", async function () {
      server.use(
        http.get(`${VITE_SUPABASE_URL}/rest/v1/characters*`, () => {
          return HttpResponse.json(null);
        })
      );
      render(
        <Provider store={store}>
          <Game />
        </Provider>
      );

      expect(screen.getByText("New Character")).toBeInTheDocument();
    });
  });

  describe("Character exists", function () {
    it("should display the character sheet scene when by default when character is not fighting", async function () {
      server.use(
        http.get(`${VITE_SUPABASE_URL}/rest/v1/characters*`, () => {
          characterMock.fighting = false;
          return HttpResponse.json(characterMock);
        })
      );
      render(
        <Provider store={store}>
          <Game />
        </Provider>
      );
      await waitFor(() => {
        expect(screen.getByText("New Character")).toBeInTheDocument();
      });
      const characterNameEl = screen.getByText(characterMock.name);
      // // const characterAttackEl = screen.getByText(
      // //   new RegExp(`.*${characterMock.attack}`)
      // // );
      // // const characterDefenseEl = screen.getByText(
      // //   new RegExp(`.*${characterMock.defense}`)
      // // );
      // // // current health should appear twice since current and max health should
      // // //  be the same value
      // // const characterHealthEls = screen.getAllByText(
      // //   new RegExp(`.*${characterMock.current_health}`)
      // // );
      // // const ability1NameEl = screen.getByText(
      // //   new RegExp(`.*${characterMock.ability1.name}`)
      // // );
      // // const ability2NameEl = screen.getByText(
      // //   new RegExp(`.*${characterMock.ability2.name}`)
      // // );
      // // const ability3NameEl = screen.getByText(
      // //   new RegExp(`.*${characterMock.ability3.name}`)
      // // );
      expect(characterNameEl).toBeInTheDocument();
      // // expect(characterAttackEl).toBeInTheDocument();
      // // expect(characterDefenseEl).toBeInTheDocument();
      // // expect(characterHealthEls.length).toEqual(2);
      // // expect(ability1NameEl).toBeInTheDocument();
      // // expect(ability2NameEl).toBeInTheDocument();
      // // expect(ability3NameEl).toBeInTheDocument();
    });

    it("should display the fighting scene when by default when character is fighting", async function () {
      server.use(
        http.get(`${VITE_SUPABASE_URL}/rest/v1/characters*`, () => {
          characterMock.fighting = true;
          return HttpResponse.json(characterMock);
        })
      );
      render(
        <Provider store={store}>
          <Game />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText("P1's Turn")).toBeInTheDocument();
      });

      expect(
        screen.getByRole("button", { name: characterMock.ability1.name })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: characterMock.ability2.name })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: characterMock.ability3.name })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: characterMock.ability3.name })
      ).toBeInTheDocument();
      // expect(
      //   screen.getByText(
      //     new RegExp(String(fightWithPlayersMock.player2.max_health))
      //   )
      // ).toBeInTheDocument();
    });
    //     // it("should display the character sheet scene when by default when character is not fighting", function () {
    //     //   characterMock.fighting = false;
    //     //   store.set(characterAtom, characterMock);
    //     //   render(
    //     //     <Provider store={store}>
    //     //       <Game />
    //     //     </Provider>
    //     //   );
    //     //   const characterNameEl = screen.getByText(characterMock.name);
    //     //   const characterAttackEl = screen.getByText(
    //     //     new RegExp(`.*${characterMock.attack}`)
    //     //   );
    //     //   const characterDefenseEl = screen.getByText(
    //     //     new RegExp(`.*${characterMock.defense}`)
    //     //   );
    //     //   // current health should appear twice since current and max health should
    //     //   //  be the same value
    //     //   const characterHealthEls = screen.getAllByText(
    //     //     new RegExp(`.*${characterMock.current_health}`)
    //     //   );
    //     //   const ability1NameEl = screen.getByText(
    //     //     new RegExp(`.*${characterMock.ability1.name}`)
    //     //   );
    //     //   const ability2NameEl = screen.getByText(
    //     //     new RegExp(`.*${characterMock.ability2.name}`)
    //     //   );
    //     //   const ability3NameEl = screen.getByText(
    //     //     new RegExp(`.*${characterMock.ability3.name}`)
    //     //   );
    //     //   expect(characterNameEl).toBeInTheDocument();
    //     //   expect(characterAttackEl).toBeInTheDocument();
    //     //   expect(characterDefenseEl).toBeInTheDocument();
    //     //   expect(characterHealthEls.length).toEqual(2);
    //     //   expect(ability1NameEl).toBeInTheDocument();
    //     //   expect(ability2NameEl).toBeInTheDocument();
    //     //   expect(ability3NameEl).toBeInTheDocument();
    //     // });
    //     // it("should display the beef scene when ", function () {
    //     //   store.set(sceneAtom, Scene.Beef);
    //     //   store.set(currentUserAtom, currentUserMock);
    //     //   render(
    //     //     <Provider store={store}>
    //     //       <Game />
    //     //     </Provider>
    //     //   );
    //     //   expect(screen.getByText("Beef")).toBeInTheDocument();
    //     // });
    //     // it("should display the beef scene when scene is set to beef", function () {
    //     //   store.set(sceneAtom, Scene.Beef);
    //     //   store.set(currentUserAtom, currentUserMock);
    //     //   render(
    //     //     <Provider store={store}>
    //     //       <Game />
    //     //     </Provider>
    //     //   );
    //     //   expect(screen.getByText("Beef")).toBeInTheDocument();
    //     // });
    //     // it("should display the battle scene when scene is set to battle", function () {
    //     //   store.set(sceneAtom, Scene.Battle);
    //     //   render(
    //     //     <Provider store={store}>
    //     //       <Game />
    //     //     </Provider>
    //     //   );
    //     //   expect(screen.getByText("P1's Turn")).toBeInTheDocument();
    //     // });
  });
});
