export type User = { id: number; name: string; username: string; email: string }
export type UsersSortBy = 'id' | 'name' | 'username' | 'email'
export type SortDir = 'asc' | 'desc'
export type UsersListParams = { page: number; pageSize: number; sortBy: UsersSortBy; sortDir: SortDir }
export type UsersListResponse = { rows: User[]; total: number; page: number; pageSize: number }
