export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";

      NEXT_PUBLIC_BACKEND_URL: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_WEB_URL: string;
      NEXT_PUBLIC_WEBSOCKET_URL: string;
    }
  }
}
