import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {useMainStore} from "@/stores/main.ts";
import {useEffect} from "react";

type SteamMeResponse = {
  steam_profile_url: string
  steam_persona: string
  steam_avatar: string
  steam_id: string
}

export function useSteamUser(token: string | null) {
  const setUserInfo = useMainStore((state) => state.setUserInfo);


  const query = useQuery({
    queryKey: ['steamUser'],
    queryFn: async (): Promise<SteamMeResponse> => {
      const response = await axios.get('/steam/me', {
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

      setUserInfo({
        id: query.data.steam_id,
        username: query.data.steam_persona,
        avatarUrl: query.data.steam_avatar,
        profileUrl: query.data.steam_profile_url
      })
    }
  }, [query.data, setUserInfo]);

  return query;
}