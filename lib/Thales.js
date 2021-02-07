/* eslint-disable no-bitwise */

/**
 * @fileoverview
 * math classes and bitwise operations
 * Named after Thales an ancient Creek mathematician {@link https://en.wikipedia.org/wiki/Thales_of_Miletus}
 * {@link https://graphics.stanford.edu/~seander/bithacks.html#DetermineIfPowerOf2}
 */

import { objFlip } from './Plato.js';
import { ErrAcropolisND } from './Hamartia.js';

/**
 * @param {Integer} int number to check
 * @return {Boolean} if int is power of two
 * @example isPwrOf2(0) >> true; isPwrOf2(9) >> false
 */
const isPwrOf2 = (int) => (int & (int - 1)) === 0;

/**
 * @param {Integer} int number to check
 * @return {Integer} count of bits set
 * @see Brian Kernighan' Algorithm
 * @example countBitsSet(Number.MAX_SAFE_INTEGER) >> 32
 * @note recursive version: (~2X slower) const countBitsSetR = (int) => (int === 0) ? 0 : 1 + countBitsSetR(int & (int - 1))
 */
const bitsSetCount = (int) => {
  let count = 0;
  let assInt = int;
  while (int) { assInt &= (assInt - 1); count += 1; }
  return count;
};

/**
 * @param {Integer} int integer to check
 * @return {Array.<Integer>} bits that are set
 * @example bitsSet(6) >> [ 2, 3 ]
 * @warning for efficiency is capped to max 30 bits !!
 *
 */
const bitsSet = (int) => {
  const rt = [];
  for (let i = 1, c = 1; i <= int; i <<= 1, c += 1) { if (int & i) { rt.push(c); } }
  return rt;
};

/**
 * @param {Integer} int integer
 * @return {Array.<Integer>} bits that are set
 * @example bitsSetValues(6) >> [ 2, 4 ]
 * @warning for efficiency is capped to max 30 bits !!!
 */
const bitsSetValues = (int) => {
  const rt = [];
  for (let i = 1; i <= int; i <<= 1) { if (int & i) { rt.push(i); } }
  return rt;
};

/**
 * @param {Array.<Integer>} intArr array of integers to be OR-ed together
 * @return {Integer} OR result
 * @example arrOR([2,4]) > 6
 * @warning result can't be > 32 bits
 */
const arrOR = (intArr) => intArr.reduce((accumulator, currentValue) => accumulator | currentValue, 0);

/**
 * @param {Array.<Integer>} intArr array of integers to be AND-ed together
 * @return {Integer} OR result
 * @example arrOR([6,2]) > 2
 * @warning integers can't be > 32 bits
 */
const arrAND = (intArr) => intArr.reduce((accumulator, currentValue) => accumulator & currentValue, intArr.length > 0 ? intArr[0] : 0);

/**
 * key value storage
 * max number of flags that can be represented with a single integer in js is 52, limited
 * by Number.MAX_SAFE_INTEGER  (2 ** 52 < Number.MAX_SAFE_INTEGER)
 * Above applies when we represent flags array with an array of integers,
 * if we want to represented by a single integer then number of flags is limited to 30 bits,
 * this is so because js bitwise operators are limited to 32 bits (but for efficiency we cape it to 30)
 * @Warning if you plan to store those integers in some storage as a database check for max integer it can store
 * @class EnumBits
 * @param {Object | Array} [flagsObjOrArray={}] i.e: (Object.freeze({ lemon: 2, orange: 4}} | ['lemon', 'orange']
 * @throws {}
 * if Array a dictionary object will be auto constructed using powers of 2 with the given index within the array
 * @example const fruits = new EnumBits(['lemon', 'orange', 'watermelon'])
 */

class EnumBits {
  constructor(flagsObjOrArray = {}, { allow52bits = false } = {}) {
    if (Array.isArray(flagsObjOrArray)) {
      if (new Set(flagsObjOrArray).size < flagsObjOrArray.length) { throw new ErrAcropolisND(1003, 'but are not'); } // check unique
      this.flagsObj = Object.freeze(Object.fromEntries((flagsObjOrArray.map((el, index) => [el, 2 ** index]))));
    } else { this.flagsObj = flagsObjOrArray; }
    this.keys = Object.keys(this.flagsObj); // so we don't recalculate all the time;
    if (this.length > 52) { throw new ErrAcropolisND(1001, `but is: ${this.keys.length}`); }
    if (this.length > 30 && allow52bits === false) { throw new ErrAcropolisND(1002, `but is:${this.keys.length}`); }
    this.flagsFlipped = objFlip(this.flagsObj); // (keys become values and vice versa) useful for fast reverse lookup
  }

  /**
   * length of keys (number of flags stored)
   * @readonly
   * @memberof EnumBits
   */
  get length() { return this.keys.length; }

  /**
   * limit keys to includeFlagsArr
   * @param {Array.<String> | undefined } includeFlagsArr keys to include or all if undefined
   * @return {Array.<String> } keys to include
   * @memberof EnumBits
   */
  inclFlagsArrOrAll(includeFlagsArr) {
    return (includeFlagsArr === undefined) ? this.keys : this.keys.filter((x) => includeFlagsArr.includes(x));
  }

