import { PushSubscriptionInput } from "@/models/push-subscription-model";
import { pushSubscriptionRepository } from "@/repositories/push-subscription";

export class PushSubscriptionService {
  async subscribe(
    userId: string,
    subscription: PushSubscriptionInput,
    userAgent?: string | null,
  ) {
    if (!userId) throw new Error("Usuário não informado");

    const { endpoint, expirationTime, keys } = subscription;

    if (!endpoint || !keys?.p256dh || !keys.auth) {
      throw new Error("Inscrição de push inválida");
    }

    const expirationDate = this.parseExpirationTime(expirationTime);

    return pushSubscriptionRepository.upsert({
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      expirationTime: expirationDate,
      userAgent: userAgent ?? null,
      userId,
    });
  }

  async getUserSubscriptions(userId: string) {
    if (!userId) throw new Error("Usuário não informado");

    return pushSubscriptionRepository.findAllByUser(userId);
  }

  async unsubscribe(userId: string, endpoint: string): Promise<boolean> {
    if (!userId || !endpoint) return false;

    return pushSubscriptionRepository.deleteByUserAndEndpoint(userId, endpoint);
  }

  async removeInvalidSubscription(endpoint: string): Promise<boolean> {
    if (!endpoint) return false;

    return pushSubscriptionRepository.deleteByEndpoint(endpoint);
  }

  private parseExpirationTime(expirationTime?: number | null): Date | null {
    if (expirationTime == null) return null;

    const expirationDate = new Date(expirationTime);

    if (Number.isNaN(expirationDate.getTime())) {
      throw new Error("Data de expiração da inscrição inválida");
    }

    return expirationDate;
  }
}

export const pushSubscriptionService = new PushSubscriptionService();
