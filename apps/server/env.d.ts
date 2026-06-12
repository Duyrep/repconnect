export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';

      PORT: number;
      API_URL: string;
      FRONTEND_URL: string;
      ISSUER: string;

      JWT_SECRET: string;
      ACCESS_SECRET: string;
      REFRESH_SECRET: string;
      MESSAGE_SECRET: string;

      MONGODB_URI: string;

      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
    }
  }
}
