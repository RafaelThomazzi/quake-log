import { WORLD_TAG } from "../constants";
import { GameData, Game } from "../typings";

export const newGame = (currentIndex: number): Game => {
  return {
    [`game_${currentIndex}`]: {
      total_kills: 0,
      players: [],
      kills: {},
      kills_by_means: {},
    },
  };
};

export const getPlayerName = ({
  gameData,
  line,
}: {
  gameData: GameData;
  line: string;
}): GameData => {
  const startIndex = line.indexOf("n\\");
  const endIndex = line.indexOf("\\t") - 1;
  const playerName = line
    .trim()
    .substring(startIndex, endIndex)
    .replace(/\\/g, "");

  if (!gameData.players.includes(playerName)) {
    gameData.players = [...gameData?.players, playerName];
  }
  return gameData;
};

export const processKill = ({
  gameData,
  splittedLine,
}: {
  gameData: GameData;
  splittedLine: string[];
}): GameData => {
  gameData.total_kills++;
  const killer = splittedLine[5];
  gameData = getMeansOfDeath({ gameData, splittedLine });

  if (killer === WORLD_TAG) {
    gameData = killedByWorld({ gameData, splittedLine });
    return gameData;
  }

  gameData = killedByPlayer({ gameData, splittedLine, killer });
  return gameData;
};

const getMeansOfDeath = ({
  gameData,
  splittedLine,
}: {
  gameData: GameData;
  splittedLine: string[];
}): GameData => {
  const meansOfDeath = String(splittedLine.at(-1));

  if (typeof gameData.kills_by_means[meansOfDeath] === "number") {
    gameData.kills_by_means[meansOfDeath]++;
    return gameData;
  }

  gameData.kills_by_means[meansOfDeath] = 1;
  return gameData;
};

const killedByPlayer = ({
  gameData,
  killer,
  splittedLine,
}: {
  gameData: GameData;
  killer: string;
  splittedLine: string[];
}): GameData => {
  for (let position = 6; position < splittedLine.length; position++) {
    if (splittedLine[position] === "killed") {
      break;
    }
    killer += ` ${splittedLine[position]}`;
  }
  if (!gameData.kills[killer] || typeof gameData.kills[killer] !== "number") {
    gameData.kills[killer] = 0;
  }

  gameData.kills[killer] = Number(gameData.kills[killer] + 1);
  return gameData;
};

const killedByWorld = ({
  splittedLine,
  gameData,
}: {
  splittedLine: string[];
  gameData: GameData;
}): GameData => {
  const killedBy = splittedLine.indexOf("killed");
  let killedPlayer = splittedLine[killedBy + 1];

  for (let position = killedBy + 2; position < splittedLine.length; position++) {
    if (splittedLine[position] === "by") {
      break;
    }
    killedPlayer += ` ${splittedLine[position]}`;
  }

  if (!gameData.kills[killedPlayer] || typeof gameData.kills[killedPlayer] !== "number") {
    gameData.kills[killedPlayer] = 0;
  }
  gameData.kills[killedPlayer] = Number(gameData.kills[killedPlayer] - 1);
  return gameData;
};