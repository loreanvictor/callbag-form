import { expr } from 'callbag-common';
import { makeRenderer } from 'callbag-jsx';

import { form } from '../src';
import { isEmail, required, isSame, hasMinLength, isTrue, isStrongPassword } from '../src/rules';


const renderer = makeRenderer();

const f = form({
  email: ['', { required, isEmail }],
  name: ['', { required, length: hasMinLength(5) }],
  password: ['', isStrongPassword()],
  passwordRepeat: ['', { match: isSame(t => t?.password) }],
  agree: [false, { isTrue }],
});

f.track();
f.checkpoint();

renderer.render(<>
  <input _state={f.data.sub('email')} type='text' placeholder='email'/>
  <ul hidden={expr($ => !$(f.errors)?.email?.hasErrors)}>
    <li hidden={expr($ => !$(f.errors)?.email?.required)}>email is required</li>
    <li hidden={expr($ => !$(f.errors)?.email?.isEmail)}>must be email format</li>
  </ul>
  <br/>

  <input _state={f.data.sub('name')} type='text' placeholder='name'/>
  <ul hidden={expr($ => !$(f.errors)?.name?.hasErrors)}>
    <li hidden={expr($ => !$(f.errors)?.name?.required)}>name is required</li>
    <li hidden={expr($ => !$(f.errors)?.name?.length)}>must be at least 5 characters</li>
  </ul>
  <br/>

  <input _state={f.data.sub('password')} type='password' placeholder='password'/>
  <ul hidden={expr($ => !$(f.errors)?.password?.hasErrors)}>
    <li hidden={expr($ => !$(f.errors)?.password?.required)}>password is required</li>
    <li hidden={expr($ => !$(f.errors)?.password?.length)}>must be at least 8 characters</li>
    <li hidden={expr($ => !$(f.errors)?.password?.hasDigit)}>must have one digit</li>
    <li hidden={expr($ => !$(f.errors)?.password?.hasLowerCase)}>must have one lower case character</li>
    <li hidden={expr($ => !$(f.errors)?.password?.hasUpperCase)}>must have one upper case character</li>
    <li hidden={expr($ => !$(f.errors)?.password?.hasSpecialChar)}>must have one special character</li>
  </ul>
  <br/>

  <input _state={f.data.sub('passwordRepeat')} type='password' placeholder='repeat password'/>
  <ul hidden={expr($ => !$(f.errors)?.passwordRepeat?.hasErrors)}>
    <li hidden={expr($ => !$(f.errors)?.passwordRepeat?.match)}>passwords must match</li>
  </ul>
  <br/>

  <input _state={f.data.sub('agree')} type='checkbox'/> Agree to stuff
  <br/>

  <br/>
  <button disabled={expr($ => $(f.invalid) || !$(f.changed))} onclick={() => f.checkpoint()}>Submit</button>
</>).on(document.body);
