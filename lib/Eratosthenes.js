/**
 * @module Eratosthenes
 * @fileoverview
 * Named after {@link hhttps://en.wikipedia.org/wiki/Eratosthenes Eratosthenes } an ancient Creek polymath who first calculated the circumference of the Earth
 * @exportsFix {}
 */

import { randomBetween, DateRandom } from './Pythagoras.js';

/**
 * creates a pseudo random object (mainly for testing)
 * @param {Integer} [rndMn=1]
 * @param {Integer} [rndMax=100000]
 * @param {Date} [dateStart=new Date(Date.UTC(2000, 0, 1))]
 * @param {Date} [dateEnd=new Date(Date.UTC(2020, 11, 31))]
 * @return {Object} a pseudo random one dimension object
 * @example
 * objRnd1d() -->
 * {
  intFn: 225216,
  dt: 2011-09-17T04:28:22.556Z,
  int1: 75072,
  int2: 72791,
  dtCr: 2001-05-17T06:38:30.003Z,
  ts: 1316233702556,
  str: 'fymhb'
}
 */

const objRndFlat = (rndMn = 1, rndMax = 100000, dateStart = new Date(Date.UTC(2000, 0, 1)), dateEnd = new Date(Date.UTC(2020, 11, 31))) => {
  const dtRnd = new DateRandom(dateStart, dateEnd);
  const rnd = {
    int1: randomBetween(rndMn, rndMax),
    int2: randomBetween(rndMn, rndMax),
    dtCr: dtRnd.randomDt(),
    ts: dtRnd.randomTs(),
    str: Math.random().toString(36).substr(2, 5),
  };
  return { intFn: rnd.int1 * Math.trunc(Math.random() * 10, 0), dt: new Date(rnd.ts), ...rnd };
};

export { objRndFlat };
