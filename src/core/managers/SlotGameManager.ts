import { BaseGameManager } from "./BaseGameManager.ts";
import { Api } from "../../api/api.ts"; // API PACKAGE
import {
  GameInitData,
  InitialDataEndpoint,
} from "../../api/endpoints/initialDataEndpoint.ts"; // API PACKAGE
import { IUI } from "../../ui/html/interfaces/UI.ts"; // UI PACKAGE
import { GameView } from "../game/GameView.ts";
import { HtmlUI } from "../../ui/html"; // UI PACKAGE
import { PlayerBalanceEndpoint } from "../../api/endpoints/playerBalanceEndpoint.ts";
import { BetEndpoint, BetResult } from "../../api/endpoints/betEndpoint.ts";
import { AudioManager } from "./AudioManager.ts";

interface ISlotGameManagerInstance {
  gameContainer: HTMLElement;
  uiContainer: HTMLElement;
}

enum SpinButtonState {
  IDLE = "idle",
  SPINNING = "spinning",
  DISABLED = "disabled",
}

export class SlotGameManager extends BaseGameManager {
  private static instance: SlotGameManager;
  private state: SpinButtonState = SpinButtonState.IDLE;
  private ui!: IUI;
  private responseData?: BetResult = undefined;

  private constructor() {
    super();
  }

  private registerListeners(): void {
    this.gameView.board.eventEmitter.on("reset", () => {
      this.isReadyToStart = true;
      this.setState(SpinButtonState.IDLE);
      this.ui.updateSpinButton(SpinButtonState.IDLE);
    });
    this.eventEmitter.on("spin-button-click", () => this.startPlay());
    this.eventEmitter.on("send-bet-option", (betOption) =>
      this.setGetSelectedBetOption(betOption)
    );
    this.eventEmitter.on("toggle-sound", () => {
      this.handleSoundButton();
    });
    this.eventEmitter.on("toggle-nav-section", () =>
      this.audioManager.playSound("uiOtherButtons")
    );
    this.eventEmitter.on("toggle-bet-section", () =>
      this.audioManager.playSound("uiOtherButtons")
    );
    this.gameView.board.eventEmitter.on("reelFinishedSpin", () => {
      console.log(this.counterForReelDrop)
      if(this.counterForReelDrop == 3){
         this.audioManager.playSound("stopSpin")
        this.counterForReelDrop = 0;
      }else{
        this.delayTimer !== null && this.audioManager.playSound("reelDrop");
        this.audioManager.stopSound("drySpin");
        this.counterForReelDrop += 1;
      }
    });
  }

  public static async createInstance(
    options: ISlotGameManagerInstance
  ): Promise<SlotGameManager> {
    if (!this.instance) {
      this.instance = new SlotGameManager();
      await this.instance.init(options.gameContainer, options.uiContainer);
    }
    return this.instance;
  }

  private async init(
    GameContainer: HTMLElement,
    UIContainer: HTMLElement
  ): Promise<void> {
    console.log();
    await this.createGame(GameContainer);
    await this.gameView.setup(true);
    this.gameView.showLoadingScreen();
    this.ui = HtmlUI.getInstance();
    this.ui.initialize(UIContainer);

    // //@ts-ignore
    // if (initialData.error || initialData!.data.Succeeded === false) {
    //   //this.ui.showNotification(initialData.error, "dada");
    //   return;
    //   //@ts-ignore
    // }

    const balanceData = await this.getPlayerBalance();

    this.setBalance(balanceData.balance);

    // Wait for assets to load (Game assets)
    await this.gameView.startLoadingAssets();
    this.gameView.hideLoadingScreen();
    this.gameView.showGame();
    this.audioManager = AudioManager.createInstance(GameAssets.music);
    // await new Promise(resolve => setTimeout(resolve, 1000));

    this.initialData = await this.getInitialData();
    this.selectedBetOption = this.initialData!.betPrices[0];

    // DRAW UI
    this.ui.setEventEmitter(this.eventEmitter);
    this.registerListeners();
    this.ui.showUI();
    this.ui.setBalance(this.balance.amount);
    this.ui.setBetOptions(this.initialData.betPrices);
  }

  //@ts-ignore
  private getState(): string {
    return this.state;
  }

  private async createGame(GameContainer: HTMLElement): Promise<void> {
    this.gameView = new GameView(GameContainer);
  }

  private canMakeBet(): boolean {
    return (
      this.balance.amount > 0 &&
      this.balance.amount >= this.selectedBetOption.betAmount
    );
  }

  // private stopPlay(): void {
  //   this.gameView.stopSpin(true, this.responseData?.combination, [
  //     (this.responseData as BetResult).winningLines,
  //   ]);
  //   this.ui.updateSpinButton(SpinButtonState.IDLE);
  //   this.setState(SpinButtonState.IDLE);
  //   this.isResponseReceived = false;
  //   this.handleResult(this.responseData as BetResult);
  // }

  public async startPlay(): Promise<void> {
    if (!this.canMakeBet()) {
        this.ui.updateSpinButton(SpinButtonState.DISABLED);
        this.ui.showNotification("Error", "Not enough balance!");
        setTimeout(() => {
          this.ui.updateSpinButton(SpinButtonState.IDLE);
          this.ui.hideNotification()
        }, 2000)
      return;
    }

    // if (this.state === SpinButtonState.SPINNING) return;

    if (this.isResponseReceived) {
      //@ts-ignore
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
      await this.handleResult(this.responseData as BetResult);
      return;
    }

    this.ui.hideWinPopUp();

    this.setState(SpinButtonState.SPINNING);
    this.ui.updateSpinButton(SpinButtonState.SPINNING);
    this.gameView.startSpin();
    setTimeout(() => this.audioManager.playSound("drySpin"), 250)
    this.setBalance({
      ...this.balance,
      amount: this.balance.amount - this.selectedBetOption.betAmount,
    });

    this.ui.setBalance(this.balance.amount);

    this.responseData = await Api.call(
      BetEndpoint,
      this.selectedBetOption.betPriceId
    );

    console.log('data')
    this.isResponseReceived = true;
    await new Promise(resolve =>
        this.delayTimer = setTimeout(async () => {
          console.log("delayTimer")
          await this.handleResult(this.responseData as BetResult);
          resolve(0);
        }, this.delayTime * 1000)
    );
  }

  public async handleResult(result: BetResult) {
    console.log('handleResult Method');
    // Act for two action, Stopped with click & Stopped with  itself
    this.gameView.stopSpin(this.delayTimer === null, this.responseData?.combination, [
      this.responseData?.winningLines || [],
    ]);
    if (result.isWin) {
      setTimeout(() => {
        this.ui.showWinPopUp(result.totalWinningAmount, result.coinId);
        this.audioManager.playSound("win");
      }, 500)
    }
    this.isResponseReceived = false;
    await this.getPlayerBalance();
    this.ui.setBalance(this.balance.amount);
  }

  setState(newState: SpinButtonState): void {
    this.state = newState;
    // eventBus.emit(SlotEventKey.STATE_CHANGE, this.state);
  }

  public async getPlayerBalance(): Promise<any> {
    return await Api.call(PlayerBalanceEndpoint);
  }

  async getInitialData(): Promise<GameInitData> {
    return await Api.call(InitialDataEndpoint);
  }

  private handleSoundButton(): void {
    if (this.audioManager.isBackgroundPlaying) {
      this.audioManager.stopBackgroundMusic();
      this.ui.updateSoundButtonImage(false); // Update UI
    } else {
      this.audioManager.playBackgroundMusic();
      this.ui.updateSoundButtonImage(true); // Update UI
    }
  }
}
