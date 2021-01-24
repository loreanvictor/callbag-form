import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import subject from 'callbag-subject';
import { Callbag, expr, map, pipe, Source, subscribe } from 'callbag-common';

import { errors, ValidationErrors, ValidationRules } from './validation';
import { remember } from './remember';


export class Form<T, V extends ValidationRules<T>> {
  private _snapshot: Callbag<T, T | undefined>;
  private _last: T | undefined;
  private _lastSnapshot: T | undefined;
  private _changed: Source<boolean>;
  private _valid: Source<boolean>;
  private _invalid: Source<boolean>;
  private _errors: Source<ValidationErrors<T, V>>;
  private _dispose: () => void | undefined;

  constructor(
    readonly src: Source<T>,
    readonly rules: V,
  ) {
    this._snapshot = subject();
    this._changed = expr($ => !isEqual($(this.src), $(this._snapshot)));
    this._errors = pipe(this.src, map(v => errors(v, rules)), remember);
    this._valid = pipe(this._errors, map(e => !e.hasErrors));
    this._invalid = pipe(this._valid, map(v => !v));
  }

  track() {
    this._dispose = pipe(this.src, subscribe(v => this._last = v));

    return this._dispose;
  }

  dispose() {
    if (this._dispose) {
      this._dispose();
    }
  }

  checkpoint() {
    this._lastSnapshot = cloneDeep(this._last!);
    this._snapshot(1, this._lastSnapshot);
  }

  get snapshot() {
    return this._lastSnapshot;
  }

  get changed() {
    return this._changed;
  }

  get valid() {
    return this._valid;
  }

  get invalid() {
    return this._invalid;
  }

  get errors() {
    return this._errors;
  }
}
