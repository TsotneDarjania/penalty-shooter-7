import { Endpoint } from "../api.ts";

export type PlayerBalance = {
  balance: {
    amount: number;
    coin: string;
    id: number;
    promotionId: number;
  };
};

export class PlayerBalanceEndpoint extends Endpoint<PlayerBalance, undefined> {
  constructor() {
    super(undefined);
  }
  baseUrl?: string = import.meta.env.VITE_API_BALANCE_URL;
  method: "GET" | "POST" = "GET";
  path: string = `/Game/PlayerInCoinBalances`;
}
