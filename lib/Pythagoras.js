/* eslint-disable no-nested-ternary */
/* eslint-disable no-bitwise */
/* eslint-disable no-restricted-globals */

/**
 * @module
 * @fileoverview
 * numbers and maths utilities Named after Pythagoras of Samos an ancient Greek
 * philosopher/mathematician and the eponymous founder of Pythagoreanism.
 * {@link https://en.wikipedia.org/wiki/Pythagoras}
 * @exportsFix { ngrams, isNumber, isObject, isString, isDate, isInRange, inRangeOrDefault, intOrDefault, percent, fileName, 
 * fileNameTrimExt, isFileNameEqual, isFileNameTrimmedEqual, randomBetween}
 */

/**
 * percent
 * @param {number} percentage percentage of total
 * @param {number} total total number
 * @return {float} percentage
 * @example percent(1, 200) >> 0.5
 */
export const percent = (percentage, total) => 100 * (percentage / total);

export const sumOfNatNum = (n) => (n * (n + 1)) / 2;

export const sumOfNatNumBI = (n) => (n * (n + 1n)) / 2n;

/**
 * trims the path and returns filename
 * @param {string} uriOrPath to trim
 * @returns {string} fileName (with extension)
 */
export const fileName = (uriOrPath) => uriOrPath.split('\\').pop().split('/').pop();

/**
 * trims out extension from a fileName (can handle multiple dots in fileName)
 * @param {string} uriOrPath to extract base
 * @returns {string} aFileName base
 */
export const fileNameTrimExt = (uriOrPath) => fileName(uriOrPath).replace(/\.[^/.]+$/, '');

export const isFileNameEqual = (uriOrPath1, uriOrPath2) => fileName(uriOrPath1) === fileName(uriOrPath2);
export const isFileNameTrimmedEqual = (uriOrPath1, uriOrPath2) => fileNameTrimExt(uriOrPath1) === fileNameTrimExt(uriOrPath2);

/**
 * checks if value is a proper number
 * @param {any} val value to check
 * @return {boolean} true if number false otherwise
 */
export const isNumber = (val) => (typeof value === 'number' || val === Number(val) || Number.isFinite(val) === true);

/**
 * checks if value is a proper float Number (as all numbers are floats in js just checks if it has fraction part)
 * @param {any} val value to check
 * @return {boolean} true if number false otherwise
 */
export const isNumberFloat = (val) => (isNumber(val) && /[.]/.test(String(val)));

/**
 * checks if value is a proper Object
 * @param {any} val value to check
 * @return {boolean} true if number false otherwise
*/
export const isObject = (val) => (typeof val === 'object' && val !== null);

/**
 * checks if value is a proper number
 * @param {any} val value to check
 * @return {boolean} true if string false otherwise
 */
export const isString = (val) => (typeof val === 'string' || val instanceof String);

/**
 * checks if value is a proper date protects from invalid dates like new Date('foo') in Node;
 * @param {any} value value to check
 * @return {boolean} true if string false otherwise
 */
export const isDate = (value) => (value instanceof Date && typeof value.getMonth === 'function');

/**
 * checks if value is within (INCLUDING) given limits
 * @param {any} val value to check any type to where > and < operators can apply
 * @param {any} min value
 * @param {any} max value
 * @return {boolean} true if within limits
 */
export const isInRange = (val, min, max) => (val >= min && val <= max);

/**
 * checks if value is within given limits (included) amd if not returns valDefault
 * @param {any} val value to check any type to where > and < operators can apply
 * @param {number} valDefault value to return if not within limits
 * @param {any} min value
 * @param {any} max value
 * @return {Number} valDefault or val
 */
export const inRangeOrDefault = (val, valDefault, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) =>
  (isInRange(val, min, max) ? val : valDefault);
/**
 * parses value to Int and checks if value is within given limits (included) returns valDefault if not else parsed integer
 * @param {any} val value to check )any type that can be parsed to integer)
 * @param {number} valDefault value to return if not within limits
 * @param {Integer} min value
 * @param {Integer} max value
 * @return {Integer} valDefault or val
 */
export const intOrDefault = (val, valDefault, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) => inRangeOrDefault(val | 0, valDefault, min, max);

/**
 * random with a normal distribution with < 3.6 standard deviations
 * {@link https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve random Normal distribution }
 * @returns {float}  >= 0 random float <=1
 */
export const rndNormal = () => {
  let u = 0; let v = 0;
  while (u === 0) u = Math.random();              // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5;                         // Translate to 0 -> 1
  if (num > 1 || num < 0) return rndNormal();     // resample between 0 and 1
  return num;
};

export const rndLogNormal = () => Math.exp(rndNormal());

/**
 * random with a normal distribution of mean and standard deviation
 * @param {float} mean value
 * @param {float} std standard deviation
 * @returns {float} can be negative don't use it with randomWithin
 */
export const rndNormalMS = (mean, std) => {
  let x = 0;
  for (let i = 1; i <= 12; i += 1) { x += Math.random(); }
  return (x - 6) * std + mean;
};

/**
 * random with and exponential distribution
 * @param {float} mean value must be < 0;
 * @returns {float}  >= 0 random float <=1
 */
export const rndExponential = (mean) => -Math.log(1 - Math.random()) / mean;

