import { PrismaPushSubscriptionRepository } from "./prisma-push-subscription-repository";
import { PushSubscriptionRepository } from "./push-subscription-repository";

export const pushSubscriptionRepository: PushSubscriptionRepository =
  new PrismaPushSubscriptionRepository();
