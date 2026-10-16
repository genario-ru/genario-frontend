/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ViteTypeOptions {
  // Ограничиваем использование неизвестных env переменных
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  // Недоступны на клиенте
  readonly PORT: string;
  readonly SW_DEV: string;

  // Доступны на клиенте
  readonly VITE_BASE_URL: string;
  readonly VITE_BASE_API_URL: string;
  readonly VITE_GLITCHTIP_DSN?: string;
  readonly VITE_GLITCHTIP_ENVIRONMENT?: string;
  readonly VITE_GLITCHTIP_RELEASE?: string;
  readonly VITE_UMAMI_URL?: string;
  readonly VITE_UMAMI_WEBSITE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
