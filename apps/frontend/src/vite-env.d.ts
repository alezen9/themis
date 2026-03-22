/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_VERIFICATION_DEBUGGER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
