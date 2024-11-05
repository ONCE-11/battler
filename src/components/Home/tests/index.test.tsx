import { beforeEach, describe, expect, it } from "vitest";
import { screen, render } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import {
  characterAtom,
  currentUserAtom,
  loadingAtom,
  loggedInAtom,
} from "../../../atoms";
import Home from "..";
import { characterMock, currentUserMock } from "../../../../mocks/db";

describe("Home", function () {
  const store = createStore();

  it("should display intructions when logged out", function () {
    store.set(loggedInAtom, false);

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    expect(screen.getByText("How to Play")).toBeInTheDocument();
  });

  describe("logged in", function () {
    beforeEach(function () {
      store.set(currentUserAtom, currentUserMock);
      store.set(loggedInAtom, true);
      store.set(loadingAtom, false);
    });

    it("should display new character when character does not exist", function () {
      render(
        <Provider store={store}>
          <Home />
        </Provider>
      );

      expect(screen.getByText("New Character")).toBeInTheDocument();
    });

    it("should display character sheet when character does exist", function () {
      store.set(characterAtom, characterMock);

      render(
        <Provider store={store}>
          <Home />
        </Provider>
      );

      expect(screen.getByText(characterMock.name)).toBeInTheDocument();
    });
  });
});
