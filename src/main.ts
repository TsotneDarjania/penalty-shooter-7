import {SlotGameManager} from "./core/managers/SlotGameManager.ts";
import {setupEndpoints} from "./api/endpoints";
import {Api, Endpoint} from "./api/api.ts";
import {BetEndpoint, BetResult} from "./api/endpoints/betEndpoint.ts";
import {PlayerBalanceEndpoint} from "./api/endpoints/playerBalanceEndpoint.ts";

Api.mock(BetEndpoint, async () => {
    let resultOptions: BetResult[] = [
        {
            winningLines: [1],
            combination: [
                [0, 2, 1],
                [3, 2, 2],
                [0, 2, 4],
            ],
            coinId: 'Gold',
            isWin: true,
            totalWinningAmount: 2
        },
        {
            winningLines: [1],
            combination: [
                [0, 3, 1],
                [3, 3, 2],
                [0, 3, 4],
            ],
            coinId: 'Silver',
            isWin: true,
            totalWinningAmount: 2
        },
        {
            winningLines: [],
            combination: [
                [0, 3, 1],
                [3, 0, 2],
                [0, 3, 4],
            ],
            coinId: 'none',
            isWin: false,
            totalWinningAmount: 0
        },
    ];

    return resultOptions[Math.floor(Math.random() * resultOptions.length)];
});
Api.mock(PlayerBalanceEndpoint, async () => {
    return {
        balance: {
            amount:1,
            coin: 'Gold',
            promotionId: 1,
            id: 1,
        }
    }
});


(async () => {
    setupEndpoints();

    const GameContainer = document.getElementById("game-container") as HTMLElement;
    const UIContainer = document.getElementById("game-ui") as HTMLElement;

    // BOSS 😎
    await SlotGameManager.createInstance({
        gameContainer: GameContainer,
        uiContainer: UIContainer,
    });
})();