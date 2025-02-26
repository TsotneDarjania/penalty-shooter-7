export type PixiContainer = { id: string };

export interface IUI {
    initialize(UIContainer:HTMLElement | PixiContainer): void;
    getBalance(): number;
    setBalance(balance: number): void;
    setBetOptions(betOptionsList: any[]): void;
    setPlaySectionColors(playButtonColor: string, playSectionBackgroundColor: string): void;
}