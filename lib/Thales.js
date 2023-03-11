/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-bitwise */

/**
 * @module
 * @fileoverview
 * implementation of bit map flags.
 * Named after Thales an ancient Creek mathematician {@link https://en.wikipedia.org/wiki/Thales_of_Miletus}
 * @exportsFix {EnumBits, rndFlagsNum, flagsDoc}
 */

import { libBit32, libBitBI } from 'hipparchos';
import { ErrAcropolisND } from './Hamartia.js';
import { randomBetween } from './Pythagoras.js';

/**
 * unsigned 32bit integer (maximum value = (2 ** 32) -1) for 31 bits actual resolution
 * @typedef {number} Int32
 * @member EnumBits
 */

/**
 * An unsigned 32bit integer or BigInt
 * @typedef {int32|BigInt} Num
 * @member EnumBits
 */

/**
 * a flag object can be anything but usually it is a string i.e. 'apple' 'orange'
 * @typedef {any} Flag
 * @member EnumBits
 */

/**
 * an Object with flags assignments i.e. {flag1: true, flag2: false, ...}
 * @typedef {FlagObj} FlagObj
 * @member EnumBits
 */

/**
 * a class that maps flags to numbers and vice versa
 * numbers are of js number type if number of flags is < 32 or BigInt otherwise
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt }
 * This is so because js bitwise operators are limited to 32 bits
 * If you plan to store those numbers in some kind of storage as a database check for max values it can store
 * if you keep number of flags < 64 then resulting numbers can be casted to what other languages and database usually call unsigned long
 * @class EnumBits
 * @namespace EnumBits
 * @param {Array.<Flag>} flagsArr an array of flags @see fruitsArr
 * @throws {TypeError} Cannot read property x if supplied an invalid flag in any operation that expects a flag
 * @throws {ErrAcropolisND} if flags array contains duplicate flags when instantiating
 * @throws {ErrAcropolisND} if flags array is empty when instantiating
 * @example <caption>usage</caption>
 * <code>
 * const fruits = new EnumBits(['orange', 'mandarin', 'lemon', 'banana', 'mango', 'strawberry', 'watermelon'])
 * fruits.size > 7
 * fruits.maxNum > 127
 * fruits.flags > ['orange', 'mandarin', 'lemon', 'banana', 'mango', 'strawberry', 'watermelon']
 * fruits.flagsToPwr2Arr(['mandarin', 'mango']) > [ 2, 16]
 * fruits.pwr2ArrToFlags([2,16]) >  [ 'mandarin', 'mango']
 * fruits.numToFlags(18) > ['mandarin', 'mango']  // 2 + 16 => 18
 * let num = fruits.setFlag('mandarin') > 2
 * num = fruits.setFlag('mango', num) > 18
 * num = fruits.unsetFlag('mandarin', num) > 16
 * num = fruits.setFlagArr(['lemon', 'banana'], num) > 28
 * fruits.numToFlags(num) > [ 'lemon', 'banana', 'mango' ]
 * num = fruits.toggleFlag('mango', num)) > 12
 * fruits.numToFlags(num) [ 'lemon', 'banana' ]  // mango is gone
 * num = fruits.toggleFlagArr(['watermelon', 'strawberry'], num) > 108
 * fruits.numToFlags(num) > [ 'lemon', 'banana', 'strawberry', 'watermelon' ]
 * fObj = fruits.flagsToObj(num) => { lemon: true, banana: true, strawberry: true, watermelon: true }
 * fObjIF = fruits.flagsToObjIncFalse(num) >  {orange: false,mandarin: false,lemon: true,banana:true,mango: false,strawberry: true,watermelon: true}
 * fruits.flagsFromObj(fObj) > 108
 * fruits.flagsFromObj(fObjIF) > 108
 * ----------------------------------------------------------------------------------
 * flagsBI = [...Array(1000).keys()].map((idx) => `flag_${idx}`) > ['flag_0',  'flag_1',  'flag_2',  'flag_3',  'flag_4',  'flag_5' .... flag_999]
 * enumBI = new EnumBits(flagsBI)
 * enumBI.size > 1000
 * bi = enumBI.flagsToPwr2Arr(['flag_0', 'flag_100', 'flag_101']) > [1n, 1267650600228229401496703205376n, 2535301200456458802993406410752n]
 * enumBI.pwr2ArrToFlags(bi) > [ 'flag_0', 'flag_100', 'flag_101' ]
 * etc etc .... as class operations are symmetrical operates the same as integers.
 * </code>
 */