/**
 * random with inverse exponential distribution
 * @param {float} mean value must be < 0;
 * @returns {float}  >= 0 random float <=1
 */
export const rndExponentialInv = (mean) => 1 - (-Math.log(1 - Math.random()) / mean);

/**
 * random with and exponential distribution
 * @param {float} p value must between 0 and 1
 * @param {integer} trials value must be < 0;
 * @returns {float} >= 0 random float <=1
 */
export const rndBinomial = (p, trials) => {
  let counter = 0;
  let sum = 0;
  while (counter < trials) {
    if (Math.random() < p) { sum += 1; }
    counter += 1;
  }
  return sum;
};

/**
 * pseudo random integer between min - nax (included) uniformly distributed
 * for compatibility / legacy use for new stuff use rndWithin rndWithinInt
 * @param {integer} min lower bound
 * @param {integer} max upper bound
 * @return {integer} random integer
 */
export const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const rndWithin = (min, max, rndFun = Math.random, ...args) => (rndFun(...args) * (max - min) + min); // rndFun should return (0 - 1)
export const rndWithinInt = (min, max, rndFun = Math.random, ...args) => Math.floor(rndFun(...args) * (max - min + 1) + min);

export const dtParseRx = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})/u;
export const dtParseRxGroups = (dt) => {
  const ex = dtParseRx.exec(dt.toISOString());
  if (ex === null) { return null; }
  return ex.groups;
};

/**
 * constructs a Map from an object
 * @param {Object} obj to Map
 * @param {string} sort ['k' | 'v'] sort by key or value
 * @returns {Map} map object
 */
export const mapFromObj = (obj, sort) => {
  if (sort === 'k') { return new Map(Object.entries(obj).sort(([ka], [kb]) => (ka > kb ? 1 : kb > ka ? -1 : 0))); }
  if (sort === 'v') { return new Map(Object.entries(obj).sort(([, va], [, vb]) => (va > vb ? 1 : vb > va ? -1 : 0))); }
  return new Map(Object.entries(obj));
};

export class DateRandom {
  constructor(dtStart = new Date(0), dtEnd = new Date(), fn = Math.random, ...args) { // default start on epoch start
    this.dtStart = dtStart;
    this.dtEnd = dtEnd;
    this.fn = fn;
    this.args = args;
    this.tsjStart = dtStart.getTime(); // js time start = epoch ts * 1000 
    this.tsjEnd = dtEnd.getTime();
  }

  randomEpoch() { return this.randomTs() / 1000; }

  randomTs() { return rndWithinInt(this.tsjStart, this.tsjEnd, this.fn, ...this.args); }

  randomDt() { return new Date(this.randomTs()); }

  checkDistribution(count, sort = 'k') {
    // new py.DateRandom(new Date('2021-01-01'), new Date('2021-12-30'), py.rndExponentialInv,16, 1).checkDistribution(1000000, 'k').month
    const groupKeys = Object.keys(dtParseRxGroups(new Date())); // only to get the keys
    const counter = Object.fromEntries(groupKeys.map((k) => [k, {}])); // counter { year: {}, month: {}, day: {}, hour: {}, minute: {}, second: {} }
    for (let cnt = 0; cnt < count; cnt += 1) {
      const rndDt = this.randomDt();
      if (isDate(rndDt)) {
        const parsedKV = dtParseRxGroups(rndDt);
        groupKeys.forEach((k) => {
          const curKK = counter[k][parsedKV[k]];
          counter[k][parsedKV[k]] = (curKK === undefined) ? 1 : curKK + 1;
        });
      }
    }
    return Object.fromEntries(Object.keys(counter).map((k) => [k, mapFromObj(counter[k], sort)]));
  }
}

/**
 * just to check distribution of
 * @param {integer} min lower bound
 * @param {integer} max upper bound
 * @param {integer} count samples
 * @param {Function} fn function to use
 * @return {object} a counter {randomValue: occurrences }
 */
export const checkRndDistribution = (min, max, count = 100, fn = rndNormal, ...args) => {
  const counter = {};
  let rnd;
  for (let cnt = 0; cnt < count; cnt += 1) {
    rnd = rndWithinInt(min, max, fn, ...args);
    counter[rnd] = counter[rnd] ? counter[rnd] + 1 : 1;
  }
  return Object.fromEntries(Object.keys(counter).map((k) => [k, mapFromObj(counter[k], sort)]));
};

/**
 * string ngrams
 * @async
 * @param {string} aString input string
 * @param {integer} [minSize=3] minimum size
 * @param {boolean} [prefixOnly=false] if true only prefix combinations are returned
 * @return {Array} strings
 * @example
 * ngrams('Nick', 2) >> Promise { [ 'Ni', 'Nic', 'Nick', 'ic', 'ick', 'ck' ] }
 * ngrams('Nick', 2, true) >> Promise { [ 'Ni', 'Nic', 'Nick' ] }
 */
export const ngrams = async (aString, minSize = 3, prefixOnly = false) => {
  const rt = [];
  const ngramPrefix = (txt) => {
    for (let i = minSize; i <= Math.max(txt.length, minSize); i += 1) { rt.push(txt.slice(0, i)); }
  };
  if (prefixOnly === true) {
    ngramPrefix(aString);
  } else {
    for (let j = 0; j <= aString.length - minSize; j += 1) { ngramPrefix(aString.slice(j)); }
  }
  return rt;
};
