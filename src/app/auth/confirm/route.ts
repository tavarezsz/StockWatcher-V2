import type { EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { syncAuthUser } from '@/lib/AuthService/auth-service';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get('type') as EmailOtpType | null;

  if (tokenHash && type) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error && data.user) {
      try {
        await syncAuthUser(data.user);
        const response = NextResponse.redirect(new URL('/', request.url));
        response.headers.set(
          'Cache-Control',
          'private, no-cache, no-store, must-revalidate, max-age=0',
        );
        return response;
      } catch (syncError) {
        console.error('Erro ao sincronizar usuário confirmado', syncError);
        await supabase.auth.signOut();
      }
    }
  }

  return NextResponse.redirect(new URL('/login', request.url));
}
