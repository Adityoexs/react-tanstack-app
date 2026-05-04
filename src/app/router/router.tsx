import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { getAuthState } from '../../features/auth/auth'

export const router = createRouter({
  routeTree,
  context: { auth: getAuthState() },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
