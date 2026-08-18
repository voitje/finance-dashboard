/// <reference types="vite/client" />

import type { QueryClient } from '@tanstack/query-core'

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__?: QueryClient
    __MSW_READY__?: boolean
  }
}

export {}
