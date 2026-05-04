import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryClient } from '../../app/providers/query-client'
import { usersListQueryOptions, useCreateUserMutation, useDeleteUserMutation, useUpdateUserMutation } from '../../features/users/api/users.queries'
import type { User, UsersSortBy } from '../../features/users/types'
import { UsersTable } from '../../features/users/components/users-table'
import { UserFormModal } from '../../features/users/components/user-form-modal'
import { useToast } from '../../shared/lib/toast'

const searchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(10),
  sortBy: z.enum(['id', 'name', 'username', 'email']).catch('id'),
  sortDir: z.enum(['asc', 'desc']).catch('asc'),
})

export const Route = createFileRoute('/users/')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => { await queryClient.ensureQueryData(usersListQueryOptions(deps)) },
  component: UsersPage,
})

function UsersPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const toast = useToast()
  const { data, isFetching, isError, error } = useQuery(usersListQueryOptions(search))
  const createMutation = useCreateUserMutation(search)
  const updateMutation = useUpdateUserMutation(search)
  const deleteMutation = useDeleteUserMutation(search)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const saving = createMutation.isPending || updateMutation.isPending
  const pageData = useMemo(
    () => data ?? { rows: [], total: 0, page: search.page, pageSize: search.pageSize },
    [data, search.page, search.pageSize],
  )

  if (isError) return <p>Error: {(error as Error).message}</p>

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Users</h2>
        <button onClick={() => setCreateOpen(true)}>+ Create user</button>
      </div>
      <UsersTable
        rows={pageData.rows} total={pageData.total} page={pageData.page} pageSize={pageData.pageSize}
        sortBy={search.sortBy} sortDir={search.sortDir} loading={isFetching}
        onPageChange={(p) => navigate({ search: (prev) => ({ ...prev, page: p }) })}
        onPageSizeChange={(s) => navigate({ search: (prev) => ({ ...prev, pageSize: s, page: 1 }) })}
        onSortChange={(sortBy: UsersSortBy, sortDir) => navigate({ search: (prev) => ({ ...prev, sortBy, sortDir, page: 1 }) })}
        onEdit={setEditing}
        onDelete={async (user) => {
          if (!window.confirm(`Delete "${user.name}"?`)) return
          try {
            await deleteMutation.mutateAsync(user.id)
            toast.success('User deleted')
          } catch (err) { toast.error((err as Error).message || 'Delete failed') }
        }}
      />
      <UserFormModal open={createOpen} title="Create user" submitLabel="Create" loading={saving}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (payload) => {
          try {
            await createMutation.mutateAsync(payload)
            toast.success('User created')
            setCreateOpen(false)
          } catch (err) { toast.error((err as Error).message || 'Create failed') }
        }}
      />
      <UserFormModal open={!!editing} title="Edit user" submitLabel="Save changes" loading={saving}
        initial={editing ? { name: editing.name, username: editing.username, email: editing.email } : undefined}
        onClose={() => setEditing(null)}
        onSubmit={async (payload) => {
          if (!editing) return
          try {
            await updateMutation.mutateAsync({ id: editing.id, payload })
            toast.success('User updated')
            setEditing(null)
          } catch (err) { toast.error((err as Error).message || 'Update failed') }
        }}
      />
    </section>
  )
}
