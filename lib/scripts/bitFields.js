/* eslint-disable no-nested-ternary */
import { randomBetween } from '../Pythagoras.js';
import { arrEquivalent, arrSortGt } from '../Zeno.js';

const testEnumBits = (bEnum) => {
  const flagsCount = randomBetween(0, bEnum.size); // how many flags
  const arrFlags = [];
  const arrIntegers = [];
  while (arrFlags.length < flagsCount) {
    const rndFInt = randomBetween(1, bEnum.size);
    // const rndFlag = bEnum.keys[rndFInt - 1];
    const rndFlag = bEnum.numToFlags(rndFInt);
    if (!arrIntegers.includes(rndFInt)) { // unique only
      arrFlags.push(rndFlag);
      arrIntegers.push(rndFInt);
      // console.log({rndFInt, rndFlag})
    }
  }
  // console.log({ bEnum_size: bEnum.size, arrFlags, arrIntegers });
  // const intFromFlags = bEnum.intFromFlags(arrFlags);
  const intFromFlags = bEnum.flagsToNum(arrFlags);
  // flagsToNum
  const rt = {
    flagsCount,
    intFromFlags: bEnum.flagsToNum(arrFlags),
    arrFlags: arrSortGt(arrFlags),
    flagsObjAll: bEnum.flags(intFromFlags),
    flagsObjTrue: bEnum.flags(intFromFlags, arrFlags),
    intArrFromFlags: arrSortGt(bEnum.intArrFromFlags(arrFlags)),
  };
  if (flagsCount !== arrFlags.length) { throw new Error(`EnumBits: flagsCount(${flagsCount}) !== arrFlags.length (${arrFlags.length})`); } // check loop
  bEnum.flagsFromIntArrLookUp(intFromFlags);
  /*
  if (!arrEquivalent(bEnum.flagsFromIntArrLookUp(intFromFlags), arrFlags)) {
    console.log({error: 9999, flagsFromIntArrLookUp: bEnum.flagsFromIntArrLookUp(intFromFlags), arrFlags, rt });
    throw new Error('EnumBits: flags != flagsFromIntArrLookUp');
  }
  */
  if (!arrEquivalent(bEnum.flagsFromIntArrScan(intFromFlags), arrFlags)) { throw new Error('EnumBits: flags != flagsFromIntArrScan'); }
  if (!arrEquivalent(Object.keys(rt.flagsObjTrue), arrFlags)) { throw new Error('EnumBits: flagsFromArr != arrFlags '); }
  // console.log('end ddddddddddddddddddddddddddddd')
  return rt;
};

export { testEnumBits };
