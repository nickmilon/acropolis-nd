/* eslint-disable no-bitwise */

/**
 * miscellaneous utilities
 * Named after Solon an ancient Creek statesman ( https://en.wikipedia.org/wiki/Solon )
 *
 */

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
    if (padTo !== 0) { values = values.map(x => x.toString().padStart(padTo, padChr)); }
    return values.splice(0, level + 1).join(separator);
  }
}

export { LevelCounter };
