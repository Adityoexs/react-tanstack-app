import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser, deleteUser, getUsers, updateUser } from './users.api'
import type { User, UsersListParams, UsersListResponse } from '../types'

export const usersKeys = {
  all: ['users'] as const,
  list: (params: UsersListParams) => [...usersKeys.all, 'list', params] as const,
}

export const usersListQueryOptions = (params: UsersListParams) =>
  queryOptions({
    queryKey: usersKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: (prev) => prev,
  })

export function useCreateUserMutation(p: UsersListParams) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<User, 'id'>) => createUser(payload),
    onMutate: async (newUser) => {
      await qc.cancelQueries({ queryKey: usersKeys.list(p) })
      const prev = qc.getQueryData<UsersListResponse>(usersKeys.list(p))
      if (prev) qc.setQueryData<UsersListResponse>(usersKeys.list(p), {
        ...prev, rows: [{ id: -Date.now(), ...newUser }, ...prev.rows].slice(0, prev.pageSize), total: prev.total + 1,
      })
      return { prev }
    },
    onError: (_e, _v, ctx) => { if (ctx?.prev) qc.setQueryData(usersKeys.list(p), ctx.prev) },
    onSettled: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  })
}

export function useUpdateUserMutation(p: UsersListParams) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Omit<User, 'id'> }) => updateUser(id, payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: usersKeys.list(p) })
      const prev = qc.getQueryData<UsersListResponse>(usersKeys.list(p))
      if (prev) qc.setQueryData<UsersListResponse>(usersKeys.list(p), {
        ...prev, rows: prev.rows.map((r) => (r.id === id ? { ...r, ...payload } : r)),
      })
      return { prev }
    },
    onError: (_e, _v, ctx) => { if (ctx?.prev) qc.setQueryData(usersKeys.list(p), ctx.prev) },
    onSettled: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  })
}

export function useDeleteUserMutation(p: UsersListParams) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: usersKeys.list(p) })
      const prev = qc.getQueryData<UsersListResponse>(usersKeys.list(p))
      if (prev) qc.setQueryData<UsersListResponse>(usersKeys.list(p), {
        ...prev, rows: prev.rows.filter((r) => r.id !== id), total: Math.max(0, prev.total - 1),
      })
      return { prev }
    },
    onError: (_e, _v, ctx) => { if (ctx?.prev) qc.setQueryData(usersKeys.list(p), ctx.prev) },
    onSettled: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  })
}
