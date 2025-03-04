import { SlotGameManager } from "./core/managers/SlotGameManager.ts";
import { setupEndpoints } from "./api/endpoints";
import {mockServer} from "./mock.ts";

(async () => {
  mockServer();
  setupEndpoints();

  const GameContainer: HTMLElement = document.getElementById(
    "game-container"
  ) as HTMLElement;
  const UIContainer: HTMLElement = document.getElementById(
    "game-ui"
  ) as HTMLElement;

  // BOSS 😎
  await SlotGameManager.createInstance({
    gameContainer: GameContainer,
    uiContainer: UIContainer,
  });
})();
