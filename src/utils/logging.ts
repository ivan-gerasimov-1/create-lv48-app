export type TLogger = {
  info(message: string): void;
  debug(payload: unknown): void;
  error(message: string): void;
};

export function createLogger(): TLogger {
  return {
    info(message) {
      console.log(message);
    },
    debug(payload) {
      if (process.env["DEBUG"] === "1") {
        console.log(payload);
      }
    },
    error(message) {
      console.error(message);
    },
  };
}
