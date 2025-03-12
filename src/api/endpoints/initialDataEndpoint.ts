import { Endpoint } from "../api.ts";

export type GameInitData = {
  hasActiveGame: boolean;
  gameConfigInfo: {
    betPrices: Array<betType>;
    kicksCount: number;
  };
  activeGameInfo: null | {
    betPriceId: number;
    coin: string;
    currentKickIndex: number;
    goalsScored: number;
    kicksRemaining: number;
    prizeId: number;
    prizeValue: number;
  };
};

export type betType = {
  betPriceId: number;
  betAmount: number;
  multiplier: number;
  coin: string;
};

export class InitialDataEndpoint extends Endpoint<GameInitData, undefined> {
  constructor() {
    super(undefined);
  }
  baseUrl?: string;
  method: "GET" | "POST" = "GET";
  path: string = `/Game/InitialData`;
}
