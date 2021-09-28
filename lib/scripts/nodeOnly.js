import { inspect } from 'util';
import { DummyLogger } from '../Plato.js';
/**
 * @param {any} obj to inspect
 * @param {Object} [logger=null] logger for output
 * @param {string} [commend=''] comment
 * @param {Object} options [{ showHidden = false, depth = 10, colors = true }={}] inspect parameters
 * @return {undefined}
 */
const inspectIt = (obj, logger = null, commend = '', { showHidden = false, depth = 10, colors = true, breakLength = 120} = {}) => {
  if (!logger) { return; }
  const inspObj = inspect(obj, { showHidden, depth, colors, breakLength });
  logger.info(`-------------------: ${commend}\n${inspObj}\n--------------------`);
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

export { inspectIt, timeIt };
