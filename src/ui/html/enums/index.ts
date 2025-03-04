export enum SpinButtonState {
    IDLE = "idle",
    SPINNING = "spinning",
    DISABLED = "disabled"
}
export enum UIEvents {
    TOGGLE_BET_SECTION = "toggle-bet-section",
    SPIN_BUTTON_CLICK = "spin-button-click",
    TOGGLE_NAV_SECTION = "toggle-nav-section",
    TOGGLE_SOUND = "toggle-sound",
    SEND_BET_OPTION = "send-bet-option",
}

export interface IBetOption {
    betPriceId: number;
    betAmount: number;
    multiplier: number;
    coin: string;
}