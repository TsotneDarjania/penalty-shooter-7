import { eventBus } from "../events";
import { BaseGameManager } from "./BaseGameManager.ts";
import { SlotEventKey, SpinButtonState } from "../../ui/html/enums";
import { Api } from "../../api/api.ts";
import { InitialDataEndpoint } from "../../api/endpoints/initialDataEndpoint.ts";
import { IUI } from "../../ui/html/interfaces/UI.ts";
import { GameView } from "../game/GameView.ts";
import {HtmlUI} from "../../ui/html";
import {AudioManager} from "./AudioManager.ts";

export class SlotGameManager extends BaseGameManager {
    private static instance: SlotGameManager;
    private state: SpinButtonState = SpinButtonState.IDLE;
    private gameView!: GameView;
    audioManager!: AudioManager;
    private ui!: IUI;

    private constructor() {
        super();

        this.audioManager = AudioManager.createInstance();

        // eventBus.on("spin-button-click", () => console.log("spin button clicked"))
    }

    private async init(GameContainer: HTMLElement, UIContainer: HTMLElement): Promise<void> {
        this.createGameView(GameContainer)
        const initialData = await Api.call(InitialDataEndpoint);
        await new Promise(resolve => setTimeout(resolve, 3000));
        this.gameView.hideLoadingScene();

        this.initialData = initialData;
        this.selectedBetOption = initialData.betPrices[0];

        // DRAW UI
        this.ui = HtmlUI.getInstance();
        this.ui.initialize(UIContainer);
        this.ui.setBetOptions(this.initialData.betPrices);
    }

    public soundHandler(){
        this.audioManager.isPlaying ? this.audioManager.stopMusic() : this.audioManager.playMusic();
    }

    private createGameView(GameContainer: HTMLElement): void {
        this.gameView = new GameView(GameContainer);
    }

    public static async createInstance(GameContainer?: HTMLElement, UIContainer?: HTMLElement): Promise<SlotGameManager> {
        if (!this.instance) {
            this.instance = new SlotGameManager();
            await this.instance.init(GameContainer!, UIContainer!);
        }
        return this.instance;
    }

    getState(): string {
        return this.state;
    }

    public startPlay(): void {
        // this.gameView.startSpin();
        //
        // Api.call(BetEndpoint, 1, "").then((x) => {
        //     this.gameView.stopSpin(false, x.combination, { lines: [x.winningLines] });
        // });
    }

    setState(newState: SpinButtonState): void {
        this.state = newState;
        eventBus.emit(SlotEventKey.STATE_CHANGE, this.state);
    }

    public async getPlayerBalance(): Promise<any> {
        return await Api.call(PlayerBalanceEndpoint)
    }

    public handleResult(result: any) {
        console.log(result);
        // Send to game
        // Send to UI
        // -- update balance
        // spin state change
    }
}
