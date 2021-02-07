/* eslint-disable no-new */
/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
/**
 * @jest-environment node
 */

import { Chronos, Homer, Plato, Solon,  Pythagoras, Thales } from '../index.js'; // import all to check imports
import { testEnumBits } from '../lib/scripts.js';

const { EnumBits } = Thales;
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
  });
  it('Chronos', async () => {
    expect(Chronos.dtToStrCompressed(new Date('2021-01-30T18:29:33'))).toEqual('210130162933');
    expect(Chronos.convertMS(100000000)).toEqual('01:03:46:40');
  });
  it('Thales', async () => {
    let fruits = new EnumBits([...Array(27).keys()]);
    await Plato.timeIt(fruits.flagsFromIntArrScan(7), 'flagsFromIntArrScan', 100000, logger);
    await Plato.timeIt(fruits.flagsFromIntArrLookUp(7), 'flagsFromIntArrLookUp', 100000, logger);
    // console.log('xxxxxxxxxxxxxxxxxxxx', {result});
    fruits = new EnumBits(['lemon', 'orange', 'watermelon', 'mandarin', 'banana', 'mango', 'strawberry'])  // (['lemon', 'orange', 'watermelon']);
    // const fruits = ['orange', 'mandarin', 'lemon', 'bananas', 'mango', 'strawberry', 'watermelon'];
    // const fruitsEnum = new EnumBits(fruits);
    expect(fruits.flagsFromIntObj(6).orange).toEqual(true); // >> { lemon: true, orange: true, watermelon: false }
    expect(() => { new EnumBits(['lemon', 'lemon']); }).toThrow('EnumBits: flags must be unique but are not');
    expect(() => { new EnumBits([...Array(53).keys()]); }).toThrow();
    expect(() => { new EnumBits([...Array(31).keys()], { allow52bits: false }); }).toThrow();
    expect(() => { new EnumBits(Array.from({ length: 36 }, (_, i) => i + 1), { allow52bits: true }); }).not.toThrow();
    expect(() => {
      for (let cnt = 1; cnt <= 10; cnt += 1) { testEnumBits(fruits); }
    }).not.toThrow();
    expect(() => {
      fruits = new EnumBits([...Array(30).keys()]);
      for (let cnt = 1; cnt <= 10000; cnt += 1) { testEnumBits(fruits); }
    }).not.toThrow();
  });

  it('Pythagoras', async () => {
    expect(Pythagoras.isInRange(100, 99, 100)).toBe(true);
    expect(Pythagoras.isInRange(-1, 0, 10)).toBe(false);
  });
});
