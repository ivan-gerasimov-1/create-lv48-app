export interface ILogger {
  info(message: string): void;
  debug(payload: unknown): void;
  error(message: string): void;
}
