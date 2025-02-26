import {EventEmitter} from "events";

export type PixiContainer = { id: string };

export interface IUI {
    initialize(UIContainer:HTMLElement | PixiContainer): void;
    setBalance(balance: number): void;
    setBetOptions(betOptionsList: any[]): void;
    setPlaySectionColors(playButtonColor: string, playSectionBackgroundColor: string): void;
    setEventEmitter(eventBus: EventEmitter): void;
    updateSoundButtonImage(isPlaying: boolean): void;
    showWinPopUp(amount: number, coinId: string): void;
    hideWinPopUp(): void;
}