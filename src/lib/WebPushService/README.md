# Web Push

## Responsabilidades

- `PushSubscriptionService`: persiste e remove inscrições dos navegadores.
- `WebPushService`: assina, criptografa e envia mensagens usando VAPID.
- `public/sw.js`: recebe a mensagem no navegador e exibe a notificação.

Separar essas responsabilidades evita acoplar o repository à biblioteca
`web-push` e permite trocar a forma de envio sem alterar a persistência.

## Fluxo de um alerta

1. `AlertService` identifica que a condição foi atingida.
2. O alerta é marcado como disparado.
3. `WebPushService` busca todas as subscriptions do usuário.
4. O payload é criptografado individualmente usando `p256dh` e `auth`.
5. O serviço de push do navegador recebe a mensagem.
6. O Service Worker mostra a notificação e abre a página da ação no clique.

O envio é *best effort*: falhar em um navegador não desfaz o disparo do alerta
e não impede o envio para os outros dispositivos.

## Falhas e limpeza

Os envios usam `Promise.allSettled`, portanto uma rejeição não interrompe o
lote. Respostas HTTP `404` e `410` significam que o endpoint não é mais válido;
nesses casos a subscription é removida para evitar falhas futuras.

O retorno possui o formato:

```ts
{ sent: number; errors: number; removed: number }
```

`sent` significa que o serviço de push aceitou a mensagem. A exibição final
ainda depende do navegador e do dispositivo do usuário.

## Variáveis de ambiente

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."
VAPID_SUBJECT="mailto:contato@exemplo.com"
```

A chave privada nunca deve receber o prefixo `NEXT_PUBLIC_`.
