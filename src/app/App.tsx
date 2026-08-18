import { Toaster } from 'sonner'
import { Providers } from './providers'

export const App = () => {
  return (
    <>
      <Providers />
      <Toaster richColors position="top-right" closeButton />
    </>
  )
}
