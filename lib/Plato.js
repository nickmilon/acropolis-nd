/* eslint-disable lines-between-class-members */

/**
 * miscellaneous utilities
 * Named after Plato an ancient Creek philosopher ( https://en.wikipedia.org/wiki/Plato )
 * 
 */

const sleepMs = ms => new Promise(resolve => setTimeout(resolve, ms));

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
}

/**
 * just register events to handle
 * @param {Object} eventEmitter: any event emmiting object
 * @param {Array} onArr: an array of events to log,
 * @param {Object} optional parameters
 */
const eventsHandle = (eventEmitter, onArr = [], {name = 'eventsHandle', logFun = (x => console.info(x)), verbose = 0} = {}) => {
  onArr.forEach((on) => {
    eventEmitter.on(on, (event) => {
      const logDetails = {eventFrom: name, on};
      if (verbose > 0) { logDetails.data = event; }
      logFun(logDetails);
    });
  });
};

export {
  sleepMs,
  getKeysArr,
  eventsHandle,
  objectToStrLevel1,
  DummyLogger,
};
