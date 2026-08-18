export const supabaseCookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
};
