import { Endpoint } from "../api.ts";

export type BetDataResponseType = {
  prizeId: number;
  prizeValue: number;
  coin: string;
};

export class BetDataEndpoint extends Endpoint<
  BetDataResponseType,
  { query: { betPriceId: number } }
> {
  constructor(betPriceId: number) {
    super({ query: { betPriceId: betPriceId } });
  }
  baseUrl?: string;
  method: "GET" | "POST" = "POST";
  path: string = `/Game/PlaceBet`;
}
