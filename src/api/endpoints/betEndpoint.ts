//put this in a game (e.g. fruits slot)
//all the endpoints must be declared in the 'endpoints' file or folder

import { Endpoint } from "../api.ts";

export interface BetResult {
  isWin: boolean;
  totalWinningAmount: number;
  coinId: string;
  combination: number[][];
  winningLines: number[];
}

export class BetEndpoint extends Endpoint<
  BetResult,
  { query: { betPriceId : number; } }
> {
  constructor(betPriceId : number) {
    super({ query: { betPriceId : betPriceId } });
  }
  baseUrl?: string;
  method: "GET" | "POST" = "POST";
  path: string = "/GreekSlotApi/Game/PlayGreekSlot";
}
