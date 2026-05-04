import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <section>
      <h1>React + TanStack Starter</h1>
      <p>Go to Users for server pagination/sorting + CRUD. Dashboard is protected.</p>
    </section>
  ),
})
