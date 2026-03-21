export type TValidationSuccess<T> = {
  ok: true;
  value: T;
};

export type TValidationFailure = {
  ok: false;
  reason: string;
};

export type TValidationResult<T> = TValidationSuccess<T> | TValidationFailure;
