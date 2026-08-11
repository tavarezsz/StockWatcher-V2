import { AlertModel, TargetCondition, TargetValueType } from "@/models/alert-model";
import { Alert } from "@/db/prisma/generated";

export interface AlertRepository{

    findAll():Promise<Alert[]>
    findById(id: string):Promise<Alert>
    findAllByUser(userId: string): Promise<Alert[]>
    findAllActive():Promise<Alert[]>

    //mutations

    create(symbol: string, userId: string, targetValue: number, targetValueType: TargetValueType, targetCondition: TargetCondition): Promise<Alert>
    update(id: string, newAlertData: Partial<Pick<AlertModel, 'status' | 'targetValue' | 'targetValueType' | 'targetCondition'>>): Promise<Alert>
    delete(id: string): Promise<Alert>
    markAsTriggered(id: string): Promise<void>

}