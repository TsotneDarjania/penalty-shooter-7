import {BaseGameManager} from "./BaseGameManager.ts";
import {Api} from "../../api/api.ts"; // API PACKAGE
import {InitialDataEndpoint} from "../../api/endpoints/initialDataEndpoint.ts"; // API PACKAGE
import {IUI} from "../../ui/html/interfaces/UI.ts"; // UI PACKAGE
import {GameView} from "../game/GameView.ts";
import {HtmlUI} from "../../ui/html"; // UI PACKAGE
import {PlayerBalanceEndpoint} from "../../api/endpoints/playerBalanceEndpoint.ts";
import {BetEndpoint} from "../../api/endpoints/betEndpoint.ts";
import {AudioManager} from "./AudioManager.ts";

interface ISlotGameManagerInstance {
    gameContainer: HTMLElement;
    uiContainer: HTMLElement;
}

export interface BetResult {
    data: {
        isWin: boolean;
        totalWinningAmount: number;
        coinId: string;
        combination: number[][];
        winningLines: number[];
    }
}

enum SpinButtonState {
    IDLE = "idle",
    SPINNING = "spinning",
    DISABLED = "disabled"
}

export class SlotGameManager extends BaseGameManager {
    private static instance: SlotGameManager;
    private state: SpinButtonState = SpinButtonState.IDLE;
    private ui!: IUI;
    private responseData: BetResult | null | {
        error?: string
    } = null;

    private constructor() {
        super();
    }

    private registerListeners(): void {
        this.gameView.board.eventEmitter.on('reset', () => {
            this.isReadyToStart = true;
            this.setState(SpinButtonState.IDLE)
            this.ui.updateSpinButton(SpinButtonState.IDLE);
        });
        this.eventEmitter.on("spin-button-click", () => this.startPlay())
        this.eventEmitter.on("send-bet-option", (betOption) => this.setGetSelectedBetOption(betOption));
        this.eventEmitter.on("toggle-sound", () => {
            this.handleSoundButton()
        });
        this.eventEmitter.on("toggle-nav-section", () => this.audioManager.playSound('uiOtherButtons'))
        this.eventEmitter.on("toggle-bet-section", () => this.audioManager.playSound('uiOtherButtons'))
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
        this.ui = HtmlUI.getInstance();
        this.ui.initialize(UIContainer);

        const initialData: {
            data: object,
            error?: string,
        } = await this.handleApiResponse(this.getInitialData());

        if(initialData.error){
            this.ui.showNotification(initialData.error, "dada");
            return;
        }

        const balanceData = await this.getPlayerBalance();

        this.setBalance(balanceData.data.balance);

        // Wait for assets to load (Game assets)
        await this.gameView.startLoadingAssets();
        this.gameView.hideLoadingScreen();
        this.gameView.showGame();
        this.audioManager = AudioManager.createInstance(GameAssets.music);
        // await new Promise(resolve => setTimeout(resolve, 1000));

        this.initialData = initialData.data;
        this.selectedBetOption = this.initialData.betPrices[0];

        // DRAW UI
        this.ui.setEventEmitter(this.eventEmitter);
        this.registerListeners();
        this.ui.showUI();
        this.ui.setBalance(this.balance.amount);
        this.ui.setBetOptions(this.initialData.betPrices);

        if(!this.checkIfPlayerCanBet()) {
            this.ui.updateSpinButton(SpinButtonState.DISABLED);
            return;
        }
    }

    //@ts-ignore
    private getState(): string {
        return this.state;
    }

    private async createGame(GameContainer: HTMLElement): Promise<void> {
        this.gameView = new GameView(GameContainer);
    }

    private checkIfPlayerCanBet(): boolean {
        return this.balance.amount > 0 && this.balance.amount >= this.selectedBetOption.betAmount;
    }

    private stopPlay(): void {
        this.gameView.stopSpin(true, (this.responseData as BetResult).data.combination, [[...(this.responseData as BetResult).data.winningLines]]);
        this.ui.updateSpinButton(SpinButtonState.IDLE);
        this.setState(SpinButtonState.IDLE)
        this.responseData = null;
        this.isResponseReceived = false;
    }

    public async startPlay(): Promise<void> {
        // CASE 1 - როდესაც SPINNING და DATA არ არის მოსული, ღილაკზე დაჭერა მოხდა, ამ დროს რა ხდება
        if(this.state === SpinButtonState.SPINNING) return; // Response არაა მოსული და მოხდა STOP ღილაკზე დაჭერა

        if(this.isResponseReceived) { // Response მოსულია და მოხდა STOP ღილაკზე დაჭერა
            this.stopPlay();
            return;
        }

        this.ui.hideWinPopUp();


        this.setState(SpinButtonState.SPINNING);
        this.ui.updateSpinButton(SpinButtonState.SPINNING);
        this.gameView.startSpin();
        this.setBalance({
            ...this.balance,
            amount: this.balance.amount - this.selectedBetOption.betAmount
        });
        this.ui.setBalance(this.balance.amount - this.selectedBetOption.betAmount)
        this.responseData = this.handleApiResponse(await Api.call(BetEndpoint, this.selectedBetOption.betPriceId));
        await this.handleResult(this.responseData);
    }

    public async handleResult(result: any) {
        this.gameView.stopSpin(false, (this.responseData as BetResult).data.combination, [[...(this.responseData as BetResult).data.winningLines]]);
        this.isResponseReceived = true;
        if(result.data.isWin){
            this.ui.showWinPopUp(result.data.totalWinningAmount, result.data.coinId);
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

    async getInitialData(): Promise<any> {
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
