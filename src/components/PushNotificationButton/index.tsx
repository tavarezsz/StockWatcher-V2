"use client";

import { subscribeToPushAction } from "@/actions/push/subscribe-push";
import { unsubscribeFromPushAction } from "@/actions/push/unsubscribe-push";
import {
  BellOffIcon,
  BellRingIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type PushAvailability =
  | "checking"
  | "available"
  | "denied"
  | "unsupported"
  | "misconfigured"
  | "error";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function PushNotificationButton() {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const [availability, setAvailability] =
    useState<PushAvailability>("checking");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initializePush() {
      if (!supportsWebPush()) {
        if (!cancelled) setAvailability("unsupported");
        return;
      }

      if (!vapidPublicKey) {
        if (!cancelled) setAvailability("misconfigured");
        return;
      }

      if (Notification.permission === "denied") {
        if (!cancelled) setAvailability("denied");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        const subscription =
          await registration.pushManager.getSubscription();

        if (!cancelled) {
          registrationRef.current = registration;
          setIsSubscribed(Boolean(subscription));
          setAvailability("available");
        }
      } catch (error) {
        console.error("Erro ao registrar Service Worker", error);
        if (!cancelled) setAvailability("error");
      }
    }

    void initializePush();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleClick() {
    if (isPending || !canInteract(availability)) return;

    setIsPending(true);

    try {
      if (isSubscribed) {
        await disablePushNotifications();
      } else {
        await enablePushNotifications();
      }
    } finally {
      setIsPending(false);
    }
  }

  async function enablePushNotifications() {
    try {
      const permission =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();

      if (permission !== "granted") {
        setAvailability(permission === "denied" ? "denied" : "available");
        toast.error("Permissão para notificações não concedida");
        return;
      }

      const registration = await getRegistration();
      const existingSubscription =
        await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey!),
        }));

      const result = await subscribeToPushAction(subscription.toJSON());

      if (!result.success) {
        throw new Error(result.error);
      }

      setIsSubscribed(true);
      setAvailability("available");
      toast.dismiss();
      toast.success("Notificações ativadas");
    } catch (error) {
      console.error("Erro ao ativar notificações", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao ativar notificações",
      );
    }
  }

  async function disablePushNotifications() {
    try {
      const registration = await getRegistration();
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const result = await unsubscribeFromPushAction(subscription.endpoint);

        if (!result.success) {
          throw new Error(result.error);
        }

        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      toast.dismiss();
      toast.success("Notificações desativadas");
    } catch (error) {
      console.error("Erro ao desativar notificações", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao desativar notificações",
      );
    }
  }

  async function getRegistration(): Promise<ServiceWorkerRegistration> {
    if (registrationRef.current) return registrationRef.current;

    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    registrationRef.current = registration;
    return registration;
  }

  const disabled =
    isPending ||
    availability === "checking" ||
    availability === "unsupported" ||
    availability === "denied" ||
    availability === "misconfigured";
  const label = getButtonLabel(availability, isSubscribed, isPending);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={isSubscribed}
      title={getButtonTitle(availability, isSubscribed)}
      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending || availability === "checking" ? (
        <LoaderCircleIcon size={16} className="animate-spin" />
      ) : isSubscribed ? (
        <BellRingIcon size={16} />
      ) : (
        <BellOffIcon size={16} />
      )}
      <span>{label}</span>
    </button>
  );
}

function supportsWebPush() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

function canInteract(availability: PushAvailability) {
  return availability === "available" || availability === "error";
}

function getButtonLabel(
  availability: PushAvailability,
  isSubscribed: boolean,
  isPending: boolean,
) {
  if (isPending) return "Aguarde...";
  if (availability === "checking") return "Verificando...";
  if (availability === "unsupported") return "Push indisponível";
  if (availability === "denied") return "Permissão bloqueada";
  if (availability === "misconfigured") return "Push não configurado";
  if (availability === "error") return "Tentar novamente";
  return isSubscribed ? "Notificações ativas" : "Ativar notificações";
}

function getButtonTitle(
  availability: PushAvailability,
  isSubscribed: boolean,
) {
  if (availability === "denied") {
    return "Libere as notificações nas configurações do navegador";
  }

  if (availability === "unsupported") {
    return "Este navegador não oferece suporte a Web Push";
  }

  if (availability === "misconfigured") {
    return "A chave pública VAPID não foi configurada";
  }

  return isSubscribed
    ? "Clique para desativar as notificações"
    : "Clique para ativar as notificações";
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);

  return Uint8Array.from(rawData, character => character.charCodeAt(0));
}
