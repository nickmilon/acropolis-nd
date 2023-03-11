/* eslint-disable lines-between-class-members */

/**
 * @module
 * @fileoverview
 * miscellaneous utilities
 * Named after Plato an ancient Creek philosopher { @link https://en.wikipedia.org/wiki/Plato }
 * @exportsFix {  sleepMs, objFlip, getKeysArr, objectToStrLevel1, introspectFnArgs, introspectObj, fnPretty, DummyLogger}
 */

export const sleepMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // @deprecate use import {setTimeout as setTimeoutAsync}from 'timers/promises'

export const objFlip = (obj) => Object.assign({}, ...Object.entries(obj).map(([a, b]) => ({ [b]: a }))); // reverses key / values

// returns a nested array of obj keys
export const getKeysArr = (obj) => Object.keys(obj).map((k) => ((typeof (obj[k]) === 'function') ? k : [k, getKeysArr(obj[k])]));

export const objectToStrLevel1 = (obj, separator = '|') => Object.entries(obj).map(([k, v]) => `${k}:${v}`).join(separator);

// introspect function arguments
export const introspectFnArgs = (func) => {
  const rxStripComments = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,)]*))/mg;
  const rxArgumentNames = /([^\s,]+)/g;
  const fnStr = func.toString().replace(rxStripComments, '');
  const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(rxArgumentNames);
  return result || [];
};

export const fnPretty = (fName, argsArr) => `${fName}(${argsArr})`;

export const introspectObj = (obj, sort = false) => {
  const props = [];
  Object.entries(obj).forEach(([k, v]) => {
    if (typeof v === 'function') {
      props.push([typeof v, k, introspectFnArgs(v)]);
    } else {
      props.push([typeof v, k, v]);
    }
  });
  // eslint-disable-next-line no-nested-ternary
  if (sort === true) props.sort((a, b) => (`${a[0]}${a[1]}` > `${b[0]}${b[1]}` ? 1 : b > a ? -1 : 0));
  return props;
};

/**
 * a Logger that supports common logger functions but does nothing
 * useful to switch between real logging in debug mode and no logging without match overhead
 * @usage DummyLogger.log(1); (don't instantiate it)
 */
export const DummyLogger = {
  log: () => true,
  debug: () => true,
  info: () => true,
  warn: () => true,
  error: () => true,
  time: () => true,
  timeEnd: () => true,
  timeLog: () => true,
};
