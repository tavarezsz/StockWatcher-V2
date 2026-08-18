"use server";

import type { PushActionResponse } from "./action-response";
import { pushSubscriptionService } from "@/lib/PushSubscriptionService";
import { pushEndpointSchema } from "@/lib/PushSubscriptionService/validations";
import { getCurrentUser } from "@/lib/AuthService/auth-service";

export async function unsubscribeFromPushAction(
  endpoint: unknown,
): Promise<PushActionResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Faça login para desativar as notificações",
    };
  }

  const parsedEndpoint = pushEndpointSchema.safeParse(endpoint);

  if (!parsedEndpoint.success) {
    return {
      success: false,
      error: parsedEndpoint.error.issues[0]?.message ?? "Endpoint inválido",
    };
  }

  try {
    await pushSubscriptionService.unsubscribe(user.id, parsedEndpoint.data);
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover inscrição de push", error);

    return {
      success: false,
      error: "Erro ao desativar as notificações",
    };
  }
}
