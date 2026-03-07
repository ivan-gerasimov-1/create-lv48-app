export type Logger = {
  info(message: string): void;
  debug(payload: unknown): void;
};

export function createLogger(): Logger {
  return {
    info(message) {
      console.log(message);
    },
    debug(payload) {
      if (process.env.DEBUG === '1') {
        console.log(payload);
      }
    },
  };
}
