export interface ISlotGameManagerInstance {
    gameContainer: HTMLElement;
    uiContainer: HTMLElement;
}

export enum SpinButtonState {
    IDLE = "idle",
    SPINNING = "spinning",
    DISABLED = "disabled",
}