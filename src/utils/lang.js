export function isUndefined(value) {return typeof value === 'undefined';}


export function isDefined(value) {return typeof value !== 'undefined';}


export function isObject(value) {
  return value !== null && typeof value === 'object';
}

export function isBlankObject(value) {
  return value !== null && typeof value === 'object' && !getPrototypeOf(value);
}

export function isString(value) {return typeof value === 'string';}

export function isNumber(value) {return typeof value === 'number';}

export function isDate(value) {
  return toString.call(value) === '[object Date]';
}

export var isArray = Array.isArray;

export function isFunction(value) {return typeof value === 'function';}

export function isRegExp(value) {
  return toString.call(value) === '[object RegExp]';
}

export function isWindow(obj) {
  return obj && obj.window === obj;
}

export function isFile(obj) {
  return toString.call(obj) === '[object File]';
}

export function isFormData(obj) {
  return toString.call(obj) === '[object FormData]';
}

export function isBlob(obj) {
  return toString.call(obj) === '[object Blob]';
}

export function isBoolean(value) {
  return typeof value === 'boolean';
}

export function isPromiseLike(obj) {
  return obj && isFunction(obj.then);
}

export function isElement(node) {
  return !!(node &&
    (node.nodeName  // we are a direct element
    || (node.prop && node.attr && node.find)));  // we have an on and find method part of jQuery API
}

const defaultOptions = {
  breakOnWords: false,
  minDelta: 0, // Prevents truncating a tiny bit off the end
  elipsis: '...',
};

export const truncate = (str, maxChars, options) => {
  options = {...defaultOptions, ...options };
  if (str && str.length &&
      str.length - options.minDelta + options.elipsis.length >= maxChars) {
    str = str.slice(0, maxChars - options.elipsis.length + 1);
    if (options.breakOnWords) {
      var ii = Math.max(str.lastIndexOf(' '), str.lastIndexOf('\n'));
      str = str.slice(0, ii);
    }
    str = str.trim() + options.elipsis;
  }
  return str;
};

export const isValidPhone = (value) => {
  const reg = new RegExp([
    '^([0-9]{3,4}-)?[0-9]{7,8}$',
    '|^((\\+?86)',
    '|(\\(\\+86\\)))?(13[0123456789][0-9]{8}',
    '|15[0123456789][0-9]{8}',
    '|17[0123456789][0-9]{8}',
    '|18[0123456789][0-9]{8}',
    '|147[0-9]{8}',
    '|1349[0-9]{7})$',
  ].join(''));

  return reg.test(value);
}
