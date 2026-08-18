export async function initMocks(): Promise<void> {
  if (!import.meta.env.DEV) return

  const { worker } = await import('./browser')

  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })

  console.info('[MSW] Mock Service Worker ready')
  window.__MSW_READY__ = true
}
