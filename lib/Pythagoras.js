/* eslint-disable no-bitwise */
/* eslint-disable no-restricted-globals */

/**
 * @module
 * @fileoverview
 * numbers and maths utilities Named after Pythagoras of Samos an ancient Greek
 * philosopher/mathematician and the eponymous founder of Pythagoreanism.
 * {@link https://en.wikipedia.org/wiki/Pythagoras}
 */

/**
 * percent
 * @param {number} percentage percentage of total
 * @param {number} total total number
 * @return {float} percentage
 * @example percent(1, 200) >> 0.5
 */
const percent = (percentage, total) => 100 * (percentage / total);

/**
 * trims the path and returns filename
 * @param {String} uriOrPath to trim
 * @returns {string} fileName (with extension)
 */
const fileName = (uriOrPath) => uriOrPath.split('\\').pop().split('/').pop();

/**
 * trims out extension from a fileName (can handle multiple dots in fileName)
 * @param {string} uriOrPath to extract base
 * @returns {string} aFileName base
 */
const fileNameTrimExt = (uriOrPath) => fileName(uriOrPath).replace(/\.[^/.]+$/, '');

const isFileNameEqual = (uriOrPath1, uriOrPath2) => fileName(uriOrPath1) === fileName(uriOrPath2);
const isFileNameTrimmedEqual = (uriOrPath1, uriOrPath2) => fileNameTrimExt(uriOrPath1) === fileNameTrimExt(uriOrPath2);

/* 
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const  getDirname(importMetaUrl) => {
  return fileURLToPath(dirname(importMetaUrl));
}
*/

/**
 * checks if value is a proper number
 * @param {any} val value to check
 * @return {boolean} true if number false otherwise
 */
const isNumber = (val) => (typeof value === 'number' || val === Number(val) || Number.isFinite(val) === true);

/**
 * checks if value is a proper Object
 * @param {any} val value to check
 * @return {boolean} true if number false otherwise
*/
const isObject = (val) => (typeof val === 'object' && val !== null);

/**
 * checks if value is a proper number
 * @param {any} val value to check
 * @return {boolean} true if string false otherwise
 */
const isString = (val) => (typeof val === 'string' || val instanceof String);

/**
 * checks if value is a proper date protects from invalid dates like new Date('foo') in Node;
 * @param {any} value value to check
 * @return {boolean} true if string false otherwise
 */
const isDate = (value) => value instanceof Date && !isNaN(value.getMonth());

/**
 * checks if value is within (INCLUDING) given limits
 * @param {any} val value to check any type to where > and < operators can apply
 * @param {any} min value
 * @param {any} max value
 * @return {boolean} true if within limits
 */
const isInRange = (val, min, max) => (val >= min && val <= max);

/**
 * checks if value is within given limits (included) amd if not returns valDefault
 * @param {any} val value to check any type to where > and < operators can apply
 * @param {Number} valDefault value to return if not within limits
 * @param {any} min value
 * @param {any} max value
 * @return {Number} valDefault or val
 */
const inRangeOrDefault = (val, valDefault, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) => (isInRange(val, min, max) ? val : valDefault);
/**
 * parses value to Int and checks if value is within given limits (included) returns valDefault if not else parsed integer
 * @param {any} val value to check )any type that can be parsed to integer)
 * @param {Number} valDefault value to return if not within limits
 * @param {Integer} min value
 * @param {Integer} max value
 * @return {Integer} valDefault or val
 */
const intOrDefault = (val, valDefault, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) => inRangeOrDefault(val | 0, valDefault, min, max);

/**
 * random integer between min - nax (included)
 * @param {integer} min lower bound
 * @param {integer} max upper bound
 * @return {float} random integer
 */
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
/**
 * string ngrams
 * @async
 * @param {string} aString f
 * @param {integer} [minSize=3] minimum size
 * @param {boolean} [prefixOnly=false] if true only prefix combinations are returned
 * @return {Array} strings
 * @example
 * ngrams('Nick', 2) >> Promise { [ 'Ni', 'Nic', 'Nick', 'ic', 'ick', 'ck' ] }
 * ngrams('Nick', 2, true) >> Promise { [ 'Ni', 'Nic', 'Nick' ] }
 */
const ngrams = async (aString, minSize = 3, prefixOnly = false) => {
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

export {
  ngrams,
  isNumber,
  isObject,
  isString,
  isDate,
  isInRange,
  inRangeOrDefault,
  intOrDefault,
  percent,
  fileName,
  fileNameTrimExt,
  isFileNameEqual,
  isFileNameTrimmedEqual,
  randomBetween,
};
