export interface ISlotGameManagerInstance {
    gameContainer: HTMLElement;
    uiContainer: HTMLElement;
}

export enum SpinButtonState {
    IDLE = "idle",
    SPINNING = "spinning",
    DISABLED = "disabled",
}

export interface Balance {
    id: number;
    amount: number;
    coin: string;
    promotionId: number;
}