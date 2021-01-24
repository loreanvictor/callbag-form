import { expr, pipe, subscribe } from 'callbag-common';
import { makeRenderer } from 'callbag-jsx';
import state from 'callbag-state';

import { Form } from '../src/form';
import { isEmail, isRequired, isSame, hasMinLength, isTrue, isStrongPassword } from '../src/rules';


const renderer = makeRenderer();

const s = state({
  email: '',
  name: '',
  password: '',
  passwordRepeat: '',
  agree: false,
});

const f = new Form(s, {
  email: { isRequired, isEmail },
  name: { isRequired, length: hasMinLength(5) },
  password: isStrongPassword(),
  passwordRepeat: { match: isSame(t => t?.password) },
  agree: { isTrue },
});

f.track();
f.checkpoint();

pipe(f.errors, subscribe(console.log));

renderer.render(<>
  <input _state={s.sub('email')} type='text' placeholder='email'/>
  <ul hidden={expr($ => !$(f.errors)?.email?.hasErrors)}>
    <li hidden={expr($ => !$(f.errors)?.email?.isRequired)}>email is required</li>
    <li hidden={expr($ => !$(f.errors)?.email?.isEmail)}>must be email format</li>
  </ul>
  <br/>

  <input _state={s.sub('name')} type='text' placeholder='name'/>
  <ul hidden={expr($ => !$(f.errors)?.name?.hasErrors)}>
    <li hidden={expr($ => !$(f.errors)?.name?.isRequired)}>name is required</li>
    <li hidden={expr($ => !$(f.errors)?.name?.length)}>must be at least 5 characters</li>
  </ul>
  <br/>

  <input _state={s.sub('password')} type='password' placeholder='password'/>
  <ul hidden={expr($ => !$(f.errors)?.password?.hasErrors)}>
    <li hidden={expr($ => !$(f.errors)?.password?.isRequired)}>password is required</li>
    <li hidden={expr($ => !$(f.errors)?.password?.length)}>must be at least 8 characters</li>
    <li hidden={expr($ => !$(f.errors)?.password?.hasDigit)}>must have one digit</li>
    <li hidden={expr($ => !$(f.errors)?.password?.hasLowerCase)}>must have one lower case character</li>
    <li hidden={expr($ => !$(f.errors)?.password?.hasUpperCase)}>must have one upper case character</li>
    <li hidden={expr($ => !$(f.errors)?.password?.hasSpecialChar)}>must have one special character</li>
  </ul>
  <br/>

  <input _state={s.sub('passwordRepeat')} type='password' placeholder='repeat password'/>
  <ul hidden={expr($ => !$(f.errors)?.passwordRepeat?.hasErrors)}>
    <li hidden={expr($ => !$(f.errors)?.passwordRepeat?.match)}>passwords must match</li>
  </ul>
  <br/>

  <input _state={s.sub('agree')} type='checkbox'/> Agree to stuff
  <br/>

  <br/>
  <button disabled={expr($ => $(f.invalid) || !$(f.changed))} onclick={() => f.checkpoint()}>Submit</button>
</>).on(document.body);
