import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {Game, GetFriendsGamesResponse} from "@/lib/types.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return fetch(url, {
    ...options,
    headers,
  });
}


export async function findGamesInCommon(friendsGames: GetFriendsGamesResponse) {
  const { games } = friendsGames;
  const userCount = Object.keys(games).length;
  const gameMap = new Map<number, { game: Game; count: number }>();

  for (const gameList of Object.values(games)) {
    const seen = new Set<number>();

    for (const game of gameList) {
      // Avoid double-counting a game per user
      if (seen.has(game.appid)) continue;
      seen.add(game.appid);

      if (!gameMap.has(game.appid)) {
        gameMap.set(game.appid, { game, count: 1 });
      } else {
        const entry = gameMap.get(game.appid)!;
        entry.count += 1;
      }
    }
  }

  // Return games that all users have
  return Array.from(gameMap.values())
    .filter(entry => entry.count === userCount)
    .map(entry => entry.game);
}