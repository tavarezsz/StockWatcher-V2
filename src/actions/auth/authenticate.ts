'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { syncAuthUser } from '@/lib/AuthService/auth-service';
import { createClient } from '@/lib/supabase/server';

export type AuthActionState = {
  errors: string[];
  message?: string;
};

const authSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha deve possuir ao menos 6 caracteres'),
  intent: z.enum(['login', 'signup']),
});

export async function authenticateAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsedData = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    intent: formData.get('intent'),
  });

  if (!parsedData.success) {
    return {
      errors: parsedData.error.issues.map(issue => issue.message),
    };
  }

  const supabase = await createClient();
  const { email, password, intent } = parsedData.data;

  if (intent === 'login') {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return { errors: ['E-mail ou senha inválidos'] };
    }

    try {
      await syncAuthUser(data.user);
    } catch (syncError) {
      console.error('Erro ao sincronizar usuário autenticado', syncError);
      await supabase.auth.signOut();
      return { errors: ['Não foi possível preparar sua conta'] };
    }

    redirect('/');
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { errors: [error.message] };
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
