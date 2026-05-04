import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table'
import type { User, UsersSortBy, SortDir } from '../types'

const ch = createColumnHelper<User>()

export function UsersTable(props: {
  rows: User[]; total: number; page: number; pageSize: number
  sortBy: UsersSortBy; sortDir: SortDir; loading?: boolean
  onPageChange: (p: number) => void; onPageSizeChange: (s: number) => void
  onSortChange: (sortBy: UsersSortBy, sortDir: SortDir) => void
  onEdit: (u: User) => void; onDelete: (u: User) => void
}) {
  const totalPages = Math.max(1, Math.ceil(props.total / props.pageSize))
  const sorting: SortingState = [{ id: props.sortBy, desc: props.sortDir === 'desc' }]
  const columns = [
    ch.accessor('id', { header: 'ID' }),
    ch.accessor('name', { header: 'Name' }),
    ch.accessor('username', { header: 'Username' }),
    ch.accessor('email', { header: 'Email' }),
    ch.display({
      id: 'actions', header: 'Actions',
      cell: (info) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => props.onEdit(info.row.original)}>Edit</button>
          <button onClick={() => props.onDelete(info.row.original)}>Delete</button>
        </div>
      ),
    }),
  ]
  const table = useReactTable({
    data: props.rows, columns, state: { sorting },
    manualSorting: true, manualPagination: true, pageCount: totalPages,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      const first = next[0]
      if (!first) return
      props.onSortChange(first.id as UsersSortBy, first.desc ? 'desc' : 'asc')
    },
  })

  return (
    <div>
      {props.loading && <p>Refreshing...</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id}
                  onClick={h.column.id === 'actions' ? undefined : h.column.getToggleSortingHandler()}
                  style={{ borderBottom: '1px solid #ddd', padding: 8, textAlign: 'left', cursor: h.column.id === 'actions' ? 'default' : 'pointer' }}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {props.rows.map((r) => (
            <tr key={r.id}>
              {(['id', 'name', 'username', 'email'] as const).map((k) => (
                <td key={k} style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{r[k]}</td>
              ))}
              <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>
                <button onClick={() => props.onEdit(r)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => props.onDelete(r)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
        <button disabled={props.page <= 1} onClick={() => props.onPageChange(props.page - 1)}>Prev</button>
        <span>Page {props.page} / {totalPages}</span>
        <button disabled={props.page >= totalPages} onClick={() => props.onPageChange(props.page + 1)}>Next</button>
        <select value={props.pageSize} onChange={(e) => props.onPageSizeChange(Number(e.target.value))}>
          {[10, 20, 50].map((n) => <option key={n} value={n}>{n}/page</option>)}
        </select>
      </div>
    </div>
  )
}
