/**
 * @description numbers and maths utilities Named after Pythagoras of Samos an ancient Greek 
 * philosopher/mathematician and the eponymous founder of Pythagoreanism. 
 * https://en.wikipedia.org/wiki/Pythagoras 
 * @author nickmilon
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
 * checks if value is a proper number
 * @param {any} value to check
 * @return {boolean} true if number false otherwise
 */
const isNumber = (value) => {
  if (typeof value !== 'number' || value !== Number(value) || Number.isFinite(value) === false) { return false; }
  return true;
};

/**
 * random integer between min - nax (included)
 * @param {integer} min lower bound
 * @param {integer} max upper bound
 * @return {float} random integer
 */
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min); // 
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
  percent,
  randomBetween,
};
