export type TSuccess<T> = {
  ok: true;
  value: T;
};

export type TFailure = {
  ok: false;
  reason: string;
};

export type TResult<T> = TSuccess<T> | TFailure;
