import pino from "pino";

export default pino({
  enabled: true,
  level: "debug",
  transport: {
    target: "pino-pretty",
    options: {
      levelFirst: true,
      colorize: true,
    },
  },
});
