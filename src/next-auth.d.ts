import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      image?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
  }

  interface Profile {
    id: string;
    username: string;
    avatar: boolean;
    image_url: string;
  }
}
