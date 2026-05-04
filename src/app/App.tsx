import { QueryProvider } from './providers/query-provider'
import { ToastProvider } from '../shared/lib/toast'
import { AppRouterProvider } from './providers/router-provider'

export function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <AppRouterProvider />
      </ToastProvider>
    </QueryProvider>
  )
}
