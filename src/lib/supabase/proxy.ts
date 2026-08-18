import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseCookieOptions } from './cookie-options';

export async function updateSession(request: NextRequest) {
  const legacyStockRoute = request.nextUrl.pathname.match(
    /^\/stock\/([^/]+)\.SA$/i,
  );

  if (legacyStockRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/stock/${legacyStockRoute[1]}`;
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: supabaseCookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headersToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          Object.entries(headersToSet).forEach(([name, value]) => {
            response.headers.set(name, value);
          });
        },
      },
    },
  );

  // Essa chamada valida o token e também permite que o cliente SSR renove
  // cookies expirados antes de a rota protegida ser renderizada.
  const { data } = await supabase.auth.getClaims();
  const isPublicRoute =
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname.startsWith('/auth/');

  if (!data?.claims && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (data?.claims && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}
