import { Source } from 'callbag-common';

import { Form } from './form';
import { ValidationRules } from './validation';


export function form<T, V extends ValidationRules<T>>(src: Source<T>, rules: V) {
  return new Form(src, rules);
}

export default form;
export * from './rules';
export * from './validation';
export * from './form';
