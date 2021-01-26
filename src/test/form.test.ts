/* eslint-disable no-unused-expressions */
import state from 'callbag-state';
import makeSubject from 'callbag-subject';
import { pipe, subscribe } from 'callbag-common';
import { expect, should } from 'chai';

import { Form } from '../form';

should();

describe('Form', () => {
  describe('.checkpoint()', () => {
    it('should capture checkpoints when tracking.', () => {
      const S = makeSubject<{ x: number }>();
      const F = new Form(S, {});
      F.track();

      S(1, { x: 1 });
      expect(F.snapshot).to.be.undefined;

      F.checkpoint();
      expect(F.snapshot).to.eql({ x: 1 });

      S(1, { x: 2 });
      expect(F.snapshot).to.eql({ x: 1 });

      S(1, { x: 3 });
      expect(F.snapshot).to.eql({ x: 1 });

      F.checkpoint();
      expect(F.snapshot).to.eql({ x: 3 });

      F.dispose();
      S(1, { x: 4 });
      F.checkpoint();
      expect(F.snapshot).to.eql({ x: 3 });
    });
  });

  describe('.changed', () => {
    it('should be a source emitting whether form data has changed since last checkpoint.', () => {
      const S = makeSubject<{ x: number }>();
      const F = new Form(S, {});
      F.track();

      const r: boolean[] = [];
      pipe(F.changed, subscribe(v => r.push(v)));

      r.should.eql([ false ]);

      S(1, { x: 1 });
      r.should.eql([ false, true ]);

      F.checkpoint();
      r.should.eql([ false, true, false ]);

      S(1, { x: 2 });
      r.should.eql([ false, true, false, true ]);
      S(1, { x: 1 });
      r.should.eql([ false, true, false, true, false ]);
    });
  });

  describe('.valid', () => {
    it('should check whether given validations hold for form data.', () => {
      const S = state({x: 0});
      const F = new Form(S, { x: { y: n => !!n && n > 5}});

      const r: boolean[] = [];
      pipe(F.valid, subscribe(v => r.push(v)));

      r.should.eql([false]);

      S.set({x : 10});
      r.should.eql([false, true]);
    });

    it('should correctly track the source and inital values.', done => {
      const S = state({x: 0});
      const F = new Form(S, { x: { y: n => !!n && n > 5}});

      F.track();
      pipe(F.valid, subscribe(v => {
        v.should.be.false;
        done();
      }));
    });

    it('should correctly track initial value when errors are tracked.', done => {
      const S = state({x: 0});
      const F = new Form(S, { x: { y: n => !!n && n > 5}});

      pipe(F.errors, subscribe(() => {}));
      pipe(F.valid, subscribe(v => {
        v.should.be.false;
        done();
      }));
    });

    it('should efficiently invoke validators.', () => {
      const S = state({x: 0});
      let r = 0;
      const F = new Form(S, { x: { y: () => !!(++r) }});

      pipe(F.valid, subscribe(() => {}));
      pipe(F.valid, subscribe(() => {}));
      r.should.equal(1);

      S.set({x: 1});
      r.should.equal(2);

      S.set({x: 2});
      r.should.equal(3);
    });
  });

  describe('.invalid', () => {
    it('should check whether given validations do not hold for form data.', () => {
      const S = state({x: 0});
      const F = new Form(S, { x: { y: n => !!n && n > 5}});

      const r: boolean[] = [];
      pipe(F.invalid, subscribe(v => r.push(v)));

      r.should.eql([true]);

      S.set({x : 10});
      r.should.eql([true, false]);
    });
  });

  describe('.errors', () => {
    it('should emit errors of the form data.', () => {
      const S = state({x: 0});
      const F = new Form(S, { x: { y: n => !!n && n > 5}});

      const r: any[] = [];
      pipe(F.errors, subscribe(v => r.push(v)));

      r.should.eql([
        { hasErrors: true, x: { hasErrors: true, y: true } }
      ]);

      S.set({x : 10});
      r.should.eql([
        { hasErrors: true, x: { hasErrors: true, y: true } },
        { hasErrors: false, x: { hasErrors: false, y: false } }
      ]);
    });
  });

  describe('.dispose()', () => {
    it('should do nothing when the form is not tracking.', () => {
      new Form(state({}), {}).dispose();
    });
  });
});
