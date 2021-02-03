/**
 * @fileoverview
 * Date and Time related utilities
 * Named after Chronos (Meaning time) which is is the personification of time in pre-Socratic philosophy https://en.wikipedia.org/wiki/Chronos
 *
 */

import { randomBetween } from './Pythagoras.js';

const dtDiffMs = (dtStart, dtEnd) => dtEnd.getTime() - dtStart.getTime();
const dtOffsetMinutes = (dt, minutes) => new Date(dt.getTime() + (minutes * 60000));
const dtOffsetHours = (dt, offset) => { const rt = new Date(dt); rt.setHours(rt.getHours() + offset); return rt; };
const dtOffsetDays = (dt, offset) => { const rt = new Date(dt); rt.setDate(rt.getDate() + offset); return rt; };
const dtToUtc = (dt) => new Date(dt.getTime() + dt.getTimezoneOffset() * 60000);
const dtNowUtc = () => dtToUtc(new Date());

/**
 * format date ro 'YYmmDDhhMMss'
 * @param {Date} dt the date
 * @return {string} compressed (no separators) representation of dt
 * @example dtToStrCompressed(new Date('2021-01-30T18:29:33')) >> '210130162933'
 */
const dtToStrCompressed = (dt) => dt.toISOString().slice(2, 19).replace(/[-:T]/g, ''); // returned format YYmmDDhhMMss

const dtTObjUtc = (dt) => ({ y: dt.getUTCFullYear(), m: dt.getUTCMonth(), d: dt.getUTCDate(), h: dt.getUTCHours(), M: dt.getUTCMinutes() });

/*
 *
 * @param {*} dt
 * @param {*} to
 */
const dtTruncate = (dt, to = 'd') => {
  switch (to) {
  case 'Y': return new Date(dt.toISOString().substring(0, 4));
  case 'M': return new Date(dt.toISOString().substring(0, 7));
  case 'D': return new Date(dt.toISOString().substring(0, 10));
  case 'h': return new Date(`${dt.toISOString().substring(0, 14)}00`);
  case 'm': return new Date(`${dt.toISOString().substring(0, 17)}00`);
  default: return dt;
  }
};
/**
 * converts a milliseconds value to a readable format or an object 
 * @param {Number} ms value in milliseconds
 * @param {boolean} [asString=true] returns string if true else an object
 * @return {string | object}  ms in   or { d: 0, h: 0, m: 0, s: 0 } if
 * @example convertMS(100000000) >> '01:03:46:40'  convertMS(100000000, false) >>{ d: 1, h: 3, m: 46, s: 40 }
 */
const convertMS = (ms, asString = true) => {
  const pad = (v, n = 2) => v.toString().padStart(n, '0');
  let s = Math.floor(ms / 1000);
  let m = Math.floor(s / 60);
  s %= 60;
  let h = Math.floor(m / 60);
  m %= 60;
  const d = Math.floor(h / 24);
  h %= 24;
  if (asString === true) { return `${pad(d)}:${pad(h)}:${pad(m)}:${pad(s)}`; }
  return { d, h, m, s };
};

class DateRandom {
  constructor(dtStart = new Date(0), dtEnd = new Date()) { // default start on epoch start
    this.dtStart = dtStart;
    this.dtEnd = dtEnd;
    this.tsjStart = dtStart.getTime(); // js time start = epoch ts * 1000
    this.tsjEnd = dtEnd.getTime();
  }

  randomEpoch() { return this.randomTs() / 1000; }

  randomTs() { return randomBetween(this.tsjStart, this.tsjEnd); }

  randomDt() { return new Date(this.randomTs()); }
}

export {
  dtDiffMs,
  dtOffsetMinutes,
  dtOffsetHours,
  dtOffsetDays,
  dtToUtc,
  dtNowUtc,
  dtToStrCompressed,
  dtTObjUtc,
  dtTruncate,
  convertMS,
  DateRandom,
};
