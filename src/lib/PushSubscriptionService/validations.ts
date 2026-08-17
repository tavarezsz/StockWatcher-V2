import type { PushSubscriptionInput } from "@/models/push-subscription-model";
import { z } from "zod";

const endpointSchema = z
  .string({ error: "Endpoint de push inválido" })
  .trim()
  .url("Endpoint de push inválido")
  .max(4096, "Endpoint de push inválido");

export const pushSubscriptionSchema: z.ZodType<PushSubscriptionInput> = z
  .object({
    endpoint: endpointSchema,
    expirationTime: z
      .number({ error: "Data de expiração inválida" })
      .finite("Data de expiração inválida")
      .nonnegative("Data de expiração inválida")
      .nullable()
      .optional(),
    keys: z
      .object({
        p256dh: z
          .string({ error: "Chave p256dh inválida" })
          .trim()
          .min(1, "Chave p256dh inválida")
          .max(512, "Chave p256dh inválida"),
        auth: z
          .string({ error: "Chave de autenticação inválida" })
          .trim()
          .min(1, "Chave de autenticação inválida")
          .max(256, "Chave de autenticação inválida"),
      })
      .strict(),
  })
  .strict();

export const pushEndpointSchema = endpointSchema;
