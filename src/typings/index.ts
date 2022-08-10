export type Action = "ClientUserinfoChanged:" | "Kill:" | "InitGame:";

export type GameData = {
  total_kills: number;
  players: string[];
  kills_by_means: {
    [key: string]: number;
  };
  kills: {
    [key: string]: number;
  };
};

export type Game = {
  [key: string]: GameData;
};