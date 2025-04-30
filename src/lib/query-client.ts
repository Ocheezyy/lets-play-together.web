import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const token = localStorage.getItem('authToken')
        // @ts-expect-error queryKey problem will check
        const response = await fetch(queryKey[0], {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      },
    },
  },
})

export default queryClient