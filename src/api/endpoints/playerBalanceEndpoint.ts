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
    baseUrl?: string = "http://192.168.88.138:5002";
    method: "GET" | "POST" = "GET";
    path: string = `/HubApi/Game/PlayerInCoinBalances`;
}