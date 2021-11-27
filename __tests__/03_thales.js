/* eslint-disable no-bitwise */
/* eslint-disable no-new */
/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
/**
 * @jest-environment node
 */

import { Thales, Pythagoras, Zeno, Plato } from '../index.js'; // import all to check imports
import { fruitsArr } from '../lib/scripts/examples.js';

const { EnumBits } = Thales;
const { randomBetween } = Pythagoras;
const { arrEquivalent, arrSubset, arrDummyStr } = Zeno;
const logger = (__inspect__ === true) ? console : Plato.DummyLogger;
// eslint-disable-next-line no-console
console.info('*** set __inspect__ var in package.json to true || false to view/hide test details ***');

const timeFun = (fn, loops = 100, opsName = 'timeFun') => {
  logger.time(opsName);
  for (let cnt = 0; cnt <= loops; cnt += 1) {
    fn();
  }
  logger.timeEnd(opsName);
};

describe('check Acropolis-nd bitwise operations', () => {
  beforeAll(() => {
  });

  afterAll(async () => {
  });

  it('Thales benchmark', async () => {
    if (!__inspect__) { return; }
    const loops = 10000;
    const dummyArrArr = arrDummyStr(100, 'dummy_');
    const enumFlags = new EnumBits(dummyArrArr);
    // logger.log({ obj: enumFlags.flagsObj, map: enumFlags.flagsMap, dummyArrArr})
    const idxToGet = BigInt(2 ** 9);
    // logger.log({ obj: enumFlags.flagsObj[idxToGet], map: enumFlags.flagsMap.get(idxToGet), dummyArrArr: dummyArrArr[100]})
    timeFun(() => enumFlags.flagsToObj[idxToGet], loops, 'Thales_obj');
    const obj = enumFlags.flagsToObj(idxToGet);
    timeFun(() => enumFlags.flagsFromObj(obj), loops, 'Thales.map');
  });
  it('examples', () => {
    const fruits = new EnumBits(['orange', 'mandarin', 'lemon', 'banana', 'mango', 'strawberry', 'watermelon'])
    expect(fruits.size).toEqual(7);
    expect(fruits.maxNum).toEqual(127);
    expect(arrEquivalent(fruits.flagsToPwr2Arr(['mandarin', 'mango']), [2, 16])).toBe(true);
    expect(arrEquivalent(fruits.numToFlags(18), ['mandarin', 'mango'])).toBe(true);

    let num = fruits.setFlag('mandarin');
    expect(num).toEqual(2);

    num = fruits.setFlag('mango', num);
    expect(num).toEqual(18);

    num = fruits.unsetFlag('mandarin', num);
    expect(num).toEqual(16);

    num = fruits.setFlagArr(['lemon', 'banana'], num);
    expect(num).toEqual(28);
    expect(arrEquivalent(fruits.numToFlags(num), ['lemon', 'banana', 'mango'])).toBe(true);

    num = fruits.toggleFlag('mango', num);
    expect(num).toEqual(12);
    expect(arrEquivalent(fruits.numToFlags(num), ['lemon', 'banana'])).toBe(true); // mango is gone

    num = fruits.toggleFlagArr(['watermelon', 'strawberry'], num);
    expect(arrEquivalent(fruits.numToFlags(num), ['lemon', 'banana', 'strawberry', 'watermelon'])).toBe(true);

    let fObj = fruits.flagsToObj(num);
    expect(fruits.flagsFromObj(fObj)).toEqual(num);
    expect(arrEquivalent(Object.entries(fObj).map(([k]) => k), ['lemon', 'banana', 'strawberry', 'watermelon'])).toBe(true); 

    fObj = fruits.flagsToObjIncFalse(num);
    expect(fruits.flagsFromObj(fObj)).toEqual(num);
    expect(arrEquivalent(Object.entries(fObj).filter((kv) => kv[1] === true).map(([k]) => k), ['lemon', 'banana', 'strawberry', 'watermelon'])).toBe(true); 

    const flagsBI = [...Array(1000).keys()].map((idx) => `flag_${idx}`);
    const enumBI = new EnumBits(flagsBI);

    expect(enumBI.size).toEqual(1000);

    const bi = enumBI.flagsToPwr2Arr(['flag_0', 'flag_100', 'flag_101']);
    expect(arrEquivalent(enumBI.pwr2ArrToFlags(bi), ['flag_0', 'flag_100', 'flag_101'])).toBe(true);
  });

  it('creation and operations', () => {
    const flagsArr100 = arrDummyStr(100);
    expect(() => { new EnumBits([...fruitsArr, fruitsArr[0]]); }).toThrow('EnumBits: flags must be unique but are not');
    expect(() => { new EnumBits([...flagsArr100, flagsArr100[0]]); }).toThrow('EnumBits: flags must be unique but are not');
    expect(() => { new EnumBits([]); }).toThrow();
    const enumFruits = new EnumBits(fruitsArr);
    const enumDummy100 = new EnumBits(flagsArr100);
    expect(enumFruits.mapFlgIF.size).toEqual(enumFruits.mapFlgFI.size); // we didn't mess up in maps
    expect(enumDummy100.mapFlgIF.size).toEqual(enumDummy100.mapFlgFI.size); // we didn't mess up in maps
    expect(arrEquivalent(enumFruits.numToFlags(3), [fruitsArr[0], fruitsArr[1]])).toBe(true);
    expect(arrEquivalent(enumFruits.numToFlags(3), [fruitsArr[4]])).toBe(false);
    // logger.log({ flagsArr100, numToFlags: enumDummy100.numToFlags(3n) });
    expect(arrEquivalent(enumDummy100.numToFlags(3n), [flagsArr100[0], flagsArr100[1]])).toBe(true);
    expect(arrEquivalent(enumDummy100.numToFlags(2n ** 99n), [flagsArr100[99]])).toBe(true);
    const numToFlags = enumFruits.numToFlags(3);
    const flagsToNum = enumFruits.flagsToNum(numToFlags);
    logger.log({ numToFlags, flagsToNum });
    expect(enumFruits.flagsToNum(enumFruits.numToFlags(3))).toEqual(3);
    expect(enumDummy100.flagsToNum(enumDummy100.numToFlags((2n ** 40n) - 1n))).toEqual((2n ** 40n) - 1n);
    enumFruits.setFlag('banana', 0);
    expect(arrEquivalent(enumFruits.numToFlags(enumFruits.setFlag('banana', 0)), ['banana'])).toBe(true);
    expect(arrEquivalent(enumFruits.numToFlags(enumFruits.toggleFlag('banana', 0)), ['banana'])).toBe(true);
    const [fruit0, fruit1, fruitN] = [fruitsArr[0], fruitsArr[1], fruitsArr[fruitsArr.length - 1]];
    let num = enumFruits.flagsToNum([fruit0, fruitN]);
    expect(arrEquivalent(enumFruits.numToFlags(num), [fruitN, fruit0])).toBe(true);
    num = enumFruits.toggleFlag(fruitN, num);
    expect(arrEquivalent(enumFruits.numToFlags(num), [fruitN])).toBe(false);
    expect(arrEquivalent(enumFruits.numToFlags(num), [fruit0])).toBe(true);
    num = enumFruits.toggleFlag(fruitN, num); // back to 2 fruits
    expect(arrEquivalent(enumFruits.numToFlags(num), [fruitN, fruit0])).toBe(true);
    num = enumFruits.toggleFlag(fruit1, num);
    expect(arrSubset([fruitN, fruit0], enumFruits.numToFlags(num))).toBe(true);
    num = enumFruits.unsetFlag(fruitN, num);
    expect(arrEquivalent(enumFruits.numToFlags(num), [fruit1, fruit0])).toBe(true);
  });

  it('Thales randomized tests', () => {
    const loops = 1000;
    const dummyFlags = arrDummyStr(randomBetween(32, 100));
    const enumDummy = new EnumBits(dummyFlags);
    const enumFruits = new EnumBits(fruitsArr);
    const tst = (enm) => {
      const { flags } = enm;
      const [f0, f1, f2, fn, fRnd] = [flags[0], flags[1], flags[2], flags[enm.size - 1], flags[randomBetween(3, enm.size - 2)]];
      // logger.log('xxxx', { flags, subset: [f0, f2, fn, fRnd] });
      let num = enm.setFlagArr([f0, f2, fn, fRnd]);
      num = enm.toggleFlag(fRnd, num);
      expect(arrEquivalent(enm.numToFlags(num), [f0, f2, fn])).toBe(true);
      num = enm.toggleFlagArr([fRnd, f0], num);
      expect(arrEquivalent(enm.numToFlags(num), [f2, fn, fRnd])).toBe(true);
      num = enm.setFlagArr([fRnd, f0], num);
      expect(arrEquivalent(enm.numToFlags(num), [f0, f2, fn, fRnd])).toBe(true); // back to start
      num = enm.unsetFlagArr([fRnd, fRnd], num);
      expect(arrEquivalent(enm.numToFlags(num), [f0, f2, fn])).toBe(true);
      num = enm.toggleFlagArr([fRnd, fRnd], num);
      expect(arrEquivalent(enm.numToFlags(num), [f0, f2, fn, fRnd])).toBe(true); // back to start
      let flagObj = { [f0]: false, [f1]: true, [fn]: true, [fRnd]: false };
      num = enm.flagsFromObj(flagObj);
      expect(arrEquivalent(enm.numToFlags(num), [f1, fn])).toBe(true);
      num = enm.flagsToNum([f0, f1, fRnd]);
      flagObj = enm.flagsToObj(num);
      expect(num).toEqual(enm.flagsFromObj(flagObj));
      expect(enm.flagsToNum([f0, f0, f1, f1, fRnd])).toEqual(enm.flagsToNum([f0, f1, fRnd])); // duplicates don't matter
      // logger.log({ maxNumFlags: enm.numToFlags(enm.maxNum) });
      num = enm.flagsToNum([f1, fRnd]);
      flagObj = enm.flagsToObjIncFalse(num);
      expect(flagObj[f1]).toBe(true);
      expect(flagObj[fRnd]).toBe(true);
      expect(flagObj[fn]).toBe(false);
      expect(flagObj[f0]).toBe(false);
    };
    for (let index = 1; index <= loops; index += 1) {
      tst(enumFruits);
      tst(enumDummy);
    }
  });
});
