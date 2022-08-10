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
  const endIndex = line.indexOf("\\t");
  const playerName = removeSpecialCharacters(line, startIndex, endIndex);

  if (!gameData.players.includes(playerName)) {
    gameData.players.push(playerName)
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
  let newGameData = gameData;
  newGameData.total_kills++;
  const killer = splittedLine[5];

  newGameData = getMeansOfDeath({ gameData: newGameData, splittedLine });
  if (killer === WORLD_TAG) {
    newGameData = killedByWorld({ gameData: newGameData, splittedLine });
    return newGameData;
  }

  newGameData = killedByPlayer({ gameData: newGameData, splittedLine, killer });
  return newGameData;
};

const getMeansOfDeath = ({
  gameData,
  splittedLine,
}: {
  gameData: GameData;
  splittedLine: string[];
}): GameData => {
  const meansOfDeath = String(splittedLine.at(-1));

  gameData.kills_by_means[meansOfDeath] != undefined
    ? gameData.kills_by_means[meansOfDeath]++
    : (gameData.kills_by_means[meansOfDeath] = 1);
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
  const killedPosition = splittedLine.indexOf("killed");
  for (let position = 6; position < killedPosition; position++) {
    killer += ` ${splittedLine[position]}`;
  }

  gameData.kills[killer] != undefined
    ? gameData.kills[killer]++
    : (gameData.kills[killer] = 1);
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
  const byPosition = splittedLine.indexOf("by");
  let killedPlayer = splittedLine[killedBy + 1];

  for (let position = killedBy + 2; position < byPosition; position++) {
    killedPlayer += ` ${splittedLine[position]}`;
  }

  gameData.kills[killedPlayer] != undefined
    ? gameData.kills[killedPlayer]--
    : (gameData.kills[killedPlayer] = -1);
  return gameData;
};

const removeSpecialCharacters = (line: string, startIndex: number, endIndex: number): string => {
  const playerName = line
  .trim()
  .substring(startIndex, endIndex)
  .replace('\\t', "").replace('n\\', "").replace('\\', "");

  return playerName.replace('\\', "")
};