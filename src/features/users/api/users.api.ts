import { fetchJSON } from '../../../shared/lib/fetcher'
import type { User, UsersListParams, UsersListResponse } from '../types'

const API_BASE = 'http://localhost:4000'

export function getUsers(params: UsersListParams) {
  const qs = new URLSearchParams({
    page: String(params.page), pageSize: String(params.pageSize),
    sortBy: params.sortBy, sortDir: params.sortDir,
  })
  return fetchJSON<UsersListResponse>(`${API_BASE}/users?${qs}`)
}

export function createUser(payload: Omit<User, 'id'>) {
  return fetchJSON<User>(`${API_BASE}/users`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function updateUser(id: number, payload: Omit<User, 'id'>) {
  return fetchJSON<User>(`${API_BASE}/users/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function deleteUser(id: number) {
  return fetchJSON<{ success: true }>(`${API_BASE}/users/${id}`, { method: 'DELETE' })
}
