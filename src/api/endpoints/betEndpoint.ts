//put this in a game (e.g. fruits slot)
//all the endpoints must be declared in the 'endpoints' file or folder

import { Endpoint } from "../api.ts";

export type BetResult = {
  winAmount: number;
  coin: string;
};

export class BetEndpoint extends Endpoint<
  BetResult,
  { query: { betOptionId: number; coin: string } }
> {
  constructor(betaOptionId: number, coin: string) {
    super({ query: { betOptionId: betaOptionId, coin: coin } });
  }
  baseUrl?: string = undefined;
  method: "GET" | "POST" = "GET";
  path: string = "/bet";
}

//initialData
//bet
//balace
