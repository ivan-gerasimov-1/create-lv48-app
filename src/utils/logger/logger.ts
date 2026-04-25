import type { ILogger } from "./types";

export class Logger implements ILogger {
  public info(message: string): void {
    console.log(message);
  }

  public debug(payload: unknown): void {
    if (process.env["DEBUG"] === "1") {
      console.log(payload);
    }
  }

  public error(message: string): void {
    console.error(message);
  }
}
