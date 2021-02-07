import { randomBetween } from './Pythagoras.js';
import { arrEquivalent } from './Zeno.js';

const testEnumBits = (bEnum) => {
  // const rnd = randomBetween(1, 2 ** bEnum.length);
  const flagsCount = randomBetween(1, bEnum.length); // hos many flags
  const arrFlags = [];
  const arrIntegers = [];
  do {
    const rndFInt = randomBetween(0, bEnum.length - 1);
    if (!arrIntegers.includes(rndFInt)) { // unique only
      const rndFlag = bEnum.keys[rndFInt];
      arrFlags.push(rndFlag);
      arrIntegers.push(rndFInt);
    }
  } while (arrFlags.length < flagsCount);
  const intFromFlags = bEnum.intFromFlags(arrFlags);
  const rt = {
    intFromFlags: bEnum.intFromFlags(arrFlags),
    arrFlags,
    flagsObjAll: bEnum.flags(intFromFlags),
    flagsObjTrue: bEnum.flags(intFromFlags, arrFlags),
    intArrFromFlags: bEnum.intArrFromFlags(arrFlags),
  };
  if (flagsCount !== arrFlags.length) { throw new Error('EnumBits: flagsCount !== arrFlags.length'); } // check loop
  if (!arrEquivalent(bEnum.flagsFromIntArrLookUp(intFromFlags), arrFlags)) { throw new Error('EnumBits: flags != flagsFromIntArrLookUp'); }
  if (!arrEquivalent(bEnum.flagsFromIntArrScan(intFromFlags), arrFlags)) { throw new Error('EnumBits: flags != flagsFromIntArrScan'); }
  if (!arrEquivalent(Object.keys(rt.flagsObjTrue), arrFlags)) { throw new Error('EnumBits: flagsFromArr != arrFlags '); }
  return rt;
};

export { testEnumBits };
