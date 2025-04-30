import { create } from 'zustand'
import { persist } from 'zustand/middleware'


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

type Game = {
  id: string
  name: string
  // add more fields as needed
}

type MainStore = {
  token: string | null
  isLoggedIn: boolean
  gamesOwned: Game[]
  userInfo: UserInfo | null
  friends: Friend[]
  setToken: (token: string) => void
  clearAuth: () => void
  setGamesOwned: (games: Game[]) => void
  setUserInfo: (userInfo: UserInfo) => void
  setFriends: (friends: Friend[]) => void
}

export const useMainStore = create<MainStore>()(
  persist(
    (set) => ({
      token: null,
      isLoggedIn: false,
      gamesOwned: [],
      userInfo: null,
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
          gamesOwned: [],
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
        }))
    }),
    {
      name: 'lets-play-storage', // localStorage key
    }
  )
)
