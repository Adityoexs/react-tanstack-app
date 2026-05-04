import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'

type ToastItem = { id: number; type: 'success' | 'error'; message: string }
type ToastContextType = { success: (m: string) => void; error: (m: string) => void }

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<ToastItem[]>([])
  const api = useMemo<ToastContextType>(() => ({
    success(message) {
      const id = Date.now() + Math.random()
      setItems((p) => [...p, { id, type: 'success', message }])
      setTimeout(() => setItems((p) => p.filter((x) => x.id !== id)), 2500)
    },
    error(message) {
      const id = Date.now() + Math.random()
      setItems((p) => [...p, { id, type: 'error', message }])
      setTimeout(() => setItems((p) => p.filter((x) => x.id !== id)), 3000)
    },
  }), [])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div style={{ position: 'fixed', top: 12, right: 12, display: 'grid', gap: 8, zIndex: 9999 }}>
        {items.map((item) => (
          <div key={item.id}
            style={{ padding: '10px 12px', borderRadius: 8, color: 'white', minWidth: 220,
              background: item.type === 'success' ? '#16a34a' : '#dc2626' }}>
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
