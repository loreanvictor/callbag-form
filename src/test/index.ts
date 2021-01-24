import state from 'callbag-state';
import { should } from 'chai';
import form from '..';
import { Form } from '../form';


should();

describe('callbag-form', () => {
  require('./validation.test');
  require('./rules.test');
  require('./form.test');

  describe('form()', () => {
    it('should return a form', () => {
      form(state({}), {}).should.be.instanceOf(Form);
    });
  });
});
