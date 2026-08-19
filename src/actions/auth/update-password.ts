'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/AuthService/auth-service';
import { createClient } from '@/lib/supabase/server';

export type UpdatePasswordState = {
  errors: string[];
  message?: string;
};

const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Informe sua senha atual'),
    newPassword: z
      .string()
      .min(8, 'A nova senha deve possuir ao menos 8 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Confirme a nova senha'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'As novas senhas não coincidem',
    path: ['confirmPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: 'A nova senha deve ser diferente da senha atual',
    path: ['newPassword'],
  });

export async function updatePasswordAction(
  _previousState: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const parsedData = updatePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
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
      errors: ['Sua sessão expirou. Entre novamente para alterar a senha.'],
    };
  }

  const supabase = await createClient();
  const { currentPassword, newPassword } = parsedData.data;
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
    current_password: currentPassword,
  });

  if (error) {
    console.error('Erro ao alterar senha do usuário', {
      code: error.code,
      status: error.status,
    });

    if (error.code === 'same_password') {
      return { errors: ['A nova senha deve ser diferente da senha atual.'] };
    }

    if (error.code === 'weak_password') {
      return {
        errors: [
          'A nova senha não atende aos requisitos de segurança configurados.',
        ],
      };
    }

    if (
      error.code === 'invalid_credentials' ||
      error.code === 'reauthentication_not_valid'
    ) {
      return {
        errors: [
          'Não foi possível alterar a senha. Verifique a senha atual e tente novamente.',
        ],
      };
    }

    if (error.code === 'reauthentication_needed') {
      return {
        errors: [
          'Por segurança, entre novamente na sua conta antes de alterar a senha.',
        ],
      };
    }

    return {
      errors: ['Não foi possível alterar a senha. Tente novamente mais tarde.'],
    };
  }

  return {
    errors: [],
    message: 'Senha alterada com sucesso.',
  };
}
