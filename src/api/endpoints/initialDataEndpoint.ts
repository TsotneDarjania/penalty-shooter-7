import {Endpoint} from "../api.ts";

export type GameInitData = {
    betPrices: Array<{
        betPriceId: number;
        betAmount: number;
        multiplier: number;
        coin: string;
    }>;
};


export class InitialDataEndpoint extends Endpoint<GameInitData, undefined> {
    constructor() {
        super(undefined);
    }
    baseUrl?: string;
    method: "GET" | "POST" = "GET";
    path: string = `/EgyptSlotApi/Game/InitialData`;
}