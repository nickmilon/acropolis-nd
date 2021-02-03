/* eslint-disable lines-between-class-members */

/**
 * miscellaneous utilities
 * Named after Plato an ancient Creek philosopher ( https://en.wikipedia.org/wiki/Plato )
 *
 */

import { inspect } from 'util';

const sleepMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const objFlip = (obj) => Object.assign({}, ...Object.entries(obj).map(([a, b]) => ({ [b]: a }))); // reverses key / values

const getKeysArr = (obj) => {
  // returns a nested array of obj keys
  return Object.keys(obj).map((k) => {
    if (typeof (obj[k]) === 'function') {
      return k;
    }
    return [k, getKeysArr(obj[k])];
  });
};

const objectToStrLevel1 = (obj, separator = '|') => {
  return Object.entries(obj).map(([k, v]) => `${k}:${v}`).join(separator);
};

/**
 * a Logger that supports common logger functions but does nothing
 * useful to switch between real logging in debug mode and  logging without match overhead
 * @warning do not inherit;
 * @usage DummyLogger.log(1); (don't instantiate it)
 */
class DummyLogger {
  static log() {}
  static debug() {}
  static info() {}
  static warn() {}
  static error() {}
  static time() {}
  static timeEnd() {}
  static timeLog() {}
}

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

/**
 * @async
 * @param {Function} Fn a function to execute
 * @param {string} [name='timeIt'] unique name
 * @param {number} [times=1] how many times to execute Fn
 * @param {Object} [logger=console] where to log
 * @return {any} last result from function
 */
const timeIt = async (Fn, name = 'timeIt', times = 1, logger = DummyLogger) => {
  let result;
  logger.time(name);
  for (let cnt = 1; cnt <= times; cnt += 1) { result = Fn; }
  logger.timeEnd(name);
  return result;
};

/**
 * @param {any} obj to inspect
 * @param {Object} [logger=null] logger for output
 * @param {string} [commend=''] comment
 * @param {Object} options [{ showHidden = false, depth = 10, colors = true }={}] inspect parameters
 * @return {undefined}
 */
const inspectIt = (obj, logger = null, commend = '', { showHidden = false, depth = 10, colors = true } = {}) => {
  if (!logger) { return; }
  const inspObj = inspect(obj, { showHidden, depth, colors });
  logger.info(`-------------------: ${commend}\n${inspObj}\n--------------------`);
};

export {
  sleepMs,
  objFlip,
  getKeysArr,
  eventsHandle,
  objectToStrLevel1,
  timeIt,
  inspectIt,
  DummyLogger,
};