class EnumBits {
  constructor(flagsArr) {
    this.bitUtl = (flagsArr.length < 32) ? libBit32 : libBitBI;
    this.v0 = this.bitUtl.v0;  // just for easy reference;
    this.v1 = this.bitUtl.v1;
    const idxFn = (idx) => this.bitUtl.v2 ** this.bitUtl.toNum(idx);
    // this.mapFlgFI = Object.freeze(new Map(flagsArr.map((el, idx) => [el, idxFn(idx)])));    // maps flat to index
    this.mapFlgFI = Object.freeze(new Map(flagsArr.map((el, idx) => [el, [this.bitUtl.toNum(idx), idxFn(idx)]]))); // maps flag to index 'lemon' => 2,
    if (this.size < flagsArr.length) { throw new ErrAcropolisND(1003, 'but are not'); }     // check unique
    if (this.size < 1) { throw new ErrAcropolisND(1001); }
    this._flags = null;
    this.mapFlgIF = Object.freeze(new Map(flagsArr.map((el, idx) => [idxFn(idx), el])));    // maps index to flag
  }

  /**
   * length of keys (number of flags stored)
   * @readonly
   * @memberof EnumBits
   */
  get size() { return this.mapFlgFI.size; }

  /**
   * Max supported number
   * @readonly
   * @memberof EnumBits
   */
  get maxNum() { return (this.bitUtl.v2 ** this.bitUtl.toNum(this.size) - this.bitUtl.v1); }

  /**
   * array of all available flags
   * as this is expensive and rarely used we evaluate and store it on first use
   * @readonly
   * @memberof EnumBits
   */
  get flags() {
    if (this._flags === null) { this._flags = [...this.mapFlgFI.keys()]; }
    return this._flags;
  }

  /**
   * maps flags array to powers of 2
   * @param {Array.<Flag>} flagsArr array of flags
   * @return {Array.<Num> } array of powersOf2;
   * @memberof EnumBits
   * @example
   * <code>fruitsEn32.flagsToPwr2Arr</code> >  [ 2, 16 ]
   */
  flagsToPwr2Arr(flagsArr) { return flagsArr.map((flag) => this.mapFlgFI.get(flag)[1]); }

  /**
   * maps array of powers of 2 to corresponding flags
   * @param {Array.<Num>} numArr array od flags
   * @return {Array.<flag> } array of powersOf2;
   * @memberof EnumBits
   */
  pwr2ArrToFlags(numArr) { return numArr.map((num) => this.mapFlgIF.get(num)); }

  /**
   * given a number returns array of corresponding flags
   * @param {Num} num a num
   * @return {Array.<Flag>} foo
   * @memberof EnumBits
   */
  numToFlags(num) { return this.bitUtl.reducePwr2(num).map((x) => this.mapFlgIF.get(x)); }

  /**
   * given an array of flags returns corresponding Num
   * @param {Array.<Flag>} flagsArr an array of flags
   * @return {Num} Num corresponding to flags
   * @memberof EnumBits
   */
  flagsToNum(flagsArr) { return this.bitUtl.arrOR(this.flagsToPwr2Arr(flagsArr)); }

  /**
   * sets a Flag to Num if not already set
   * @param {Flag} flag to set
   * @param {Num} [num=this.v0] original number
   * @return {Num} new Num
   * @memberof EnumBits
   */
  setFlag(flag, num = this.v0) { return num | this.mapFlgFI.get(flag)[1]; }

  /**
   * sets an array of Flags
   * @param {FlaArray.<Flag>} flagsArr to set
   * @param {Num} [num=this.v0] original number
   * @return {Num} new Num
   * @memberof EnumBits
   */
  setFlagArr(flagsArr, num = this.v0) { return num | this.flagsToNum(flagsArr); }

