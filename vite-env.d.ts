/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Ajoute ici toutes les autres variables que tu utilises
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}