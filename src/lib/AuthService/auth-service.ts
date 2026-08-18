import 'server-only';

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { cache } from 'react';
import { db } from '@/repositories/client';
import { createClient } from '@/lib/supabase/server';

export type AuthenticatedUser = {
  id: string;
  email: string;
};

export const getCurrentUser = cache(
  async (): Promise<AuthenticatedUser | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user?.email) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email,
    };
  },
);

export async function syncAuthUser(user: SupabaseUser) {
  if (!user.email) {
    throw new Error('O usuário autenticado não possui e-mail');
  }

  return db.user.upsert({
    where: { id: user.id },
    update: { email: user.email },
    create: {
      id: user.id,
      email: user.email,
    },
  });
}
