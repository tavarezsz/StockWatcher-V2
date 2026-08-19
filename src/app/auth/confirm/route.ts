import type { EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { syncAuthUser } from '@/lib/AuthService/auth-service';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get('type') as EmailOtpType | null;
  const requestedNext = request.nextUrl.searchParams.get('next');
  const next = getSafeNextPath(requestedNext);
  const supabase = await createClient();

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      return redirectAfterAuthentication(request, data.user, next);
    }
  }

  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error && data.user) {
      const destination =
        type === 'recovery' ? '/auth/reset-password' : next;
      return redirectAfterAuthentication(request, data.user, destination);
    }
  }

  const failureDestination =
    type === 'recovery' || next === '/auth/reset-password'
      ? '/auth/forgot-password'
      : '/login';

  return NextResponse.redirect(new URL(failureDestination, request.url));
}

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/';
  return next;
}

async function redirectAfterAuthentication(
  request: NextRequest,
  user: Parameters<typeof syncAuthUser>[0],
  destination: string,
) {
  const supabase = await createClient();

  try {
    await syncAuthUser(user);
    const response = NextResponse.redirect(new URL(destination, request.url));
    response.headers.set(
      'Cache-Control',
      'private, no-cache, no-store, must-revalidate, max-age=0',
    );
    return response;
  } catch (syncError) {
    console.error('Erro ao sincronizar usuário confirmado', syncError);
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
