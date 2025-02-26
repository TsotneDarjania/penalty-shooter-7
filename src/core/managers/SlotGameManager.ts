import {BaseGameManager} from "./BaseGameManager.ts";
import {SpinButtonState} from "../../ui/html/enums"; // UI PACKAGE
import {Api} from "../../api/api.ts"; // API PACKAGE
import {InitialDataEndpoint} from "../../api/endpoints/initialDataEndpoint.ts"; // API PACKAGE
import {IUI} from "../../ui/html/interfaces/UI.ts"; // UI PACKAGE
import {GameView} from "../game/GameView.ts";
import {HtmlUI} from "../../ui/html"; // UI PACKAGE
import {PlayerBalanceEndpoint} from "../../api/endpoints/playerBalanceEndpoint.ts";
import {BetEndpoint} from "../../api/endpoints/betEndpoint.ts";


interface ISlotGameManagerInstance {
    gameContainer: HTMLElement;
    uiContainer: HTMLElement;
}

export interface BetResult {
    isWin: boolean;
    totalWinningAmount: number;
    coinId: string;
    combination: number[][];
    winningLines: number[];
}


export class SlotGameManager extends BaseGameManager {
    private static instance: SlotGameManager;
    private state: SpinButtonState = SpinButtonState.IDLE;
    private ui!: IUI;

    private constructor() {
        super();

        this.eventEmitter.on("spin-button-click", () => this.startPlay())
        this.eventEmitter.on("send-bet-option", (betOption) => this.setGetSelectedBetOption(betOption));
        this.eventEmitter.on("toggle-sound", () => this.handleSoundButton());
    }

    public static async createInstance(options: ISlotGameManagerInstance): Promise<SlotGameManager> {
        if (!this.instance) {
            this.instance = new SlotGameManager();
            await this.instance.init(options.gameContainer, options.uiContainer);
        }
        return this.instance;
    }

    private async init(GameContainer: HTMLElement, UIContainer: HTMLElement): Promise<void> {
        await this.createGame(GameContainer);
        await this.gameView.setup(true);
        this.gameView.showLoadingScreen();

        const initialData: {
            betPrices: any
        } = await this.getInitialData();

        await this.getPlayerBalance();

        // Wait for assets to load (Game assets)
        await this.gameView.startLoadingAssets();
        this.gameView.hideLoadingScreen();
        this.gameView.showGame();
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // this.gameView.hideLoadingScreen();

        this.initialData = initialData;
        this.selectedBetOption = initialData.betPrices[0];

        // DRAW UI
        this.ui = HtmlUI.getInstance();
        this.ui.setEventEmitter(this.eventEmitter);
        this.ui.initialize(UIContainer);
        this.ui.setBalance(this.balance.amount);
        this.ui.setBetOptions(this.initialData.betPrices);
    }

    //@ts-ignore
    private getState(): string {
        return this.state;
    }

    public soundHandler() {
        this.audioManager.isPlaying ? this.audioManager.stopMusic() : this.audioManager.playMusic();
    }

    private async createGame(GameContainer: HTMLElement): Promise<void> {
        this.gameView = new GameView(GameContainer);
    }

    public async startPlay(): Promise<void> {
        this.gameView.startSpin();
        if(this.balance.amount === 0) return;
        const data: BetResult = await Api.call(BetEndpoint, this.selectedBetOption.betPriceId);
        console.log(data)
        this.gameView.stopSpin(false, data.combination || [], [[...data.winningLines]]);
        await new Promise(resolve => setTimeout(resolve, 1000));
        if(data.isWin){
            this.ui.showWinPopUp(data.totalWinningAmount, data.coinId)
        }
        await this.getPlayerBalance();
        this.ui.setBalance(this.balance.amount);
    }

    setState(newState: SpinButtonState): void {
        this.state = newState;
        // eventBus.emit(SlotEventKey.STATE_CHANGE, this.state);
    }

    public async getPlayerBalance(): Promise<void> {
        const balanceData: any = await Api.call(PlayerBalanceEndpoint);
        this.setBalance(balanceData.balance);
    }

    async getInitialData(): Promise<any> {
        return await Api.call(InitialDataEndpoint);
    }

    public handleResult(result: any) {
        console.log(result);
        // Send to game
        // Send to UI
        // -- update balance
        // spin state change
    }

    private handleSoundButton(): void {
        console.log(this.audioManager)
        if (this.audioManager.isPlaying) {
            console.log("SlotGameManager: Stopping music");
            this.audioManager.stopMusic();
            this.ui.updateSoundButtonImage(false); // Update UI
        } else {
            console.log("SlotGameManager: Playing music");
            this.audioManager.playMusic();
            this.ui.updateSoundButtonImage(true); // Update UI
        }
    }
}
