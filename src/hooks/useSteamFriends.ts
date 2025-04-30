import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect } from 'react'
import { useMainStore } from '@/stores/main'

type SteamFriendsResponse = {
  steam_profile_url: string
  steam_username: string
  steam_avatar: string
  steam_id: string
}[]

export function useSteamFriends(token: string | null) {
  const setFriends = useMainStore((state) => state.setFriends)

  const query = useQuery({
    queryKey: ['steamFriends'],
    queryFn: async (): Promise<SteamFriendsResponse> => {
      const response = await axios.get('/steam/friends', {
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 20, // 20 minutes
  })

  useEffect(() => {
    if (query.data) {
      const sortedFriends = [...query.data].sort((a, b) => {
        const nameA = a.steam_username.toLowerCase() || "";
        const nameB = b.steam_username.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      })
      setFriends(sortedFriends)
    }
  }, [query.data, setFriends])

  return query;
}
