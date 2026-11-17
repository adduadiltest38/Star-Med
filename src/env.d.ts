/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Optional JSON endpoint for enquiry forms (Formspree, Web3Forms, custom function…). */
  readonly PUBLIC_FORM_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
