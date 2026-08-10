import { AlertModel, TargetCondition, TargetValueType } from "@/models/alert-model";

export interface AlertRepository{

    findAll():Promise<AlertModel[]>
    findById(id: string):Promise<AlertModel>
    findAllByUser(userId: string): Promise<AlertModel[]>

    //mutations

    create(symbol: string, userId: string, targetValue: number, targetValueType: TargetValueType, targetCondition: TargetCondition): Promise<AlertModel>
    update(id: string, newAlertData: Partial<Pick<AlertModel, 'status' | 'targetValue' | 'targetValueType' | 'targetCondition'>>): Promise<AlertModel>
    delete(id: string): Promise<AlertModel>

}