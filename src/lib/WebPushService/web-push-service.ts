import { pushSubscriptionService } from "@/lib/PushSubscriptionService";
import { formatPrice, formatVariation } from "@/utils/formatters";
import webPush from "web-push";
import { getStockHref } from "@/utils/stockRoute";

export type WebPushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

export type SendWebPushResponse = {
  sent: number;
  errors: number;
  removed: number;
};

export type TriggeredAlertNotification = {
  userId: string;
  alertId: string;
  symbol: string;
  targetValueType: "value" | "variationDay";
  currentPrice: number;
  currentVariation: number;
};

export class WebPushService {
  private vapidConfigured = false;

  async sendToUser(
    userId: string,
    payload: WebPushPayload,
  ): Promise<SendWebPushResponse> {
    const subscriptions =
      await pushSubscriptionService.getUserSubscriptions(userId);

    if (subscriptions.length === 0) {
      return { sent: 0, errors: 0, removed: 0 };
    }

    this.configureVapid();

    /*
     * Cada browser/dispositivo possui um endpoint independente. allSettled
     * permite enviar para todos em paralelo sem uma falha cancelar os demais.
     */
    const results = await Promise.allSettled(
      subscriptions.map((subscription) =>
        webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              // p256dh é a chave pública usada para criptografar o payload.
              p256dh: subscription.p256dh,
              // auth é o segredo adicional exigido pelo protocolo Web Push.
              auth: subscription.auth,
            },
          },
          JSON.stringify(payload),
          {
            // Mantém o alerta no push service por até uma hora se o dispositivo
            // estiver temporariamente offline.
            TTL: 60 * 60,
            urgency: "high",
          },
        ),
      ),
    );

    let sent = 0;
    let errors = 0;
    let removed = 0;

    for (const [index, result] of results.entries()) {
      if (result.status === "fulfilled") {
        sent++;
        continue;
      }

      errors++;
      const subscription = subscriptions[index];
      const statusCode = getWebPushStatusCode(result.reason);

      /*
       * 404 e 410 indicam que o endpoint não existe mais ou expirou. Manter
       * esse registro faria todos os próximos envios falharem novamente.
       */
      if (statusCode === 404 || statusCode === 410) {
        try {
          const wasRemoved =
            await pushSubscriptionService.removeInvalidSubscription(
              subscription.endpoint,
            );

          if (wasRemoved) removed++;
        } catch (cleanupError) {
          console.error(
            `Erro ao remover subscription inválida ${subscription.id}`,
            cleanupError,
          );
        }
      } else {
        const errorMessage =
          result.reason instanceof Error
            ? result.reason.message
            : "Erro desconhecido";

        console.error(
          `Erro ao enviar push para subscription ${subscription.id}`,
          errorMessage,
        );
      }
    }

    return { sent, errors, removed };
  }

  async sendTriggeredAlert(
    notification: TriggeredAlertNotification,
  ): Promise<SendWebPushResponse> {
    const body =
      notification.targetValueType === "variationDay"
        ? `${notification.symbol} variou ${formatVariation(
            notification.currentVariation,
          )}% no dia e atingiu seu alerta.`
        : `${notification.symbol} está cotada a ${formatPrice(
            notification.currentPrice,
          )} e atingiu seu alerta.`;

    return this.sendToUser(notification.userId, {
      title: `Alerta de ${notification.symbol} disparado`,
      body,
      url: getStockHref(notification.symbol),
      tag: `alert-${notification.alertId}`,
    });
  }

  private configureVapid() {
    if (this.vapidConfigured) return;

    const subject = process.env.VAPID_SUBJECT;
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;

    if (!subject || !publicKey || !privateKey) {
      throw new Error("Configuração VAPID incompleta");
    }

    /*
     * VAPID identifica este servidor perante o serviço de push. A chave
     * privada permanece somente no servidor; apenas a pública vai ao browser.
     */
    webPush.setVapidDetails(subject, publicKey, privateKey);
    this.vapidConfigured = true;
  }
}

function getWebPushStatusCode(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  return undefined;
}

export const webPushService = new WebPushService();
