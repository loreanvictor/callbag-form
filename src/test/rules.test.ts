/* eslint-disable no-unused-expressions */
import { should } from 'chai';
import { doesMatch, hasDigit, hasLowerCase, hasMinLength, hasSpecialChar, hasUpperCase, isEmail, required, isSame, isStrongPassword, isTrue, isUrl } from '../rules';
import { errors } from '../validation';

should();

describe('required()', () => {
  it('should return true when value is not falsy.', () => {
    required(42).should.be.true;
    required(false).should.be.true;
    required(undefined).should.be.false;
    required('').should.be.false;
  });
});

describe('isTrue()', () => {
  it('should return true when value is true.', () => {
    isTrue(false).should.be.false;
    isTrue(undefined).should.be.false;
    isTrue(true).should.be.true;
  });
});

describe('doesMatch()', () => {
  it('should return true when given string matches given regex.', () => {
    const test = doesMatch(/!$/);
    test('').should.be.false;
    test(undefined).should.be.false;
    test('hellow').should.be.false;
    test('hellow!').should.be.true;
  });
});

describe('isUrl()', () => {
  it('should return true when given string is a url.', () => {
    isUrl('').should.be.false;
    isUrl(undefined).should.be.false;
    isUrl('https://google.com').should.be.true;
    isUrl('http://google.com').should.be.false;
  });
});

describe('isEmail()', () => {
  it('should return true when given string is email.', () => {
    isEmail('').should.be.false;
    isEmail(undefined).should.be.false;
    isEmail('hellow@world').should.be.false;
    isEmail('hellow@world.co').should.be.true;
  });
});

describe('hasMinLength()', () => {
  it('should return true when given string or array has given min length.', () => {
    const test = hasMinLength(5);
    test([]).should.be.false;
    test(undefined).should.be.false;
    test('123').should.be.false;
    test([1, 2, 3]).should.be.false;
    test('12345').should.be.true;
    test([1, 2, 3, 4, 5, 6]).should.be.true;
  });
});

describe('isSame()', () => {
  it('should return true if given value matches result of given selector from the form.', () => {
    const test = isSame<number>(t => t?.x);
    test(undefined, undefined).should.be.true;
    test(undefined, { y: 42 } as any).should.be.true;
    test(undefined, { x: 42 }).should.be.false;
    test(41, { x: 42 }).should.be.false;
    test(42, { x: 42 }).should.be.true;
  });
});

describe('hasUpperCase()', () => {
  it('should return true when given string has an uppercase character.', () => {
    hasUpperCase(undefined).should.be.false;
    hasUpperCase('hellow').should.be.false;
    hasUpperCase('heLLow').should.be.true;
    hasUpperCase('helloW').should.be.true;
  });
});

describe('hasLowerCase()', () => {
  it('should return true when given string has a lowercase character.', () => {
    hasLowerCase(undefined).should.be.false;
    hasLowerCase('AAA').should.be.false;
    hasLowerCase('AAa').should.be.true;
  });
});

describe('hasDigit()', () => {
  it('should return true when given string has a digit in it.', () => {
    hasDigit(undefined).should.be.false;
    hasDigit('hellow').should.be.false;
    hasDigit('hell0w').should.be.true;
  });
});

describe('hasSpecialChar()', () => {
  it('should return true when given string has a special character.', () => {
    hasSpecialChar(undefined).should.be.false;
    hasSpecialChar('hellow').should.be.false;
    hasSpecialChar('hellow!').should.be.true;
  });
});

describe('isStrongPassword()', () => {
  it('should validate whether given string is a strong password.', () => {
    errors({ p: 'Hellow World!' }, { p: isStrongPassword() })
      .should.eql({
        hasErrors: true,
        p: {
          hasErrors: true,
          length: false,
          required: false,
          hasUpperCase: false,
          hasLowerCase: false,
          hasDigit: true,
          hasSpecialChar: false
        }
      });
  });
});