  /**
   * unset a Flag to Num if has been set
   * @param {Flag} flag to set
   * @param {Num} [num=this.v0] original number
   * @return {Num} new Num
   * @memberof EnumBits
   */
  unsetFlag(flag, num = this.v0) { return num & ~this.mapFlgFI.get(flag)[1]; }

  /**
   * unset an array of Flags
   * @param {FlaArray.<Flag>} flagsArr to set
   * @param {Num} [num=this.v0] original number
   * @return {Num} new Num
   * @memberof EnumBits
   */
  unsetFlagArr(flagsArr, num = this.v0) { return num & ~this.flagsToNum(flagsArr); }

  /**
   * toggles a Flag (sets it if has not set or unset if set)
   * @param {Flag} flag to set
   * @param {Num} [num=this.v0] original number
   * @return {Num} new Num
   * @memberof EnumBits
   */
  toggleFlag(flag, num = this.v0) { return num ^ this.mapFlgFI.get(flag)[1]; }

  /**
   * toggle an array of Flags
   * @param {FlaArray.<Flag>} flagsArr to set
   * @param {Num} [num=this.v0] original number
   * @return {Num} new Num
   * @memberof EnumBits
   */
  toggleFlagArr(flagsArr, num = this.v0) { return num ^ this.flagsToNum(flagsArr); }

  /**
   *
   * given a Num returns object with flags as keys and true as values
   * @param {Num} num Number
   * @param {boolean} [trueVal=true]  ff
   * @return {FlagObj|FlagObjLike}  A FlagsObject or FlagObjLike alternative representation of true  if trueVal
   * last case although useful when other libraries expect diffident representation of true i.e {orange: 1, mango: 0} BUT ...
   *  a FlagObjLike is NOT COMPATIBLE with other functions of this library as flagsFromObj
   * @memberof EnumBits
   */
  flagsToObj(num, trueVal = true) { return Object.fromEntries(this.numToFlags(num).map((flag) => [flag, trueVal])); }

  /**
   * same as @see flagsToObj except it includes false values
   *  this is an expensive operation since it has to scan the complete map
   * use it rarely and only when size is small
   * given a Num returns object with flags as keys and true or false as values
   * @param {Num} [num=this.v0] Number
   * @return {FlagObj}  Array of flags
   * @memberof EnumBits
   */
  flagsToObjIncFalse(num = this.v0) {
    return Object.fromEntries(this.flags.map((flag) => [flag, (this.mapFlgFI.get(flag)[1] & num) !== this.v0]));
  }

  /**
   * given an flags object returns corresponding Num
   * @param {FlagObj} FlagObj i,e. {lemon: true, orange: false}
   * @param {Num} [num=this.v0] Number
   * @return {Num} Num
   * @memberof EnumBits
   */
  flagsFromObj(FlagObj, num = this.v0) {
    Object.entries(FlagObj).forEach((kv) => ((kv[1] === true) ? num = this.setFlag(kv[0], num) : num = this.unsetFlag(kv[0], num)));
    return num;
  }

  /**
   *
   * @param {Num} num to check against;
   * @param {Flag} flag a single Flag
   * @return {Boolean} true if num contains flag else false;
   * @example num = fruits.setFlagArr(['lemon', 'mango'])
   * fruits.hasFlag(lm, 'orange') > false
   * @memberof EnumBits
   */
  hasFlag(num, flag) {
    const flagPwr2 = this.mapFlgFI.get(flag)[1];
    return this.bitUtl.EQ((flagPwr2 & num), flagPwr2) === this.v1;
  }

  /**
   *
   * @param {Num} num to check against;
   * @param {FlagsArray.<Flag>} flagsArr to check
   * @return {Boolean} true if num contains each and every flag in FlagsArray
   * @example num = fruits.setFlagArr(['lemon', 'mango'])
   * fruits.hasEveryFlag(num, ['mango']) > true
   * fruits.hasEveryFlag(num, ['mango', 'orange']) > false
   * @memberof EnumBits
   */
  hasEveryFlag(num, flagsArr) { return flagsArr.every((flag) => this.hasFlag(num, flag)); }
}

