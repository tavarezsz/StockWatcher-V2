'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { syncAuthUser } from '@/lib/AuthService/auth-service';
import { createClient } from '@/lib/supabase/server';

export type SignUpActionState = {
  errors: string[];
  message?: string;
};

const signUpSchema = z
  .object({
    email: z.email('Informe um e-mail válido'),
    password: z
      .string()
      .min(8, 'A senha deve possuir ao menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export async function signUpAction(
  _previousState: SignUpActionState,
  formData: FormData,
): Promise<SignUpActionState> {
  const parsedData = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsedData.success) {
    return {
      errors: parsedData.error.issues.map(issue => issue.message),
    };
  }

  const supabase = await createClient();
  const { email, password } = parsedData.data;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.status === 429) {
      return {
        errors: [
          'Muitas tentativas de cadastro. Aguarde alguns minutos e tente novamente.',
        ],
      };
    }

    return {
      errors: ['Não foi possível criar sua conta. Tente novamente.'],
    };
  }

  if (data.user && data.session) {
    try {
      await syncAuthUser(data.user);
    } catch (syncError) {
      console.error('Erro ao sincronizar novo usuário', syncError);
      await supabase.auth.signOut();
      return { errors: ['Não foi possível preparar sua conta'] };
    }

    redirect('/');
  }

  return {
    errors: [],
    message: 'Cadastro realizado. Confira seu e-mail para confirmar a conta.',
  };
}
