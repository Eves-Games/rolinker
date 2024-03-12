export { auth as middleware } from '@/auth';

export const config = {
    matcher: ['/manage/:path*', '/settings/:path*'],
};