import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'

export const withRouter = () => <RouterProvider router={router} />
