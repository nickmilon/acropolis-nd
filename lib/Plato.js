/* eslint-disable lines-between-class-members */

/**
 * @module
 * @fileoverview
 * miscellaneous utilities
 * Named after Plato an ancient Creek philosopher { @link https://en.wikipedia.org/wiki/Plato }
 * @exports {  sleepMs, objFlip, getKeysArr, eventsHandle, objectToStrLevel1, introspectFnArgs, introspectObj, fnPretty, DummyLogger}
 */

const sleepMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const objFlip = (obj) => Object.assign({}, ...Object.entries(obj).map(([a, b]) => ({ [b]: a }))); // reverses key / values

// returns a nested array of obj keys
const getKeysArr = (obj) => Object.keys(obj).map((k) => ((typeof (obj[k]) === 'function') ? k : [k, getKeysArr(obj[k])]));

const objectToStrLevel1 = (obj, separator = '|') => Object.entries(obj).map(([k, v]) => `${k}:${v}`).join(separator);

// introspect function arguments
const introspectFnArgs = (func) => {
  // const rxStripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg; // doesn't handle args with options
  const rxStripComments = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,)]*))/mg;
  const rxArgumentNames = /([^\s,]+)/g;
  const fnStr = func.toString().replace(rxStripComments, '');
  const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(rxArgumentNames);
  return result || [];
};

const fnPretty = (fName, argsArr) => `${fName}(${argsArr})`;

const introspectObj = (obj, sort = false) => {
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
const DummyLogger = {
  log: () => true,
  debug: () => true,
  info: () => true,
  warn: () => true,
  error: () => true,
  time: () => true,
  timeEnd: () => true,
  timeLog: () => true,
};

/**
 * just register events to handle
 * @param {Object} eventEmitter: any event emmiting object
 * @param {Array} onArr: an array of events to log,
 * @param {Object} optional parameters
 * @returns {true} dummy
 */
const eventsHandle = (eventEmitter, onArr = [], {name = 'eventsHandle', logFun = (x => console.info(x)), verbose = 0} = {}) => {
  onArr.forEach((on) => {
    eventEmitter.on(on, (event) => {
      const logDetails = { eventFrom: name, on };
      if (verbose > 0) { logDetails.data = event; }
      logFun(logDetails);
    });
  });
  return true;
};

export {
  sleepMs,
  objFlip,
  getKeysArr,
  eventsHandle,
  objectToStrLevel1,
  introspectFnArgs,
  introspectObj,
  fnPretty,
  DummyLogger,
};
