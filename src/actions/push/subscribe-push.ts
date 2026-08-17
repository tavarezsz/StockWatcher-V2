"use server";

import type { PushActionResponse } from "./action-response";
import { pushSubscriptionService } from "@/lib/PushSubscriptionService";
import { pushSubscriptionSchema } from "@/lib/PushSubscriptionService/validations";
import { headers } from "next/headers";

export async function subscribeToPushAction(
  input: unknown,
): Promise<PushActionResponse> {
  // TODO: substituir pelo usuário da sessão quando a autenticação for implementada.
  const userId = process.env.DEV_USER_ID;

  if (!userId) {
    return {
      success: false,
      error: "Faça login para ativar as notificações",
    };
  }

  const parsedSubscription = pushSubscriptionSchema.safeParse(input);

  if (!parsedSubscription.success) {
    return {
      success: false,
      error:
        parsedSubscription.error.issues[0]?.message ??
        "Inscrição de push inválida",
    };
  }

  try {
    const userAgent = (await headers()).get("user-agent");

    await pushSubscriptionService.subscribe(
      userId,
      parsedSubscription.data,
      userAgent,
    );

    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar inscrição de push", error);

    return {
      success: false,
      error: "Erro ao ativar as notificações",
    };
  }
}
