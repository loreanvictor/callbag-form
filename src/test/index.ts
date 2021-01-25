import { map, pipe } from 'callbag-common';
import state from 'callbag-state';
import { should } from 'chai';
import form from '..';
import { Form } from '../form';
import { isEmail, hasMinLength, isStrongPassword, isTrue } from '../rules';

should();

describe('callbag-form', () => {
  require('./validation.test');
  require('./rules.test');
  require('./form.test');

  describe('form()', () => {
    it('should return a form', () => {
      form(state({}), {}).should.be.instanceOf(Form);
    });

    it('should create a form with a state when no source is provided.', () => {
      const F = form({
        name: [ 'X', { length: hasMinLength(5) }],
        email: [ 'Y', { isEmail }],
        password: [ 'Z', isStrongPassword() ],
        agree: [ false, { isTrue } ],
      });

      F.data.get()?.email.should.eql('Y');
    });
  });
});
