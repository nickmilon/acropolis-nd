/* eslint-disable no-bitwise */

/**
 * miscellaneous utilities
 * Named after Solon an ancient Creek statesman {@link https://en.wikipedia.org/wiki/Solon}
 *
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
const jsonCycle = async (value, replace, reviver) => JSON.parse(JSON.stringify(value, replace), reviver);

class LevelCounter {
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

export {
  jsonCycle,
  LevelCounter,
};
