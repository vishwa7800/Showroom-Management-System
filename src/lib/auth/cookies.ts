// Shreeji Hero Showroom ERP - Cookie Configuration

export const SESSION_COOKIE_NAME = 'shreeji_hero_session';

export const COOKIE_OPTIONS = {
  name: SESSION_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 8, // 8 hours in seconds
};
