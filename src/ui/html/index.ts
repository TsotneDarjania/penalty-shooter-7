import html from './index.html?raw';
import {IUI} from './interfaces/UI.ts';
import {SpinButtonState, UIEventKey} from "./enums";
import {EventEmitter} from "events";
import {eventBus} from "../../core/events.ts";
import {SlotGameManager} from "../../core/managers/SlotGameManager.ts";

export class HtmlUI implements IUI {
    private static instance: HtmlUI;
    private eventEmitter: EventEmitter = eventBus;

    private elements = {
        container: null as HTMLElement | null,
        soundButton: null as HTMLButtonElement | null,
        soundButtonImg: null as HTMLImageElement | null,
        navSection: null as HTMLElement | null,
        spinButton: null as HTMLButtonElement | null,
        balanceSection: null as HTMLElement | null,
        betSection: null as HTMLElement | null,
        selectedBetOption: null as HTMLElement | any,
        balanceAmount: null as HTMLSpanElement | null,
        betOptions: null as HTMLElement | null,
        winPopUp: null as HTMLElement | null,
        winPopUpText: null as HTMLElement | null,
        navContainer: null as HTMLElement | null,
    };

    private state = {
        betOptionsData: [] as any[],
        selectedBetOption: {betPriceId: 0, coin: '', multiplier: 0},
        platButtonColor: 'grey',
        playSectionBackgroundColor: 'grey',
    };

    // private onSpin!: () => void;

    constructor() {
        document.addEventListener('click', () => {
            this.toggleSound();
        }, {once: true});
    }

    public static getInstance(): HtmlUI {
        if (!this.instance) {
            this.instance = new HtmlUI();
        }
        return this.instance;
    }

    // private registerEventHandlers() {
    //     this.eventEmitter.on(SlotEventKey.STATE_CHANGE, this.updateSpinButton.bind(this));
    //     this.eventEmitter.on(UIEventKey.UPDATE_BALANCE, this.setBalance.bind(this));
    // }

    public setPlaySectionColors(playButtonColor: string, playSectionBackgroundColor: string): void {
        this.state.platButtonColor = playButtonColor;
        document.getElementById("spin-button")!.style.background = this.state.platButtonColor;
        this.state.playSectionBackgroundColor = playSectionBackgroundColor;
        document.getElementById("game-panel-container-masked")!.style.background = this.state.playSectionBackgroundColor;
        document.getElementById("bet-options")!.style.background = this.state.playSectionBackgroundColor;
    }

    public initialize(uiContainer: HTMLElement): void {
        this.elements.container = uiContainer;

        this.elements.container.innerHTML = html;

        this.elements.soundButton = uiContainer.querySelector('#sound-section button');
        this.elements.soundButtonImg = this.elements.soundButton?.querySelector('img') || null;
        this.elements.navSection = uiContainer.querySelector('#nav-section');
        this.elements.spinButton = uiContainer.querySelector('#spin-button');
        this.elements.balanceSection = uiContainer.querySelector('#balance-section');
        this.elements.balanceAmount = this.elements.balanceSection?.querySelector('span') || null;
        this.elements.betSection = uiContainer.querySelector('#bet-section');
        this.elements.betOptions = uiContainer.querySelector('#bet-options');
        this.elements.selectedBetOption = this.elements.betSection?.querySelector('span') || null;
        this.elements.winPopUp = uiContainer.querySelector('#win-popup-container');
        this.elements.navContainer = uiContainer.querySelector('#nav-container');
        this.elements.winPopUpText = uiContainer.querySelector('#win-popup-text') || null;

        if (this.elements.soundButton) {
            this.elements.soundButton.addEventListener('click', () => this.toggleSound());
        }
        if (this.elements.navSection) {
            this.elements.navSection.addEventListener('click', () => this.toggleNavSection());
        }
        if (this.elements.spinButton) {
            this.elements.spinButton.addEventListener('click', () => this.clickHandler());
        }
        if (this.elements.betSection) {
            this.elements.betSection.querySelector('div.flex')?.addEventListener('click', () => this.toggleBetOptions());
        }

    }