/**
 * produces a random flags number (mainly for testing)
 *  works only for libBit32 EnumBits
 * @param {EnumBits} bEnum an EnumBits instance
 * @return {Num} flags number
 * @example rndFlagsNum(fruits) > Num
 */
const rndFlagsNum = (bEnum) => randomBetween(0, 2 ** (bEnum.size - 1));

/**
 * produces an object (mainly for testing)
 * @param {EnumBits} bEnum an EnumBits instance
 * @param {EnumBits} num an EnumBits instance
 * @return {Object} object with various values
 * @example flagsDoc(fruits)
 */
const flagsDoc = (bEnum, num = 0) => {
  const numToFlags = bEnum.numToFlags(num);
  return {
    num,
    numToFlags,
    flagsToPwr2Arr: bEnum.flagsToPwr2Arr(numToFlags),
    flagsToNum: bEnum.flagsToNum(numToFlags),
    flagsToObj: bEnum.flagsToObj(num),
    flagsToObjIncFalse: bEnum.flagsToObjIncFalse(num),
  };
};

class Enum32 {
  constructor(flagsArr) {
    const idxFn = (idx) => 2 ** libBit32.toNum(idx);
    this.mapFlgFI = Object.freeze(Object.fromEntries(flagsArr.map((el, idx) => [el, idxFn(idx)]))); // maps flag to index 'lemon' => [ 0, 1 ],
    if (this.size < flagsArr.length) { throw new ErrAcropolisND(1003, 'but are not'); }     // check unique
    if (this.size < 1) { throw new ErrAcropolisND(1001); }
    this._flags = null;
    this.mapFlgIF = Object.freeze(Object.fromEntries(flagsArr.map((el, idx) => [idxFn(idx), el])));    // maps index to flag
  }

  /**
   * length of keys (number of flags stored)
   * @readonly
   * @memberof Enum32
   */
  get size() { return this.mapFlgFI.size; }

  /**
   * Max supported number
   * @readonly
   * @memberof Enum32
   */
  get maxNum() { return (2 ** libBit32.toNum(this.size) - 1); }

  /**
   * array of all available flags
   * as this is expensive and rarely used we evaluate and store it on first use
   * @readonly
   * @memberof Enum32
   */
  get flags() {
    if (this._flags === null) { this._flags = [...Object.keys(this.mapFlgFI)]; }
    return this._flags;
  }

  /**
   * maps flags array to powers of 2
   * @param {Array.<Flag>} flagsArr array of flags
   * @return {Array.<Num> } array of powersOf2;
   * @memberof Enum32
   * @example
   * <code>fruitsEn32.flagsToPwr2Arr</code> >  [ 2, 16 ]
   */
  flagsToPwr2Arr(flagsArr) { return flagsArr.map((flag) => this.mapFlgFI[flag]); }

  /**
   * maps array of powers of 2 to corresponding flags
   * @param {Array.<Num>} numArr array od flags
   * @return {Array.<flag> } array of powersOf2;
   * @memberof Enum32
   */
  pwr2ArrToFlags(numArr) { return numArr.map((num) => this.mapFlgIF[num]); }

  /**
   * given a number returns array of corresponding flags
   * @param {Num} num a num
   * @return {Array.<Flag>} foo
   * @memberof Enum32
   */
  numToFlags(num) { return libBit32.reducePwr2(num).map((x) => this.mapFlgIF[x]); }

  /**
   * given an array of flags returns corresponding Num
   * @param {Array.<Flag>} flagsArr an array of flags
   * @return {Num} Num corresponding to flags
   * @memberof Enum32
   */
  flagsToNum(flagsArr) { return libBit32.arrOR(this.flagsToPwr2Arr(flagsArr)); }

  /**
   * sets a Flag to Num if not already set
   * @param {Flag} flag to set
   * @param {Num} [num=this.v0] original number
   * @return {Num} new Num
   * @memberof Enum32
   */
  setFlag(flag, num) { return num | this.mapFlgFI[flag]; }

