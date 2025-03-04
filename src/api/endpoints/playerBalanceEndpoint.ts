import {Endpoint} from "../api.ts";

export type PlayerBalance = {
    balance: {
        amount : number;
        coin : string;
        id : number;
        promotionId: number;
    }
};


export class PlayerBalanceEndpoint extends Endpoint<PlayerBalance, undefined> {
    constructor() {
        super(undefined);
    }
    baseUrl?: string = "https://st-hubapi.onaim.io";
    method: "GET" | "POST" = "GET";
    path: string = `/HubApi/Game/PlayerInCoinBalances`;
}