    private updateSpinButton(state: SpinButtonState): void {
        const button = this.elements.spinButton;
        const buttonImage = button?.querySelector('img');

        if (!button) return;

        switch (state) {
            case SpinButtonState.IDLE:
                buttonImage!.src = "/assets/spin.png";
                button.disabled = false;
                break;
            case SpinButtonState.SPINNING:
                buttonImage!.src = "/assets/stop.png";
                button.disabled = false;
                break;
            case SpinButtonState.DISABLED:
                button.disabled = true;
                break;
        }
    }

    // public assignEventEmitter(eventBus: any){
    //     this.eventBus = eventBus;
    //     this.registerEventHandlers();
    // }

    private toggleBetOptions(): void {
        if (this.elements.betOptions) {
            this.elements.betOptions.classList.toggle('hidden');
        }
    }

// {
//     "music": {},
//     "isMuted": false
// }

    private async toggleSound(): Promise<void> {
        const slotGameManager = await SlotGameManager.createInstance();
        const audio = slotGameManager.audioManager;

        if (audio.isPlaying) {
            audio.stopMusic();
            if (this.elements.soundButtonImg) {
                this.elements.soundButtonImg.src = '/assets/sound-button-off.png';
            }
        } else {
            audio.playMusic();
            if (this.elements.soundButtonImg) {
                this.elements.soundButtonImg.src = '/assets/sound-button-on.png';
            }
        }
    }

    private toggleNavSection(): void {
        // @ts-ignore
        this.elements.navContainer.classList.toggle('hidden');
    }

    public getBalance(): number {
        return Number(this.elements.balanceAmount?.textContent) || 0;
    }

    public setBalance(newBalance: number): void {
        if (this.elements.balanceAmount) {
            this.elements.balanceAmount.textContent = newBalance.toString();
        }
    }

    public setWinPopUpColors(backgroundColor: string): void {
        const element: any = this.elements.winPopUp?.querySelector('.win-popup-container-masked');
        element!.style.backgroundColor = backgroundColor;
    }

    private emitBetOption(): void {
        this.eventEmitter.emit(UIEventKey.SEND_BET_OPTION, this.state.selectedBetOption);
    }

    public setBetOptions(betOptionsList: any[]): void {
        this.state.betOptionsData = betOptionsList;
        this.elements.selectedBetOption.innerHTML = `BET ${betOptionsList[0].multiplier}X`;
        this.setBetOption(betOptionsList[0]);
        this.renderBetOptions();
    }

    private setBetOption(betOption: any): void {
        this.state.selectedBetOption = betOption;
    }

    private renderBetOptions(): void {
        const container = this.elements.betOptions?.querySelector(".bet-options-list");
        if (!container) return;

        container.innerHTML = '';
        this.state.betOptionsData.forEach((item, index) => {
            const betOption = document.createElement("div");
            betOption.className = `bet-option ${index === 0 ? 'active' : ''}`;
            betOption.setAttribute("data-index", index.toString());
            betOption.innerHTML = `<span>1 SPIN = ${item.multiplier}x</span>`;
            betOption.addEventListener("click", () => this.selectBetOption(index));
            container.appendChild(betOption);
        });
    }

    private selectBetOption(selectedIndex: number): void {
        const allBetOptions = this.elements.betOptions?.querySelectorAll(".bet-option");
        allBetOptions?.forEach(option => option.classList.remove("active"));

        const selectedOption = this.elements.betOptions?.querySelector(`.bet-option[data-index="${selectedIndex}"]`);
        if (selectedOption) {
            selectedOption.classList.add("active");
        }

        this.state.selectedBetOption = this.state.betOptionsData[selectedIndex];
        this.toggleBetOptions();
        this.emitBetOption();
        this.elements.selectedBetOption.textContent = `BET ${this.state.selectedBetOption.multiplier}X`;
    }

    public showWinPopUp(): void {
        this.elements.winPopUpText!.innerText = `You've won {prize}, it's been multiplied x{multiplier}! 🔥`;
        this.elements.winPopUp?.classList.toggle('hidden');
    }

    public hideWinPop(): void {
        this.elements.winPopUp?.classList.toggle('hidden');
    }

    private clickHandler() {
        this.eventEmitter.emit("spin-button-click");
    }

    // onClick(startPlay: () => void) {
    //     console.log('onClick', startPlay);
    //     this.onSpin = startPlay;
    // }
}
