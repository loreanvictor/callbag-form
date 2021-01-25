import { Source } from 'callbag-common';
import { state, StateLike } from 'callbag-state';

import { Form } from './form';
import { Validators, ValidationRules } from './validation';


export type DefaultRule<V, T> = [V, Validators<V, T>];
export type DefaultRules<T> = { [K in keyof T]: DefaultRule<T[K], T>; }
export type ExtractType<V extends DefaultRules<ExtractType<V>>> = { [K in keyof V]: V[K][0]; }
export type ExtractValidations<V extends DefaultRules<ExtractType<V>>> = { [K in keyof V]: V[K][1]; }

export function form<V extends DefaultRules<ExtractType<V>>>(rules: V)
  :Form<ExtractType<V>, StateLike<ExtractType<V>> & Source<ExtractType<V>>, ExtractValidations<V>>;

export function form<T, S extends Source<T>, V extends ValidationRules<T>>(data: S & Source<T>, rules: V)
  : Form<T, S, V>;

export function form<T, S extends Source<T>, V extends ValidationRules<T>>(
  data: (S & Source<T>) | DefaultRules<T>,
  rules?: V
) {
  if (typeof data === 'function') {
    return new Form(data, rules!);
  } else {
    const defaults: T = {} as any;
    const validations: ValidationRules<T> = {} as any;

    Object.entries(data).forEach((
      <K extends keyof T>([k, v]: [K, DefaultRule<T[K], T>]) => {
        defaults[k] = v[0];
        validations[k] = v[1];
      }
    ) as any);

    return new Form(state(defaults), validations);
  }
}

export default form;
export * from './rules';
export * from './validation';
export * from './form';
