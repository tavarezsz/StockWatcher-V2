import { db } from "../client";
import {
  PushSubscriptionData,
  PushSubscriptionRepository,
} from "./push-subscription-repository";
import { PushSubscription } from "@/db/prisma/generated";

export class PrismaPushSubscriptionRepository
  implements PushSubscriptionRepository
{
  async findAllByUser(userId: string): Promise<PushSubscription[]> {
    return db.pushSubscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async upsert(data: PushSubscriptionData): Promise<PushSubscription> {
    const { endpoint, ...subscriptionData } = data;

    return db.pushSubscription.upsert({
      where: { endpoint },
      update: subscriptionData,
      create: data,
    });
  }

  async deleteByUserAndEndpoint(
    userId: string,
    endpoint: string,
  ): Promise<boolean> {
    const result = await db.pushSubscription.deleteMany({
      where: { userId, endpoint },
    });

    return result.count > 0;
  }

  async deleteByEndpoint(endpoint: string): Promise<boolean> {
    const result = await db.pushSubscription.deleteMany({
      where: { endpoint },
    });

    return result.count > 0;
  }
}
