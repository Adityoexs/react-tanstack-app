import { createRootRouteWithContext } from '@tanstack/react-router'
import type { AuthState } from '../features/auth/auth'
import { RootLayout } from '../app/router/root'

export type RouterContext = { auth: AuthState }

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})
