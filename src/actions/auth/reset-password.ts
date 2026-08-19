'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/AuthService/auth-service';
import { createClient } from '@/lib/supabase/server';

export type ResetPasswordState = {
  errors: string[];
  message?: string;
};

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'A nova senha deve possuir ao menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export async function resetPasswordAction(
  _previousState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsedData = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsedData.success) {
    return {
      errors: parsedData.error.issues.map(issue => issue.message),
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return {
      errors: [
        'O link de recuperação é inválido ou expirou. Solicite um novo e-mail.',
      ],
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsedData.data.password,
  });

  if (error) {
    console.error('Erro ao redefinir senha do usuário', {
      code: error.code,
      status: error.status,
    });

    if (error.code === 'same_password') {
      return { errors: ['A nova senha deve ser diferente da senha anterior.'] };
    }

    if (error.code === 'weak_password') {
      return {
        errors: [
          'A nova senha não atende aos requisitos de segurança configurados.',
        ],
      };
    }

    return {
      errors: [
        'Não foi possível redefinir a senha. Solicite um novo e-mail e tente novamente.',
      ],
    };
  }

  return {
    errors: [],
    message: 'Senha redefinida com sucesso.',
  };
}
