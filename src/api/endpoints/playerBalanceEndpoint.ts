import {Endpoint} from "../api.ts";

export type GameInitData = {
    betPrices: Array<{
        betPriceId: number;
        betAmount: number;
        multiplier: number;
        coin: string;
    }>;
};


export class PlayerBalanceEndpoint extends Endpoint<GameInitData, undefined> {
    constructor() {
        super(undefined);
    }
    baseUrl?: string = "http://192.168.88.138:5002";
    method: "GET" | "POST" = "GET";
    path: string = `/HubApi/Game/PlayerInCoinBalances`;
}