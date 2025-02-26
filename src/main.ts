import {SlotGameManager} from "./core/managers/SlotGameManager.ts";
import {setupEndpoints} from "./api/endpoints";

// tests
(async () => {
    setupEndpoints()
    const GameContainer = document.getElementById("game-container") as HTMLElement;
    const UIContainer = document.getElementById("game-ui") as HTMLElement;

    // BOSS
    await SlotGameManager.createInstance(GameContainer, UIContainer);
})();