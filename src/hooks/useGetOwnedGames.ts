import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {useMainStore} from "@/stores/main.ts";
import {useEffect} from "react";
import {GetOwnedGamesResponse} from "@/lib/types.ts";

export function useGetOwnedGames(token: string | null) {
  const { setGamesOwned } = useMainStore();


  const query = useQuery({
    queryKey: ['ownedGames'],
    queryFn: async (): Promise<GetOwnedGamesResponse> => {
      const response = await axios.get('/steam/owned_games', {
        baseURL: import.meta.env.VITE_API_URL, // or hardcode your API URL
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    },
    enabled: !!token, // prevents query from running if token is null
    staleTime: 1000 * 60 * 20, // cache for 20 minutes
  });

  useEffect(() => {
    if (query.data) {
      setGamesOwned(query.data.games)
    }
  }, [query.data, setGamesOwned]);

  return query;
}