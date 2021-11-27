/* eslint-disable no-nested-ternary */

/**
 * @module
 * @fileOverview
 * mostly array utilities
 * Named after Zeno an ancient Creek Mathematician who has struggled with the concept of infinity and envisioned set theory
 * {@link https://en.wikipedia.org/wiki/Zeno_of_Elea}
 * @exports {arrIntersection, arrDiff, arrDiffSym}
 */

/**
 * helper to create dummy arrays mainly for testing
 * @param {Number} n number of elements to create
 * @param {String} [prefix='flag_'] a prefix to use
 * @return {Array.<string>} an array of strings
 * @example const flagsArr5 = dummyArr(3) >> [flag_0',  'flag_1',  'flag_2']
 */
const arrDummyStr = (n, prefix = 'flag_') => [...Array(n).keys()].map((idx) => `${prefix}${idx}`);

/**
 * intersection (elements that both arrays share in common)
 * @param {array} arrA 1st Array
 * @param {array} arrB 2nd Array
 * @returns {array} intersection results
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
 * @returns {boolean} true if arr have === elements in same idx
 */
const arrIdentical = (arrA, arrB) => arrA.length === arrB.length && arrA.every((e, idx) => e === arrB[idx]);

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

/**
 * tests if arrA is a subset of arrB
 * @param {array} arrA 1st Array
 * @param {array} arrB 2nd Array
 * @returns {Boolean} true if arrB includes all elements of arrA
 */
const arrSubset = (arrA, arrB) => arrA.every((x) => arrB.includes(x));

/**
 *
 * sort array of any numbers
 * @param {array.<Number>} arr to sort
 * @returns {array} sorted;
 * @warning will not work for bigInt coz can't cast those to numbers;
 */
const arrSortNumbers = (arr) => arr.sort((a, b) => a - b);

/**
 * generic sort array of any type that comparison operators work
 * @param {array.<Number>} arr array to sort
 * @return {array} sorted;
 */
const arrSortGt = (arr) => arr.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));

/**
 * gets first and last element of an array
 * @param {Array} arr an array
 * @returns {Array} => [first_element, last_element] if array is Empty => [ undefined, undefined ] if single element => [first_element, first_element]
 */
const arrFirstLast = (arr) => {
  const { 0: first, length: l, [l - 1]: last } = arr;
  return [first, last];
};

export {
  arrDummyStr,
  arrIntersection,
  arrDiff,
  arrDiffSym,
  arrUnion,
  arrEquivalent,
  arrIdentical,
  arrSequence,
  arrRange,
  arrSubset,
  arrSortNumbers,
  arrSortGt,
  arrFirstLast,
};
