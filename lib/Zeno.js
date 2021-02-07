/**
 * @fileoverview
 * mostly array utilities
 * Named after Zeno an ancient Creek Mathematician who has struggled with the concept of infinity and envisioned set theory
 * {@link https://en.wikipedia.org/wiki/Zeno_of_Elea}
 *
*/

/**
 * @param {array} arrA 1st Array
 * @param {array} arrB 2nd Array
 * @returns {array} intersection will give us the elements that both arrays share in common
 */
const arrIntersection = (arrA, arrB) => arrA.filter((x) => arrB.includes(x));

/**
 * @param {array} arrA 1st Array
 * @param {array} arrB 2nd Array
 * @returns {array} difference => the elements from array A that are not in the array B
 */
const arrDiff = (arrA, arrB) => arrA.filter((x) => !arrB.includes(x));

/**
 * @param {array} arrA 1st Array
 * @param {array} arrB 2nd Array
 * @returns {array} diff symmetrical => array containing all the elements of arrA that are not in arrB and vice-versa
 * if empty [] means that the 2 arrays contain same elements (although may be in different order and elements can be repeated )
 * @example arrDiffSym([ 'mango', 'watermelon' ], [ 'mango', 'watermelon', 'watermelon' ]) >> []
)
 */
const arrDiffSym = (arrA, arrB) => [...arrDiff(arrA, arrB), ...arrDiff(arrB, arrA)];

/**
 * @param {array} arrA 1st Array
 * @param {array} arrB 2nd Array
 * @returns {boolean} arrEquivalent both arrays contain same elements (it can be in different order)
 */
const arrEquivalent = (arrA, arrB) => arrA.length === arrB.length && arrDiffSym(arrA, arrB).length === 0;

/**
 * @param {array} arrA 1st Array
 * @param {array} arrB 2nd Array
 * @returns {array} diff symmetrical => unique elements from A, all from B, or both
 */
const arrUnion = (arrA, arrB) => [...new Set([...arrA, ...arrB])];

/**
 * produces a sequence array applying fn to
 * @param {Integer} length of array to produce
 * @param {function} [fn=(i) => i + 1] fy
 * @param {object} [args={}] any extra arguments
 * @returns {array} array
 */
const arrSequence = (length, fn = (i) => i + 1, args = {}) => Array.from({ length }, (_, i) => fn(i, args));
/**
 *
 * produces a sequence of numbers from start to stop
 * @param {number} start start value
 * @param {number} stop  stop value
 * @param {number} step  step value
 * @returns {array} results
 * @warning no guaranties of accuracy if any number is float
 */
const arrRange = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));

export {
  arrIntersection,
  arrDiff,
  arrDiffSym,
  arrUnion,
  arrEquivalent,
  arrSequence,
  arrRange,
};
