import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Game from "../index.tsx";
import { createStore, Provider } from "jotai";
import { gamePageAtom, characterAtom } from "../../../state.ts";
import { GamePage } from "../../../types/custom.ts";
import { characterMock } from "./character.ts";

describe("Game", async function () {
  it("should display the new character page when no characters exist", function () {
    render(<Game />);

    const heading = screen.getByRole("heading");

    expect(heading.textContent).toEqual("New Character");
  });

  describe("Character exists", function () {
    const store = createStore();

    beforeEach(function () {
      store.set(characterAtom, characterMock);
    });

    it("should display the character sheet when game page is set to character sheet", function () {
      store.set(gamePageAtom, GamePage.CharacterSheet);
      render(
        <Provider store={store}>
          <Game />
        </Provider>
      );

      const heading = screen.getByRole("heading");

      expect(heading.textContent).toEqual("Character");
    });

    it("should display the beef page when game page is set to beef", function () {
      store.set(gamePageAtom, GamePage.Beef);
      render(
        <Provider store={store}>
          <Game />
        </Provider>
      );

      const heading = screen.getByRole("heading");

      expect(heading.textContent).toEqual("Beef");
    });

    it("should display the battle page when game page is set to battle", function () {
      store.set(gamePageAtom, GamePage.Battle);
      render(
        <Provider store={store}>
          <Game />
        </Provider>
      );

      const heading = screen.getByRole("heading");

      expect(heading.textContent).toEqual("Battle");
    });
  });
});
