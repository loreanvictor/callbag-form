<div align="center">

<img src="/callbag-form.svg" width="320"/>

# callbag-form
Framework agnostic form management based on callbags

[![tests](https://img.shields.io/github/workflow/status/loreanvictor/callbag-form/Test%20and%20Report%20Coverage?label=tests&logo=mocha&logoColor=green&style=flat-square)](https://github.com/loreanvictor/callbag-form/actions?query=workflow%3A%22Test+and+Report+Coverage%22)
[![coverage](https://img.shields.io/codecov/c/github/loreanvictor/callbag-form?logo=codecov&style=flat-square)](https://codecov.io/gh/loreanvictor/callbag-form)
[![version](https://img.shields.io/npm/v/callbag-form?logo=npm&style=flat-square)](https://www.npmjs.com/package/callbag-form)

</div>

<br>

```bash
npm i callbag-form
```

callbag-form provides a simple method for managing forms and validation in TypeScript / JavaScript.
You create a _form_ object using a callbag source (which provides the form data) and some validation rules,
and the _form_ object tracks validity of the data, failing and passing validations, and whether the form data
has changed at all.

```ts
import state from 'callbag-state'
import form, { isRequired, isEmail, isStrongPassword, isSame } from 'callbag-form'


const data = state({
  name: '',
  email: '',
  password: '',
  passwordRepeat: '',
})

const registration = form(data, {
  name: { isRequired },                               // 👉 name is required
  email: { isRequired, isEmail },                     // 👉 email is required and must be an email
  password: isStrongPassword(),                       // 👉 password must be a strong password
  passwordRepeat: { match: isSame(f => f?.password) } // 👉 password repeat must be the same with password
})


// 👉 Track validity
pipe(form.valid, subscribe(console.log))

// 👉 Check if email has errors
pipe(form.errors, map(e => e.email.hasErrors))

// 👉 Check if email format has issues
pipe(form.errors, map(e => e.email.isEmail))

// 👉 Check if password has a special character (validator included in `isStrongPassword()`):
pipe(form.errors, map(e => e.password.hasSpecialChar))

// 👉 Check if password-repeat matches:
pipe(form.errors, map(e => e.passwordRepeat.match))
```

<br>

⚡ Checkout a [real-life example](https://stackblitz.com/edit/callbag-jsx-form-demo?file=style.css) using [callbag-jsx](https://loreanvictor.github.io/callbag-jsx/).

<br><br>

# Installation

Install via NPM (or Yarn):

```bash
npm i callbag-form
```

Or use via CDNs:

```html
<script type="module">
  import form from 'https://unpkg.com/callbag-form/dist/bundles/callbag-form.es.min.js'
  
  // ...
</script>
```

<br><br>

# Validators

Validators in callbag-form are simple functions which return true or false with given value:

```ts
export function isRequired<T>(t?: T) {
  return isNotNull(t) && (
    (t as any).length === undefined
    || (t as any).length > 0
  )
}
```
👉 Validators are assumed to be synchronous and computationally inexpensive. Computationally expensive and/or async
validators are rare and so can be accounted for specifically.

<br>

Validators can also take into account the whole form data:
```ts
export function isSame<Form, Val>(selector: (form?: Form) => Val) {
  return (value?: Val, form?: Form) => {
    return value === selector(form)
  }
}
```

<br>

callbag-form comes with a handful of validators that are commonly used:

```ts
isRequired          // 👉 checks if value is not null and not empty string / array
isTrue              // 👉 checks if value is true
doesMatch(regex)    // 👉 checks if value matches given regexp
isUrl               // 👉 checks if value is a proper URL (https only, regexp check)
isEmail             // 👉 checks if value is a proper email (regexp check)
hasMinLength(n)     // 👉 checks if value (string or array) has at least length of n
isSame(selector)    // 👉 checks if value equals return result of the selector (which is provided the form data)
hasUpperCase        // 👉 checks if value has at-least one upper case character
hasLowerCase        // 👉 checks if value has at-least one lower case character
hasDigit            // 👉 checks if value has at-least one digit character
hasSpecialChar      // 👉 checks if value has at-least one special character
```

There is also `isStrongPassword()`, which provides a bundle of validation functions:
```ts
export function isStrongPassword() {
  return {
    isRequired,
    hasUpperCase,
    hasLowerCase,
    hasDigit,
    hasSpecialChar,
    length: hasMinLength(8)
  }
}
```

<br><br>

# Change Tracking

Forms can also track whether the data has actually changed. Enable that by calling `.track()`:

```ts
form.track()
```

Then set checkpoints using `.checkpoint()` method (for example when data is synced with server):

```ts
form.checkpoint()
```

The form data will be now compared to the last checkpoint:

```ts
// 👉 check whether form data has changed since last checkpoint:
pipe(form.changed, subscribe(console.log))
```

<br>

Don't forget to cleanup the form tracking subscription. You can do that either by calling `.dispose()`:
```ts
form.dispose()
```
Or by calling the callback returned by `.track()`:
```ts
const dispose = form.track()

// ...

dispose()
```
This means you can easily track forms in [callbag-jsx](https://loreanvictor.github.io/callbag-jsx/) using [tracking](https://loreanvictor.github.io/callbag-jsx/components/tracking):
```tsx
export function MyComponent(_, renderer) {

  const myForm = form(...)
  this.track(myForm.track())

  // ...
  
  return <> ... </>
}
```

<br><br>

# Contribution

There are no contribution guidelines or issue templates currently, so just be nice (and also note that this is REALLY early stage). Useful commands for development / testing:

```bash
git clone https://github.com/loreanvictor/callbag-form.git
```
```bash
npm i                   # --> install dependencies
```
```bash
npm start               # --> run `samples/index.tsx` on `localhost:3000`
```
```bash
npm test                # --> run all tests
```
```bash
npm run cov:view        # --> run tests and display the code coverage report
```

<br><br>
