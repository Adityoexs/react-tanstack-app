import { useEffect, useState } from 'react'
import type { User } from '../types'

type Payload = Omit<User, 'id'>

export function UserFormModal(props: {
  open: boolean; title: string; submitLabel: string
  initial?: Payload; loading?: boolean
  onClose: () => void; onSubmit: (p: Payload) => Promise<void> | void
}) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    setName(props.initial?.name ?? '')
    setUsername(props.initial?.username ?? '')
    setEmail(props.initial?.email ?? '')
  }, [props.initial, props.open])

  if (!props.open) return null

  return (
    <div role="dialog" aria-modal="true"
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'grid', placeItems: 'center', zIndex: 1000 }}
      onClick={props.onClose}>
      <div style={{ background: 'white', borderRadius: 10, padding: 16, width: 420, maxWidth: '95vw' }}
        onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{props.title}</h3>
        <form onSubmit={async (e) => { e.preventDefault(); await props.onSubmit({ name, username, email }) }}
          style={{ display: 'grid', gap: 10 }}>
          <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input required placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
            <button type="button" onClick={props.onClose} disabled={props.loading}>Cancel</button>
            <button type="submit" disabled={props.loading}>{props.loading ? 'Saving...' : props.submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
