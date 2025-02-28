import { Api } from "./api/api";
import { BetEndpoint } from "./api/endpoints/betEndpoint";
import { InitialDataEndpoint } from "./api/endpoints/initialDataEndpoint";
import { PlayerBalanceEndpoint } from "./api/endpoints/playerBalanceEndpoint";

export function mockServer() {
  Api.mock(InitialDataEndpoint, async () => {
    return {
      betPrices: [
        {
          betAmount: 1,
          betPriceId: 1,
          coin: "MockCoin",
          multiplier: 1,
        },
        {
          betAmount: 2,
          betPriceId: 2,
          coin: "MockCoin",
          multiplier: 2,
        },
        {
          betAmount: 3,
          betPriceId: 3,
          coin: "MockCoin",
          multiplier: 3,
        },
        {
          betAmount: 4,
          betPriceId: 4,
          coin: "MockCoin",
          multiplier: 4,
        },
      ],
    };
  });

  Api.mock(PlayerBalanceEndpoint, async () => {
    return {
      balance: {
        amount: 100,
        coin: "MockCoin",
        id: 1,
        promotionId: 1,
      },
    };
  });

  Api.mock(BetEndpoint, async () => {
    return {
      coinId: "Gold",
      isWin: true,
      combination: [
        [7, 7, 7],
        [1, 2, 3],
        [7, 6, 5],
      ],
      totalWinningAmount: 10,
      winningLines: [2, 2, 2],
    };
  });
}
