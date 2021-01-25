export function isNotNull<T>(t: T | undefined | null): t is T {
  return t !== undefined && t !== null;
}

export function isRequired<T>(t?: T) {
  return isNotNull(t) && ((t as any).length === undefined || (t as any).length > 0);
}

export function isTrue(t?: boolean) {
  return t === true;
}

export function doesMatch(regex: RegExp) {
  return (target?: string) => isNotNull(target) && regex.test(target);
}

export function isUrl(link?: string) {
  return isNotNull(link)
    && /https:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
      .test(link);
}

export function isEmail(email?: string) {
  return isNotNull(email)
    && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

export function hasMinLength(n: number) {
  return (l?: unknown[] | string) => isNotNull(l) && l.length >= n;
}

export function isSame<V>(selector: (t?: {[key: string]: any}) => V) {
  return (v?: V, t?: {[key: string]: any}) => {
    return v === selector(t);
  };
}

export function hasUpperCase(str?: string) {
  return isNotNull(str) && /^.*[A-Z].*$/.test(str);
}

export function hasLowerCase(str?: string) {
  return isNotNull(str) && /^.*[a-z].*$/.test(str);
}

export function hasDigit(str?: string) {
  return isNotNull(str) && /^.*[0-9].*$/.test(str);
}

export function hasSpecialChar(str?: string) {
  return isNotNull(str) && /^.*[!@#$&*].*$/.test(str);
}

export function isStrongPassword() {
  return {
    isRequired,
    hasUpperCase,
    hasLowerCase,
    hasDigit,
    hasSpecialChar,
    length: hasMinLength(8)
  };
}
