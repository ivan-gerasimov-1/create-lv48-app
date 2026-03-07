export type ValidationSuccess<T> = {
  ok: true;
  value: T;
};

export type ValidationFailure = {
  ok: false;
  reason: string;
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;
