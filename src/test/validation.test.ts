import { should } from 'chai';
import { errors } from '../validation';


should();

describe('errors()', () => {
  it('should produce an error report for given data based on given validation rules.', () => {
    errors(
      {
        email: 'hellow',
        password: 'world',
      },
      {
        email: {
          isProvided: e => !!e,
          isLengthy: e => !!e && e.length > 5,
          isHellow: e => !!e && e === 'hellow'
        },
        password: {
          isWorld: e => !!e && e === 'world',
          isLengthy: e => !!e && e.length > 5,
          hasExclamation: e => !!e && e.endsWith('!')
        }
      }
    ).should.eql({
      hasErrors: true,
      email: {
        hasErrors: false,
        isProvided: false,
        isLengthy: false,
        isHellow: false,
      },
      password: {
        hasErrors: true,
        isWorld: false,
        isLengthy: true,
        hasExclamation: true,
      }
    });
  });

  it('should provide undefined for field checkers when whole object is undefined.', () => {
    errors(undefined as any, { x: { y: a => !!a, z: a => !a } }).should.eql({
      hasErrors: true,
      x: {
        hasErrors: true,
        y: true,
        z: false
      }
    });
  });
});
