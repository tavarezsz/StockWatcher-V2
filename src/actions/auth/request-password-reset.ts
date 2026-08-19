'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export type RequestPasswordResetState = {
  errors: string[];
  message?: string;
};

const requestPasswordResetSchema = z.object({
  email: z.email('Informe um e-mail válido'),
});

export async function requestPasswordResetAction(
  _previousState: RequestPasswordResetState,
  formData: FormData,
): Promise<RequestPasswordResetState> {
  const parsedData = requestPasswordResetSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsedData.success) {
    return {
      errors: parsedData.error.issues.map(issue => issue.message),
    };
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get('origin');

  if (!origin) {
    return {
      errors: ['Não foi possível identificar o endereço da aplicação.'],
    };
  }

  const confirmationUrl = new URL('/auth/confirm', origin);
  confirmationUrl.searchParams.set('next', '/auth/reset-password');

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsedData.data.email,
    {
      redirectTo: confirmationUrl.toString(),
    },
  );

  if (error) {
    console.error('Erro ao solicitar recuperação de senha', {
      code: error.code,
      status: error.status,
    });

    if (error.status === 429) {
      return {
        errors: [
          'Muitas solicitações foram feitas. Aguarde alguns minutos e tente novamente.',
        ],
      };
    }

    return {
      errors: [
        'Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.',
      ],
    };
  }

  // A resposta não revela se o endereço está cadastrado, evitando enumeração
  // de contas pela tela pública de recuperação.
  return {
    errors: [],
    message:
      'Se existir uma conta com esse e-mail, você receberá as instruções para redefinir sua senha.',
  };
}
