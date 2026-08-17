import { PushSubscription } from "@/db/prisma/generated";

export type PushSubscriptionData = Omit<
  PushSubscription,
  "id" | "createdAt" | "updatedAt"
>;

export interface PushSubscriptionRepository {
  findAllByUser(userId: string): Promise<PushSubscription[]>;
  upsert(data: PushSubscriptionData): Promise<PushSubscription>;
  deleteByUserAndEndpoint(userId: string, endpoint: string): Promise<boolean>;
  deleteByEndpoint(endpoint: string): Promise<boolean>;
}
