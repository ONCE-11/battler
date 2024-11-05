import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./mocks/msw";

// Start the interception.
beforeAll(() => server.listen());

// Remove any handlers you may have added
// in individual tests (runtime handlers).
afterEach(() => server.resetHandlers());

// Disable request interception and clean up.
afterAll(() => server.close());
