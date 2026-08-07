import { StockModel } from "./stock-model"


export type AlertModel = {
    status: "ativo" | "disparado" | "pausado"
    targetAsset: StockModel
    tagetValue: number
    targetValueType: "value" | "variationDay" //variation day considera a porcentagem de variação
    targetCondition: "above" | "below"
    createdAt: Date;
    updatedAt?: Date;
}