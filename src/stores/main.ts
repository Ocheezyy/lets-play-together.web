import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {Game} from "@/lib/types.ts";


type UserInfo = {
  id: string
  username?: string
  avatarUrl?: string
  profileUrl?: string
}

type Friend = {
  steam_id: string;
  steam_username: string;
  steam_profile_url: string;
  steam_avatar: string;
}

type MainStore = {
  token: string | null
  isLoggedIn: boolean
  gamesOwned: Record<number, Game>
  userInfo: UserInfo | null
  friends: Friend[]
  commonGames: Game[]
  setToken: (token: string) => void
  clearAuth: () => void
  setGamesOwned: (games: Record<number, Game>) => void
  setUserInfo: (userInfo: UserInfo) => void
  setFriends: (friends: Friend[]) => void
  setCommonGames: (games: Game[]) => void
}

export const useMainStore = create<MainStore>()(
  persist(
    (set) => ({
      token: null,
      isLoggedIn: false,
      gamesOwned: {},
      userInfo: null,
      commonGames: [],
      friends: [],
      setToken: (token) =>
        set(() => ({
          token,
          isLoggedIn: true,
        })),
      clearAuth: () =>
        set(() => ({
          token: null,
          isLoggedIn: false,
          gamesOwned: {},
          userInfo: null,
        })),
      setGamesOwned: (games) =>
        set(() => ({
          gamesOwned: games,
        })),
      setUserInfo: (info) =>
        set(() => ({
          userInfo: info,
        })),
      setFriends: (friends: Friend[]) =>
        set(() => ({
          friends: friends,
        })),
      setCommonGames: (games) =>
        set(() => ({
          commonGames: games,
        }))
    }),
    {
      name: 'lets-play-storage', // localStorage key
    }
  )
)
