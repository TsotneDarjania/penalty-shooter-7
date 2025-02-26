export interface IBaseGameManager {
    getBalance(): number;
    setBalance(amount: number): void;
    startPlay(): void;
    handleResult(result: any): void;
    getInitialData(InitialDataEndpoint: any): void;
    handleGetSelectedBetOption(selectedBetOption: any): void;
}

export abstract class BaseGameManager implements IBaseGameManager{
    protected balance: number = 999;
    protected initialData: any = {};
    protected selectedBetOption: object = {};

    public handleGetSelectedBetOption(selectedBetOption: any): void {
        this.selectedBetOption = selectedBetOption;
        console.log(`handleGetSelectedBetOption`, this.selectedBetOption);
    }

    public getBalance(): number {
        return this.balance;
    }

    public setBalance(amount: number): void {
        this.balance = amount;
    }

    public abstract startPlay(): void;

    abstract handleResult(result: any): void;

    abstract getInitialData(): Promise<any>;
}
