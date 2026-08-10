import { StockModel } from "./stock-model"

export type TargetValueType = "value" | "variationDay"
export type TargetCondition = "above" | "below"


export type AlertModel = {
    status: "ativo" | "disparado" | "pausado"
    stockSymbol: string
    targetValue: number
    targetValueType: TargetValueType
    targetCondition: TargetCondition
    createdAt: Date;
    updatedAt?: Date | null;
}