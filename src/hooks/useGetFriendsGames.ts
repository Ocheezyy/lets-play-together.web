import { useMutation } from '@tanstack/react-query';
import axios from 'axios'

export type GetFriendsGamesInput = {
  token: string | null;
  steam_ids: string[];
};

export type Game = {
  appid: string;
  name: string;
  playtime_forever: number; // minutes
  playtime_2weeks: number; //minutes
  img_icon_url: string;
};

export type GetFriendsGamesResponse = {
  games: Record<string, Game[]>;
};

export function useGetFriendsGames() {
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
      console.log(data);
    },
    onError: async (error: Error) => {
      console.error(error);
    }
  });
}