import fs from "fs";
import { GAME_ACTIONS, INIT_GAME_TAG, KILL_TAG, PLAYER_TAG } from "./constants";
import { processKill, getPlayerName, newGame } from "./functions";
import logger from "./logger";
import { Action, Game } from "./typings";

const execute = () => {
  try {
    const gameLog = fs.readFileSync("src/data/qgames.log", "utf8").toString();
    let games: Game[] = [];

    const lines = gameLog.split("\n");
    const filteredLines = lines.filter((line) =>
      GAME_ACTIONS.includes(line.trim().split(" ")[1])
    );

    for (const line of filteredLines) {
      const action = line.trim().split(" ")[1] as Action;
      const splittedLine = line.trim().split(" ");

      if (action === INIT_GAME_TAG) {
        const game = newGame(games.length);
        games.push(game);
        continue;
      }

      const currentIndex =
        games.length > 0 ? Number(games.length - 1) : Number(games.length);

      const currentGame = games[currentIndex];
      let gameData = currentGame[`game_${currentIndex}`];

      if (action === PLAYER_TAG) {
        const game = getPlayerName({ gameData, line });
        games[currentIndex] = { [`game_${currentIndex}`]: game };
      }

      if (action == KILL_TAG) {
        const game = processKill({ gameData, splittedLine });
        games[currentIndex] = { [`game_${currentIndex}`]: game };
      }
    }

    for (const game of games) {
      logger.info(game)
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

execute();
