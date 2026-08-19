import type { Metadata } from 'next';
import Link from 'next/link';
import { BellRingIcon, CircleHelpIcon, LockKeyholeIcon } from 'lucide-react';
import { Container } from '@/components/Container';
import { PushNotificationButton } from '@/components/PushNotificationButton';
import { PasswordForm } from '@/components/Settings/PasswordForm';
import { SignOutButton } from '@/components/SignOutButton';

export const metadata: Metadata = {
  title: 'Configurações',
  description: 'Gerencie as notificações e a segurança da sua conta',
};

const cardClasses =
  'rounded-2xl border border-border bg-white p-5 sm:p-6';

export default function SettingsPage() {
  return (
    <Container className='gap-5 p-4 sm:p-6 lg:gap-7 lg:p-8'>
      <div>
        <h1 className='text-xl font-bold text-primary sm:text-2xl'>
          Configurações
        </h1>
        <p className='mt-1 text-sm text-gray-500'>
          Gerencie sua conta e as notificações do StockWatcher.
        </p>
      </div>

      <div className='grid max-w-4xl gap-5'>
        <section className={cardClasses}>
          <div className='mb-5 flex items-start gap-3'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600'>
              <BellRingIcon size={20} />
            </div>
            <div>
              <h2 className='font-bold text-primary'>Notificações push</h2>
              <p className='mt-1 text-sm text-gray-500'>
                Receba no dispositivo um aviso quando um dos seus alertas for
                disparado.
              </p>
            </div>
          </div>

          <PushNotificationButton variant='primary' />

          <p className='mt-3 text-xs leading-relaxed text-gray-400'>
            Use o teste para confirmar que o aviso aparece neste dispositivo.
            Se ele não aparecer, verifique as permissões do navegador e se o
            sistema operacional está em modo silencioso.
          </p>
        </section>

        <section className={cardClasses}>
          <div className='mb-5 flex items-start gap-3'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600'>
              <LockKeyholeIcon size={20} />
            </div>
            <div>
              <h2 className='font-bold text-primary'>Alterar senha</h2>
              <p className='mt-1 text-sm text-gray-500'>
                Confirme sua senha atual antes de definir uma nova.
              </p>
            </div>
          </div>

          <PasswordForm />
        </section>

        <Link
          href='/about'
          prefetch={false}
          className={`${cardClasses} flex items-center gap-3 transition hover:border-green-300`}
        >
          <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-background-sec text-gray-500'>
            <CircleHelpIcon size={20} />
          </div>
          <div>
            <h2 className='font-bold text-primary'>Ajuda</h2>
            <p className='mt-1 text-sm text-gray-500'>
              Veja como utilizar a aplicação e configurar as notificações.
            </p>
          </div>
        </Link>

        <section className={`${cardClasses} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
          <div>
            <h2 className='font-bold text-primary'>Encerrar sessão</h2>
            <p className='mt-1 text-sm text-gray-500'>
              Saia da sua conta neste dispositivo.
            </p>
          </div>
          <SignOutButton variant='full' />
        </section>
      </div>
    </Container>
  );
}
