/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_OSS_UPLOAD_ENABLED?: string;
  readonly PUBLIC_OSS_MAX_FILE_SIZE_MB?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
