import {
  AlertModel,
  TargetCondition,
  TargetValueType,
} from "@/models/alert-model";
import { alertRespository } from "@/repositories/alert";
import { stockRepository } from "@/repositories/stock";
import { cacheLife, cacheTag, updateTag, revalidateTag } from "next/cache";
import { StockModel } from "@/models/stock-model";
import { stockService } from "../StockService/stock-service";

async function getUserAlertsCachedInternal(userId: string): Promise<AlertModel[]> {
    "use cache";

    cacheLife("minutes");
    cacheTag(`alerts:${userId}`);

    const alerts = await alertService.getUserAlerts(userId);
    alerts.forEach((a) => cacheTag(`alerts:${userId}`));
    return alerts;
  }

export class AlertService {
  //valor usado como margen de erro, pra o alerta não considerar um valor exato somente
  private tolerance = parseInt(
    process.env.ACCEPTED_TOLERANCE_PERCENT || "2",
    10,
  );

  async alertValid(
    alert: AlertModel,
    strict: boolean,
    preloadedStock?: StockModel,
  ): Promise<boolean> {
    const stock =
      preloadedStock ?? (await stockRepository.findBySymbol(alert.stockSymbol));

    if (!stock) throw new Error("Ação não encontrada");

    const isVariationDay = alert.targetValueType === "variationDay";

    const currentValue = isVariationDay ? stock.changePercentDay : stock.price;

    if (isVariationDay) {
      const variationTarget = Math.abs(alert.targetValue);

      return alert.targetCondition === "above"
        ? currentValue >= variationTarget
        : currentValue <= -variationTarget;
    }

    const margin = strict ? 0 : (alert.targetValue * this.tolerance) / 100;

    const minValue = alert.targetValue - margin;
    const maxValue = alert.targetValue + margin;

    if (alert.targetCondition === "above") {
      return currentValue >= minValue;
    }

    return currentValue <= maxValue;
  }

  async createAlert(
    symbol: string,
    userId: string,
    targetValue: number,
    targetValueType: TargetValueType,
    targetCondition: TargetCondition,
  ) {
    const alert: AlertModel = {
      status: "ativo",
      stockSymbol: symbol,
      targetValue,
      targetValueType,
      targetCondition,
      createdAt: new Date(),
    };
    //checa se a condição já não está satisfeita
    const alreadySatisfied = await this.alertValid(alert, true);

    if (alreadySatisfied) throw new Error("Condição já satisfeita");

    const newAlert = await alertRespository.create(
      symbol,
      userId,
      targetValue,
      targetValueType,
      targetCondition,
    );

    if (newAlert) {
      updateTag(`alerts:${userId}`);
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  }

  async deleteAlert(userId: string, alertId: string) {
    if (!alertId) throw new Error("Alerta não encontrado");

    const alertData = await alertRespository.findById(alertId);

    if (!alertData || alertData.userId !== userId)
      throw new Error("Alerta não encontrado");

    try {
      await alertRespository.delete(alertData.id);
      updateTag(`alerts:${userId}`);
      return {
        success: true,
      };
    } catch (err) {
      console.error("Erro ao excluir alerta", err);
      return {
        success: false,
      };
    }
  }

  async getUserAlerts(userId: string): Promise<AlertModel[]> {
    const alerts = await alertRespository.findAllByUser(userId);
    return alerts;
  }

  async getUserAlertsCached(userId: string): Promise<AlertModel[]> {
    return await getUserAlertsCachedInternal(userId)
  }

  async checkAllAlerts(): Promise<{ checked: number; triggered: number }> {
    const activeAlerts = await alertRespository.findAllActive();

    if (activeAlerts.length === 0) {
      return { checked: 0, triggered: 0 };
    }

    //deduplicação de todas as stocks
    const uniqueSymbols = [...new Set(activeAlerts.map((a) => a.stockSymbol))];

    //atualiza as cotações necessárias
    await Promise.all(
      uniqueSymbols.map((symbol) => stockService.refreshQuoteFromCron(symbol)),
    );

    //busca os stocks atualizados de uma vez
    const stocks = await stockRepository.findManyBySymbol(uniqueSymbols);
    const stockMap = new Map(stocks.map((s) => [s.symbol, s]));

    let triggeredCount = 0;
    const affectedUserIds = new Set<string>();
    for (const alert of activeAlerts) {
      const stock = stockMap.get(alert.stockSymbol);
      if (!stock) continue;

      const isTriggered = await this.alertValid(alert, false, stock);

      if (isTriggered) {
        await alertRespository.markAsTriggered(alert.id!);
        triggeredCount++;
        affectedUserIds.add(alert.userId);
        // TODO: disparar email via Resend aqui
      }
    }
  // invalida o cache de alertas só dos usuários que realmente tiveram algo disparado
  affectedUserIds.forEach((userId) => revalidateTag(`alerts:${userId}`, "max"));

  return { checked: activeAlerts.length, triggered: triggeredCount };
  }
}

export const alertService = new AlertService()
