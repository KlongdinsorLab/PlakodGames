/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly URL_PATH: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}