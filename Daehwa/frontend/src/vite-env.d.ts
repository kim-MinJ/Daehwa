interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_TMDB_IMG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}