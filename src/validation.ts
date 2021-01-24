export type Validator<T, F> = (t: T | undefined, f: F | undefined) => boolean;

export type Validators<T, F> = {
  [rule: string]: Validator<T, F>;
}

export type ValidationRules<T> = Partial<{
  [K in keyof T]: Validators<T[K], T>;
}>

export type ValidationErrors<T, Rules extends ValidationRules<T>> = Partial<{
  [K in keyof T]: {
    [R in keyof Rules[K]]: boolean;
  } & { hasErrors: boolean }
}> & { hasErrors: boolean }

export function errors<T, Rules extends ValidationRules<T>>(t: T | undefined, rules: Rules) {
  const res: ValidationErrors<T, Rules> = {} as any;

  res.hasErrors = false;

  Object.entries(rules).forEach((
    <K extends keyof T, V extends Validators<T[K], T>>([k, v]: [K, V]) => {
      const _t = t ? t[k] : undefined;
      const _r = {} as any;
      _r.hasErrors = false;

      Object.entries(v).forEach((
        <_K extends keyof V>([_k, _v]: [_K, Validator<T[K], T>]) => {
          _r[_k] = !_v(_t, t);
          _r.hasErrors = _r.hasErrors || _r[_k];
        }
      ) as any);

      res[k] = _r;
      res.hasErrors = res.hasErrors || _r.hasErrors;
    }
  ) as any);

  return res;
}
