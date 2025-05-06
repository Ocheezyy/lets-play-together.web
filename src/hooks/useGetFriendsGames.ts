import { useMutation } from '@tanstack/react-query';
import axios from 'axios'
import {GetFriendsGamesResponse} from "@/lib/types.ts";
import {findGamesInCommon} from "@/lib/utils.ts";
import { useMainStore } from "@/stores/main.ts";

export type GetFriendsGamesInput = {
  token: string | null;
  steam_ids: string[];
};


export function useGetFriendsGames() {
  const { setCommonGames } = useMainStore();

  return useMutation<GetFriendsGamesResponse, Error, GetFriendsGamesInput>({
    mutationFn: async (input: GetFriendsGamesInput) => {
      const res =  await axios.post(
        '/steam/friends/games',
        { steam_ids: input.steam_ids },
        {
          baseURL: import.meta.env.VITE_API_URL,
          headers: {
            Authorization: `Bearer ${input.token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      return res.data;
    },
    onSuccess: async (data: GetFriendsGamesResponse) => {
      const gamesInCommon = await findGamesInCommon(data);
      setCommonGames(gamesInCommon);
      console.log(gamesInCommon);
    },
    onError: async (error: Error) => {
      console.error(error);
    }
  });
}