import { eventBus } from "./helper/events.ts";
import {EventEmitter} from "events";
import {GameView} from "../game/GameView.ts";
import {AudioManager} from "./AudioManager.ts";

interface Balance {
    id: number;
    amount: number;
    coin: string;
    promotionId: number;
}

export interface IBaseGameManager {
    balance: Balance;

    getBalance(): Balance;

    setBalance(balance: Balance): void;

    startPlay(): void;

    handleResult(result: any): void;

    getInitialData(InitialDataEndpoint: any): void;

    setGetSelectedBetOption(selectedBetOption: any): void;
}

export interface IBetOption {
    betPriceId: number;
    betAmount: number;
    multiplier: number;
    coin: string;
}

export abstract class BaseGameManager implements IBaseGameManager {
    public balance!: Balance;
    protected initialData: any = {};
    protected selectedBetOption!: IBetOption;
    protected gameView!: GameView;
    protected audioManager: AudioManager = AudioManager.createInstance();
    protected eventEmitter: EventEmitter = eventBus;

    public setGetSelectedBetOption(selectedBetOption: any): void {
        this.selectedBetOption = selectedBetOption;
    }

    public getBalance(): Balance {
        return this.balance;
    }

    public setBalance(amount: Balance): void {
        this.balance = amount;
    }

    abstract startPlay(): void;

    abstract handleResult(result: any): void;

    abstract getInitialData(): Promise<any>;
}
