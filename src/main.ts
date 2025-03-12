import { setupEndpoints } from "./api/endpoints";
import { PenaltyGameManager } from "./core/managers/PenaltyGameManager";
// import { mockServer } from "./mock.ts";

(async () => {
  // mockServer();

  setupEndpoints();

  const GameContainer: HTMLElement = document.getElementById(
    "game-container"
  ) as HTMLElement;
  const UIContainer: HTMLElement = document.getElementById(
    "game-ui"
  ) as HTMLElement;

  // BOSS 😎
  await PenaltyGameManager.createInstance({
    gameContainer: GameContainer,
    uiContainer: UIContainer,
  });
})();
