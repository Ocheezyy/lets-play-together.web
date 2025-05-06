
export type GetOwnedGamesResponse = {
  game_count: number;
  games: Record<number, Game>;
};


export type GetFriendsGamesResponse = {
  games: Record<string, Game[]>;
};

export type Game = {
  appid: number;
  name: string;
  playtime_forever: number; // minutes
  playtime_2weeks: number; //minutes
  img_icon_url: string;
};