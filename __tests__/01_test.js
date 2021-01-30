/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
/**
 * @jest-environment node
 */
import { Chronos, Homer, Plato, Solon,  Pythagoras } from '../index.js';

describe('check class', () => {
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
  });
  it('Chronos', async () => {
    expect(Chronos.dtToStrCompressed(new Date('2021-01-30T18:29:33'))).toEqual('210130162933');
  });
});
