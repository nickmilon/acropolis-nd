/* eslint-disable no-bitwise */
/* eslint-disable no-new */
/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
/**
* @jest-environment node
*/

import { runOptions } from '../config.js';
import { setTimeout as setTimeoutAsync } from 'timers/promises';
import { Chronos, Homer, Plato, Solon,  Pythagoras } from '../index.js'; // import all to check imports
import { timeIt, ConLog, consolDummy } from '../lib/scripts/nodeOnly.js';

// const { EnumBits } = Thales;

const logLevel = runOptions?.tests?.logLevel || 'log';

const logger = (logLevel === 'silent') ? consolDummy : new ConLog('debug', { inclTS: true });

// eslint-disable-next-line no-console
console.log(`set logLevel variable in config.js in one of available Levels: ${ConLog.availableLevelsStr()}`);

describe('check Acropolis-nd', () => {
  beforeAll(async () => {

  });

  afterAll(async () => {
    await setTimeoutAsync(100);
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

  it('ConLogDemoOnly', async () => {
    const foo = {
      foo: ['xxxxxxxxxxxxxxxxxxxxxxxxxxx', ['yyyyyyyyyyyyyyyy', 'zzzzzzzzzzzzzzzzzzz', 'wwwwwwwwwwww']],
      bar: 11,
    };
    const conLog = new ConLog('debug');
    conLog.dir(foo, { showHidden: false, depth: 200 }, 'info');
    conLog.inspectIt(foo, 'object foo', { showHidden: false, depth: 200 }, 'info');
    conLog.log('data1', 'data2', '='.repeat(100));
    conLog.time('foo', 'info');
    conLog.timeEnd('foo', 'info');
  });
});
