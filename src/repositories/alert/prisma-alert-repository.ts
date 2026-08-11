import { AlertModel } from "@/models/alert-model";
import { AlertRepository } from "./alert-repository";
import { TargetValueType, TargetCondition } from "@/models/alert-model";
import { Alert } from "@/db/prisma/generated";

import "dotenv/config";

import { db } from "../client";
import { AlertStatus } from "@/db/prisma/generated";

export class PrismaAlertRepository implements AlertRepository {
  async findAll(): Promise<Alert[]> {
    const alerts = await db.alert.findMany();
    return alerts;
  }

  async findById(id: string): Promise<Alert> {
    const alert = await db.alert.findUnique({
      where: { id: id },
    });

    if (!alert) {
      throw new Error("Alerta não encontrado");
    }

    return alert;
  }

  async findAllByUser(userId: string): Promise<Alert[]> {
    const alerts = await db.alert.findMany({
      where: { userId: userId },
    });
    return alerts;
  }

  async create(
    symbol: string,
    userId: string,
    targetValue: number,
    targetValueType: TargetValueType,
    targetCondition: TargetCondition,
  ): Promise<Alert> {
    const alert = await db.alert.create({
      data: {
        status: "ativo",
        targetValue: targetValue,
        targetValueType: targetValueType,
        targetCondition: targetCondition,
        stockSymbol: symbol,
        userId: userId,
        createdAt: new Date(),
      },
    });

    return alert;
  }

  //responsabilidade do service verificar se o user tem acesso
  async update(
    id: string,
    newAlertData: Partial<
      Pick<
        AlertModel,
        "status" | "targetValue" | "targetValueType" | "targetCondition"
      >
    >,
  ): Promise<Alert> {
    try {
      return await db.alert.update({
        where: { id },
        data: { ...newAlertData },
      });
    } catch (err) {
      throw new Error("Alerta não encontrado");
    }
  }

  async delete(id: string): Promise<Alert> {
    try{
        return await db.alert.delete({
            where: {id: id}
        })
    } catch(err){
        throw new Error("Alerta não encontrado")
    }
  }

  async findAllActive():Promise<Alert[]>{
    try{
      return await db.alert.findMany({
        where: {status: "ativo"}
      })
    } catch(err){
        throw new Error("Erro ao buscar alertas")
    }
  }

  async markAsTriggered(id: string): Promise<void> {
    try {await db.alert.update({
      where: {id},
      data: {
        status: "disparado"
      }
    })
  } catch(err){
    throw new Error("Alerta não encontrado")
  }
    
  }
  
}
