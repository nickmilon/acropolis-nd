/* eslint-disable no-underscore-dangle */
import { inspect } from 'util';
import { intOrDefault } from '../Pythagoras.js';
/**
 * @param {any} obj to inspect
 * @param {Object} [logger=null] logger for output
 * @param {string} [commend=''] comment
 * @param {Object} options [{ showHidden = false, depth = 10, colors = true }={}] inspect parameters
 * @return {undefined}
 * @deprecate use ConLog
 */
const inspectIt = (obj, logger = null, commend = '', { showHidden = false, depth = 10, colors = true, breakLength = 120} = {}) => {
  if (!logger) { return; }
  const inspObj = inspect(obj, { showHidden, depth, colors, breakLength });
  logger.info(`-------------------: ${commend}\n${inspObj}\n--------------------`);
};

/** @type {consolDummy} consolDummy
 * a dummy console to substitute console for efficiency (mainly for testing) NOT intended for production usage
 * substitute console with this to silence all console commands
*/
const consolDummy = {
  log: () => true,
  warn: () => true,
  dir: () => true,
  time: () => true,
  timeEnd: () => true,
  timeLog: () => true,
  trace: () => true,
  assert: () => true,
  clear: () => true,
  count: () => true,
  countReset: () => true,
  group: () => true,
  groupEnd: () => true,
  table: () => true,
  debug: () => true,
  info: () => true,
  dirxml: () => true,
  error: () => true,
  groupCollapsed: () => true,
  inspectIt: () => true, // doesn't exist in consol, added for compatibility with ConLog
};

const { Console } = console;

/**
 * extends console to work with log levels
 * @warning this class is NOT supposed to be uses as production logger
 * it is only to be used is debugging and tests as it has no dependencies
 * @class ConLog
 * @extends {Console}
 */
class ConLog extends Console {
  static levels = { silly: 1, trace: 2, debug: 3, info: 4, log: 5, warn: 6, error: 7, silent: 10 };
  constructor(
    level = 'log',
    { name = 'ConLog', inclTS = true, inspectDefaults = {}, stdout = process.stdout, stderr = process.stderr } = {},
  ) {
    super({ stdout, stderr });
    // eslint-disable-next-line no-underscore-dangle
    this._inspectDefaults = { showHidden: false, depth: 10, colors: true, breakLength: 140, ...inspectDefaults };
    this._inclTS = inclTS;
    this._name = name;
    this._defaultLevel = 5;
    this.level = level;
  }

  /**
   * validates level and returns
   * @param {String|Integer} level verbose or integer
   * @return {Integer} level integer
   * @private
   * @memberof ConLog
   */
  // eslint-disable-next-line no-bitwise
  _validateLevel(level) { return intOrDefault(ConLog.levels[level] | level, this._defaultLevel, ConLog.levels.silly, ConLog.levels.silent); }

  _pass(level) { return ((this._level < 10) && this._validateLevel(level) >= this._level); } // short circuit silent for efficiency

  set level(level) { this._level = this._validateLevel(level); }

  get level() { return this._level; }

  get levelDetails() { return Object.entries(ConLog._levels).find((kv) => kv[1] === this._level); }

  _header(data, command = '') { return `[${this._name}|${command.padEnd(6)}|${(this._inclTS === true) ? new Date().toISOString() : ''}]; ${data}`; }

  _print(level, data, ...args) { if (ConLog.levels[level] >= this._level) return super[level](this._header(data, level), ...args); return false; }

  static availableLevelsStr() { return JSON.stringify(ConLog.levels); }

  silly(data, ...args) { return this._print('silly', data, ...args); }

  trace(data, ...args) { return this._print('debug', data, ...args); }

  debug(data, ...args) { return this._print('debug', data, ...args); }

  info(data, ...args) { return this._print('info', data, ...args); }

  log(data, ...args) { return this._print('log', data, ...args); }

  warn(data, ...args) { return this._print('warn', data, ...args); }

  error(data, ...args) { return this._print('error', data, ...args); }

  dir(obj, opts = {}, level) { if (this._pass(level)) { return super.dir(obj, { ...this._inspectDefaults, ...opts }); } return false}

  count(label, level) { if (this._pass(level)) { return super.count(label); } return false; }

  countReset(label, level) { if (this._pass(level)) { return super.countReset(label); } return false; }

  time(label, level) { if (this._pass(level)) { return super.time(label); } return false; }

  timeEnd(label, level) { if (this._pass(level)) { return super.timeEnd(label); } return false; }

  inspectIt(obj, comment = 'inspect', opts = {}, level) { // new method not included in super
    if (this._pass(level)) {
      super.log(`${this._header(comment.padEnd(60, '⎯'), 'insp')}  |`);
      super.dir(obj, { ...this._inspectDefaults, ...opts });
    }
  }
}

/**
 * @async
 * @param {Function} Fn a function to execute
 * @param {number} [times=1] how many times to execute Fn
 * @param {string} [name='timeIt'] unique name
 * @param {Object} [logger=console] where to log
 * @return {any} last result from function
 */
const timeIt = async (Fn, times = 1, name = 'timeIt', logger = console) => {
  let result;
  logger.time(name);
  for (let cnt = 1; cnt <= times; cnt += 1) { result = Fn; }
  logger.timeEnd(name);
  return result;
};

export {
  inspectIt,
  timeIt,
  ConLog,
  consolDummy,
};
