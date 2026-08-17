"use server";

import type { PushActionResponse } from "./action-response";
import { pushSubscriptionService } from "@/lib/PushSubscriptionService";
import { pushEndpointSchema } from "@/lib/PushSubscriptionService/validations";

export async function unsubscribeFromPushAction(
  endpoint: unknown,
): Promise<PushActionResponse> {
  // TODO: substituir pelo usuário da sessão quando a autenticação for implementada.
  const userId = process.env.DEV_USER_ID;

  if (!userId) {
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
    await pushSubscriptionService.unsubscribe(userId, parsedEndpoint.data);
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover inscrição de push", error);

    return {
      success: false,
      error: "Erro ao desativar as notificações",
    };
  }
}
