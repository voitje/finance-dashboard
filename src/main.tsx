import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/styles/globals.css'
import { App } from '@/app/App'

async function enableMocking() {
  if (!import.meta.env.DEV) return
  const { initMocks } = await import('@/mocks')
  await initMocks()
}

const rootElement = document.getElementById('root')!

rootElement.innerHTML = `
  <div style="display:flex;min-height:100vh;align-items:center;justify-content:center;font-family:system-ui,sans-serif;color:#334155">
    <div style="text-align:center">
      <div style="width:2.5rem;height:2.5rem;margin:0 auto 1rem;border:4px solid #e2e8f0;border-top-color:#0f172a;border-radius:9999px;animation:spin 0.8s linear infinite"></div>
      <p>Инициализация MSW…</p>
    </div>
  </div>
  <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
`

void enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
