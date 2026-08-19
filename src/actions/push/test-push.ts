"use server";

import type { PushActionResponse } from "./action-response";
import { getCurrentUser } from "@/lib/AuthService/auth-service";
import { webPushService } from "@/lib/WebPushService";
import { pushEndpointSchema } from "@/lib/PushSubscriptionService/validations";

export async function sendTestPushAction(
  endpoint: unknown,
): Promise<PushActionResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Faça login para testar as notificações",
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
    const result = await webPushService.sendToDevice(
      user.id,
      parsedEndpoint.data,
      {
        title: "Notificação de teste",
        body: "Tudo certo! O StockWatcher pode enviar notificações para este dispositivo.",
        url: "/settings",
        tag: "push-notification-test",
      },
    );

    if (result.sent > 0) {
      return { success: true };
    }

    if (result.removed > 0) {
      return {
        success: false,
        error:
          "A inscrição deste dispositivo expirou. Ative as notificações novamente.",
      };
    }

    if (result.errors > 0) {
      return {
        success: false,
        error: "Não foi possível enviar a notificação de teste",
      };
    }

    return {
      success: false,
      error: "Este dispositivo não possui uma inscrição ativa",
    };
  } catch (error) {
    console.error("Erro ao enviar notificação de teste", error);

    return {
      success: false,
      error: "Não foi possível enviar a notificação de teste",
    };
  }
}
