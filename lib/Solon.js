/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */

/**
 * @module
 * @fileoverview
 * miscellaneous utilities
 * Named after Solon an ancient Creek statesman
 * {@link https://en.wikipedia.org/wiki/Solon}
 * @exports {jsonCycle, LevelCounter}
 */

/**
 * cycles value through JSON stringify => parse
 * useful for type conversions using replace reviver
 *@async
 * @param {object} value to cycle
 * @param {any} replace {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify}
 * @param {any} reviver {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse}
 * @return {object} the val after cycling
 */
export const jsonCycle = async (value, replace, reviver) => JSON.parse(JSON.stringify(value, replace), reviver);

/**
 * a dirty sums counter
 * @param {Object} objCurrent a {key: number, ... } object
 * @param {Object | undefined} objSum {key: number, ... } object (or undefined on first time call)
 * @return {Object} sums
 * @example
 * sum = sumsCounter({foo: 0, bar:1}) -> { foo: 0, bar: 1 }
 * sum = sumsCounter({foo: 10, bar:1}, sum) -> { foo: 10, bar: 2 }
 * sum = sumsCounter({foo: 10, bar:1}, sum) -> { foo: 20, bar: 3 }
 */
export const sumsCounter = (objCurrent, objSum) => {
  if (!objSum) objSum = Object.fromEntries(Object.keys(objCurrent).map((k) => [k, 0]));
  Object.entries(objCurrent).forEach(([k, v]) => objSum[k] += v);
  return objSum;
};

export class LevelCounter {
  constructor(startCounter = 1) {
    this.store = {};
    this.startCounter = startCounter;
  }

  inc(level, val = 1) {
    this.store[level] = (this.store[level] === undefined) ? this.startCounter : this.store[level] += val;
    return this.store[level];
  }

  toStr(level, separator = '.', padTo = 0, padChr = '0') {
    let values = Object.values(this.store).splice(0, level + 1);
    if (padTo !== 0) { values = values.map((x) => x.toString().padStart(padTo, padChr)); }
    return values.splice(0, level + 1).join(separator);
  }
}