  /**
   * @param {Integer} val check if value corresponds to properties
   * @param {Array.<String>} includeFlagsArr limit result to members of specified array
   * @return {{property: Boolean, property: Boolean }} key values pairs
   * @example
   * fruits.flagsFromIntObj(6) >> { lemon: false, orange: true, watermelon: true }
   * fruits.flagsFromIntObj(6, ['lemon']) >> { lemon: true }
   * @memberof EnumBits
   */
  flagsFromIntObj(val, includeFlagsArr) {
    return Object.fromEntries(this.inclFlagsArrOrAll(includeFlagsArr).map((flg) => [flg, (val & this.flagsObj[flg]) === this.flagsObj[flg]]));
  }

  /**
   * OR valuesArr and check for corresponding properties useful when properties are stored as array of integers instead of single integer
   * @param {Array.<Integer>} valuesArr check if values Array corresponds to properties
   * @param {Array.<String>} includeFlagsArr limit result to members of specified array
   * @return {{property: Boolean, property: Boolean }} key values pairs
   * @example
   * fruits.flagsFromArr([2,4]) >>      { lemon: true, orange: true, watermelon: false }
   * fruits.flagsFromArr([2,4,6,2]) >>  { lemon: true, orange: true, watermelon: false }
   * @memberof EnumBits
   */
  flagsFromArr(valuesArr, includeFlagsArr) {
    return this.flagsFromIntObj(arrOR(valuesArr), includeFlagsArr);
  }

  /**
   * shortcut for flagsFromArr or flagsFromIntObj
   * @param {Integer | Array.<Integer>} valOrArr check if values Array corresponds to properties
   * @param {Array.<String>} includeFlagsArr limit result to members of specified array
   * @return {{property: Boolean, property: Boolean }} key values pairs
   * @memberof EnumBits
   */
  flags(valOrArr, includeFlagsArr) {
    return (Array.isArray(valOrArr)) ? this.flagsFromArr(valOrArr, includeFlagsArr) : this.flagsFromIntObj(valOrArr, includeFlagsArr);
  }

  /**
   * @param {Array.<String>} flagsArr array of integers to be OR-ed together
   * @return {Array.<Integer | undefined>} array of flags as integers or undefined if flag not in flagsObj
   * @example
   * fruits.intArrFromFlags([ 'lemon', 'orange']) >> [ 1, 2 ]
   * fruits.intArrFromFlags([ 'lemon', 'orange', 'foo']) >> [ 1, 2, undefined ]
  */
  intArrFromFlags(flagsArr) { return flagsArr.map((x) => this.flagsObj[x]); } // =>  [1, 2 , 4, 16. etc]

  /**
   * see intArrFromFlags filtered for possible undefined
   * @param {Array.<String>} flagsArr array of integers to be OR-ed together
   * @return {Array.<Integer>} array of flags as integers
   * @example
   * fruits.intArrFromFlags([ 'lemon', 'orange']) >> [ 1, 2 ]
   * fruits.intArrFromFlags([ 'lemon', 'orange', 'foo']) >> [ 1, 2, undefined ]
  */
  intArrFromFlagsFilterUndefined(flagsArr) { return this.intArrFromFlags(flagsArr.filter((v) => (v !== undefined))); }

  /**
   * see intArrFromFlags filtered for possible undefined
   * @param {Array.<String>} flagsArr array of integers to be OR-ed together
   * @return {Integer} integer representing the flags
   * @example fruits.intFromFlags(['lemon', 'orange', 'watermelon']) >> 7
   * @note invalid flags are ignored, can handle empty array
  */
  intFromFlags(flagsArr) { return arrOR(this.intArrFromFlags(flagsArr)); }

  /**
   * @param {Integer} int array of integers to be OR-ed together
   * @return {Array.<String>} integer representing the flags
   * @example fruits.flagsFromIntArrScan(7) >> [ 'lemon', 'orange', 'watermelon' ]
   * @note inefficient if flagsObj is big since it scans all entries prefer flagsFromIntArrLookUp
  */
  flagsFromIntArrScan(int) { return Object.entries(this.flagsObj).filter((kv) => (kv[1] & int) === kv[1]).map((kv) => kv[0]); }

  /**
   * @param {Integer} int array of integers to be OR-ed together
   * @return {Array.<String>} integer representing the flags
   * @example fruits.flagsFromIntArrScan(7) >> [ 'lemon', 'orange', 'watermelon' ]
   * @see flagsFromIntArrScan same functionality the only differs is on algorithm, this one is more efficient
  */
  flagsFromIntArrLookUp(int) { return bitsSetValues(int).map((x) => this.flagsFlipped[x]); }
}

export {
  arrOR,
  arrAND,
  isPwrOf2,
  bitsSetCount,
  bitsSet,
  bitsSetValues,
  EnumBits,
};
