/* eslint-disable no-bitwise */
/* eslint-disable no-new */
/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
/**
 * @jest-environment node
 */

import { Chronos, Homer, Plato, Solon,  Pythagoras } from '../index.js'; // import all to check imports
import { timeIt } from '../lib/scripts/nodeOnly.js';

// const { EnumBits } = Thales;

const logger = (__inspect__ === true) ? console : Plato.DummyLogger;
// eslint-disable-next-line no-console
console.info('*** set __inspect__ variable in package.json to true || false to view/hide test details ***');

describe('check Acropolis-nd', () => {
  beforeAll(async () => {

  });

  afterAll(async () => {

  });

  it('Pythagoras', async () => {
    expect(Pythagoras.randomBetween(1, 10)).toBeGreaterThan(0);
    expect(Pythagoras.randomBetween(1, 10)).toBeLessThan(11);
    expect(await Pythagoras.ngrams('NickTheGreek', 3, true)).toEqual(expect.arrayContaining(['Nick'])); // some events
    expect(Pythagoras.percent(1, 200)).toEqual(0.5);
    expect(Pythagoras.isNumber('fff')).toEqual(false);
    expect(Pythagoras.isNumber(0.1821)).toEqual(true);
    expect(Pythagoras.isInRange(-1, -10, 100)).toBe(true);
    expect(Pythagoras.inRangeOrDefault(2, 0, 1, 3)).toEqual(2);
    expect(Pythagoras.inRangeOrDefault('b', 'default', 'a', 'c')).toEqual('b');
    expect(Pythagoras.inRangeOrDefault('b', 'default', 'c', 'd')).toEqual('default');
    expect(Pythagoras.intOrDefault(-1, 50, -10, 100)).toEqual(-1);
    expect(Pythagoras.intOrDefault(-1, 50, 1, 100)).toEqual(50);
    expect(Pythagoras.intOrDefault('-1', 50, -10, 100)).toEqual(-1);
    expect(Pythagoras.isInRange(100, 99, 100)).toBe(true);
    expect(Pythagoras.isInRange(-1, 0, 10)).toBe(false);
  });
  it('Chronos', async () => {
    expect(Chronos.dtToStrCompressed(new Date('2021-01-30T18:29:33'))).toEqual('210130162933');
    expect(Chronos.convertMS(100000000)).toEqual('01:03:46:40');
  });
  it('Euclid utilsBit32', async () => {
    return 'fix';
    let value;
    expect(utilsBit32.max(1, 100)).toEqual(100);
    expect(utilsBit32.min(1, 2 ** 32)).toEqual(1);
    expect(utilsBit32.EQ(1, 100)).toEqual(0);
    expect(utilsBit32.EQ(1, 1)).toEqual(1);
    expect(utilsBit32.LT(1, 100)).toEqual(1);
    expect(utilsBit32.LE(100, 100)).toEqual(1);
    expect(utilsBit32.GT(0, 1)).toEqual(0);
    expect(utilsBit32.GE(1, 1)).toEqual(1);
    expect(utilsBit32.GE(0, 1)).toEqual(0);
    expect(utilsBit32.isPwrOf2((2 ** 30))).toBe(true);
    expect(utilsBit32.isPwrOf2((2 ** 30) + 1)).toBe(false);
    expect(utilsBit32.lsb1Value(2 ** 30)).toEqual(2 ** 30);
    expect(utilsBit32.lsb1Value(5)).toEqual(1);
    expect(utilsBit32.msb0(1)).toEqual(2);

    value = 1;
    value = utilsBit32.setBit1(value, 1);
    expect(value).toEqual(3);
    expect(utilsBit32.checkBit(value, 0)).toEqual(1);
    expect(utilsBit32.checkBitBool(value, 1)).toBe(true);
    value = utilsBit32.setBit0(value, 1);
    expect(utilsBit32.checkBit(value, 1)).toEqual(0);
    expect(utilsBit32.checkBitBool(value, 1)).toBe(false);
    expect(utilsBit32.countBits1(2 ** 10)).toEqual(1); // because it is power of 2
    expect(utilsBit32.countBits1((2 ** 32) - 1)).toEqual(32); // max integer all bits must be set
    value = (2 ** 32) - 1;
    for (let index = 0; index <= 31; index += 1) {
      expect(utilsBit32.checkBit(value, index)).toEqual(1);
    }
  });

  it('Euclid utilsBitBI (bigInt)', async () => {
    return 'fix'
    let value;
    expect(utilsBitBI.max(1n, 2n ** 200n)).toEqual(2n ** 200n);
    expect(utilsBitBI.min(1n, 2n ** 32n)).toEqual(1n);
    expect(utilsBitBI.EQ(1n, 100n)).toEqual(0n);
    expect(utilsBitBI.EQ(1n, 1n)).toEqual(1n);
    expect(utilsBitBI.LT(1n, 100n)).toEqual(1n);
    expect(utilsBitBI.LE(1n, 100n)).toEqual(1n);
    expect(utilsBitBI.GT(0n, 1n)).toEqual(0n);
    expect(utilsBitBI.GE(0n, 1n)).toEqual(0n);
    expect(utilsBitBI.GE(1n, 1n)).toEqual(1n);
    expect(utilsBitBI.isPwrOf2((2n ** 30n))).toBe(true);
    expect(utilsBitBI.isPwrOf2((2n ** 30n) + 1n)).toBe(false);
    expect(utilsBitBI.lsb1Value(2n ** 30n)).toEqual(2n ** 30n);
    expect(utilsBitBI.lsb1Value(5n)).toEqual(1n);
    expect(utilsBitBI.msb0(1n)).toEqual(2n);
    value = 1n;
    value = utilsBitBI.setBit1(value, 1n);
    expect(value).toEqual(3n);

    expect(utilsBitBI.checkBit(value, 1n)).toEqual(1n);

    expect(utilsBitBI.checkBitBool(value, 1n)).toBe(true);
    value = utilsBitBI.setBit0(value, 1n);
    expect(utilsBitBI.checkBit(value, 1n)).toEqual(0n);
    expect(utilsBitBI.checkBitBool(value, 1n)).toBe(false);
    expect(utilsBitBI.countBits1(2n ** 10n)).toEqual(1n); // because it is power of 2
    expect(utilsBitBI.countBits1((2n ** 32n) - 1n)).toEqual(32n); // max integer all bits must be set
    value = (2n ** 32n) - 1n;
    for (let index = 0n; index <= 31n; index += 1n) {
      expect(utilsBitBI.checkBit(value, index)).toEqual(1n);
    }
    for (let cnt = 0; cnt <= 100; cnt += 1) {
      value = BigInt(Pythagoras.randomBetween(0, 10000));
      const valueStrArr = value.toString(2).split('').reverse().map((x) => x | 0); // reverse to bring lsb left, map | 0 to parse int
      const valueStrArrBitCountAll = valueStrArr.length;
      const checkBitN = BigInt(Pythagoras.randomBetween(0, valueStrArrBitCountAll - 1)); // random bit to check
      const valueStr2Bits1 = BigInt(valueStrArr.filter((x) => x === 1).length);
      expect(utilsBitBI.countBits1(value)).toEqual(valueStr2Bits1);
      const bitVal = BigInt(valueStrArr[checkBitN]);
      // console.log({checkBitN, bitVal, value, valueStrArr });
      expect(utilsBitBI.checkBit(value, checkBitN)).toEqual(bitVal);
    }
  });

  /*
  it('Thales', async () => {
    let fruits = new EnumBits([...Array(27).keys()]);
    await timeIt(fruits.flagsFromIntArrScan(7), 'flagsFromIntArrScan', 100000, logger);
    await timeIt(fruits.flagsFromIntArrLookUp(7), 'flagsFromIntArrLookUp', 100000, logger);
    // console.log('xxxxxxxxxxxxxxxxxxxx', {result});
    fruits = new EnumBits(['lemon', 'orange', 'watermelon', 'mandarin', 'banana', 'mango', 'strawberry'])  // (['lemon', 'orange', 'watermelon']);
    // const fruits = ['orange', 'mandarin', 'lemon', 'bananas', 'mango', 'strawberry', 'watermelon'];
    // const fruitsEnum = new EnumBits(fruits);
    expect(fruits.flagsFromIntObj(6).orange).toEqual(true); // >> { lemon: true, orange: true, watermelon: false }
    expect(() => { new EnumBits(['lemon', 'lemon']); }).toThrow('EnumBits: flags must be unique but are not');
    expect(() => { new EnumBits([...Array(53).keys()]); }).toThrow();
    expect(() => { new EnumBits([...Array(32).keys()], { allow52bits: false }); }).toThrow();
    expect(() => { new EnumBits(Array.from({ length: 36 }, (_, i) => i + 1), { allow52bits: true }); }).not.toThrow();
    expect(() => {
      for (let cnt = 1; cnt <= 10; cnt += 1) { testEnumBits(fruits); }
    }).not.toThrow();
    expect(() => {
      fruits = new EnumBits([...Array(31).keys()]);
      for (let cnt = 1; cnt <= 10000; cnt += 1) { testEnumBits(fruits); }
    }).not.toThrow();
  });
  */
});
