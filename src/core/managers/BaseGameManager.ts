import { eventBus } from "./helper/events.ts";
import { EventEmitter } from "events";
import { GameView } from "../game/GameView.ts";
import { AudioManager } from "./AudioManager.ts";
import {GameInitData} from "../../api/endpoints/initialDataEndpoint.ts";
import {Balance} from "./interfaces";

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
  protected isResponseReceived: boolean = false; // optional
  protected initialData!: GameInitData;
  protected selectedBetOption!: IBetOption;
  protected gameView!: GameView;
  protected audioManager!: AudioManager;
  protected eventEmitter: EventEmitter = eventBus;

  public setGetSelectedBetOption(selectedBetOption: any): void {
    this.selectedBetOption = selectedBetOption;
  }

  public getBalance(): Balance {
    return this.balance;
  }

  protected handleApiResponse<T extends object>(
      response: T | { error: string },
  ): T | null {
    console.log(response);
      return response as T; // Return valid data
  }

  public setBalance(balance: Balance): void {
    this.balance = balance;
  }

  abstract startPlay(): void;

  abstract handleResult(result: any): void;

  abstract getInitialData(): Promise<any>;
}