  /**
   * sets an array of Flags
   * @param {FlaArray.<Flag>} flagsArr to set
   * @param {Num} [num=this.v0] original number
   * @return {Num} new Num
   * @memberof Enum32
   */
  setFlagArr(flagsArr, num) { return num | this.flagsToNum(flagsArr); }

  /**
   * unset a Flag to Num if has been set
   * @param {Flag} flag to set
   * @param {Num} [num=this.v0] original number
   * @return {Num} new Num
   * @memberof Enum32
   */
  unsetFlag(flag, num) { return num & ~this.mapFlgFI[flag]; }

  /**
   * unset an array of Flags
   * @param {FlaArray.<Flag>} flagsArr to set
   * @param {Num} num original number
   * @return {Num} new Num
   * @memberof Enum32
   */
  unsetFlagArr(flagsArr, num) { return num & ~this.flagsToNum(flagsArr); }

  /**
   * toggles a Flag (sets it if has not set or unset if set)
   * @param {Flag} flag to set
   * @param {Num} num original number
   * @return {Num} new Num
   * @memberof Enum32
   */
  toggleFlag(flag, num = this.v0) { return num ^ this.mapFlgFI.get(flag)[1]; }

  /**
   * toggle an array of Flags
   * @param {FlaArray.<Flag>} flagsArr to set
   * @param {Num} num original number
   * @return {Num} new Num
   * @memberof Enum32
   */
  toggleFlagArr(flagsArr, num) { return num ^ this.flagsToNum(flagsArr); }

  /**
   *
   * given a Num returns object with flags as keys and true as values
   * @param {Num} num Number
   * @param {boolean} [trueVal=true]  ff
   * @return {FlagObj|FlagObjLike}  A FlagsObject or FlagObjLike alternative representation of true  if trueVal
   * last case although useful when other libraries expect diffident representation of true i.e {orange: 1, mango: 0} BUT ...
   *  a FlagObjLike is NOT COMPATIBLE with other functions of this library as flagsFromObj
   * @memberof Enum32
   */
  flagsToObj(num, trueVal = true) { return Object.fromEntries(this.numToFlags(num).map((flag) => [flag, trueVal])); }

  /**
   * same as @see flagsToObj except it includes false values
   *  this is an expensive operation since it has to scan the complete map
   * use it rarely and only when size is small
   * given a Num returns object with flags as keys and true or false as values
   * @param {Num} num Number
   * @return {FlagObj}  Array of flags
   * @memberof Enum32
   */
  flagsToObjIncFalse(num) {
    return Object.fromEntries(this.flags.map((flag) => [flag, (this.mapFlgFI[flag] & num) !== 0]));
  }

  /**
   * given an flags object returns corresponding Num
   * @param {FlagObj} FlagObj i,e. {lemon: true, orange: false}
   * @param {Num} num Number
   * @return {Num} Num
   * @memberof Enum32
   */
  flagsFromObj(FlagObj, num) {
    Object.entries(FlagObj).forEach((kv) => ((kv[1] === true) ? num = this.setFlag(kv[0], num) : num = this.unsetFlag(kv[0], num)));
    return num;
  }

  /**
   *
   * @param {Num} num to check against;
   * @param {Flag} flag a single Flag
   * @return {Boolean} true if num contains flag else false;
   * @example num = fruits.setFlagArr(['lemon', 'mango'])
   * fruits.hasFlag(lm, 'orange') > false
   * @memberof Enum32
   */
  hasFlag(num, flag) {
    const flagPwr2 = this.mapFlgFI[flag];
    return ((flagPwr2 & num) === flagPwr2);
  }

  /**
   *
   * @param {Num} num to check against;
   * @param {FlagsArray.<Flag>} flagsArr to check
   * @return {Boolean} true if num contains each and every flag in FlagsArray
   * @example num = fruits.setFlagArr(['lemon', 'mango'])
   * fruits.hasEveryFlag(num, ['mango']) > true
   * fruits.hasEveryFlag(num, ['mango', 'orange']) > false
   * @memberof EnumBits
   */
  hasEveryFlag(num, flagsArr) { return flagsArr.every((flag) => this.hasFlag(num, flag)); }
}

export {
  EnumBits,
  rndFlagsNum,
  flagsDoc,
  Enum32,
};
