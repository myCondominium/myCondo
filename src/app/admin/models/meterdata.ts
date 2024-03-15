export interface MeterData {
    [key: string]: {
        amountOfHeat: number;
        meterColdOne: number;
        meterColdTwo: number;
        meterHotOne: number;
        meterHotTwo: number;
    };
}