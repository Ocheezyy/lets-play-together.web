import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login-failed')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/login-failed"!</div>
}
