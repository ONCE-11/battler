import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Game from "../index.tsx";
import { createStore, Provider } from "jotai";
import {
  gamePageAtom,
  characterAtom,
  currentUserAtom,
} from "../../../atoms.ts";
import { GamePage } from "../../../types/custom.ts";
import { characterMock, currentUserMock } from "./testUtils.ts";

describe("Game", async function () {
  const store = createStore();

  beforeEach(function () {
    store.set(currentUserAtom, currentUserMock);
  });

  it("should display the new character page when no characters exist", function () {
    render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    expect(screen.getByText("New Character")).toBeInTheDocument();
  });

  describe("Character exists", function () {
    beforeEach(function () {
      store.set(characterAtom, characterMock);
      store.set(currentUserAtom, currentUserMock);
    });

    it("should display the character sheet when game page is set to character sheet", function () {
      store.set(gamePageAtom, GamePage.CharacterSheet);
      render(
        <Provider store={store}>
          <Game />
        </Provider>
      );

      const characterNameEl = screen.getByText(characterMock.name);
      const characterAttackEl = screen.getByText(
        new RegExp(`.*${characterMock.attack}`)
      );
      const characterDefenseEl = screen.getByText(
        new RegExp(`.*${characterMock.defense}`)
      );
      // current health should appear twice since current and max health should
      //  be the same value
      const characterHealthEls = screen.getAllByText(
        new RegExp(`.*${characterMock.current_health}`)
      );
      const ability1NameEl = screen.getByText(
        new RegExp(`.*${characterMock.ability1.name}`)
      );
      const ability2NameEl = screen.getByText(
        new RegExp(`.*${characterMock.ability2.name}`)
      );
      const ability3NameEl = screen.getByText(
        new RegExp(`.*${characterMock.ability3.name}`)
      );

      expect(characterNameEl).toBeInTheDocument();
      expect(characterAttackEl).toBeInTheDocument();
      expect(characterDefenseEl).toBeInTheDocument();
      expect(characterHealthEls.length).toEqual(2);
      expect(ability1NameEl).toBeInTheDocument();
      expect(ability2NameEl).toBeInTheDocument();
      expect(ability3NameEl).toBeInTheDocument();
    });

    it("should display the beef page when game page is set to beef", function () {
      store.set(gamePageAtom, GamePage.Beef);
      store.set(currentUserAtom, currentUserMock);
      render(
        <Provider store={store}>
          <Game />
        </Provider>
      );

      expect(screen.getByText("Beef")).toBeInTheDocument();
    });

    it("should display the battle page when game page is set to battle", function () {
      store.set(gamePageAtom, GamePage.Battle);
      render(
        <Provider store={store}>
          <Game />
        </Provider>
      );

      expect(screen.getByText("Battle")).toBeInTheDocument();
    });
  });
});
