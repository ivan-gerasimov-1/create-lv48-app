import type { TFailure, TSuccess } from "./types";

export class Either {
  public static success<T>(value: T): TSuccess<T> {
    return {
      ok: true,
      value,
    };
  }

  public static failure(reason: string): TFailure {
    return {
      ok: false,
      reason,
    };
  }
}
