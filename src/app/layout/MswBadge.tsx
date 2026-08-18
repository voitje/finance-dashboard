import { useEffect, useState } from 'react'

/** Dev-only indicator that MSW worker is active */
export const MswBadge = () => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!import.meta.env.DEV) return

    const check = () => {
      if (window.__MSW_READY__) {
        setReady(true)
        return true
      }
      return false
    }

    if (check()) return

    const id = window.setInterval(() => {
      if (check()) window.clearInterval(id)
    }, 200)

    return () => window.clearInterval(id)
  }, [])

  if (!import.meta.env.DEV || !ready) return null

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-50">
      <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white shadow-md">
        MSW Ready
      </span>
    </div>
  )
}
