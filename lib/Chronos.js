/**
 * @module Chronos
 * @fileoverview
 * Date and Time related utilities
 * Named after {@link https://en.wikipedia.org/wiki/Chronos Chronos} the personification of time in pre-Socratic philosophy and later literature
 * @exportsFix dtDiffMs dtOffsetMinutes  dtOffsetHours, dtOffsetDays, dtToUtc, dtNowUtc, dtToStrCompressed, dtTObjUtc, dtTruncate, convertMS, DateRandom
 */

export const dtDiffMs = (dtStart, dtEnd) => dtEnd.getTime() - dtStart.getTime();
export const dtOffsetMinutes = (dt, minutes) => new Date(dt.getTime() + (minutes * 60000));
export const dtOffsetHours = (dt, offset) => { const rt = new Date(dt); rt.setHours(rt.getHours() + offset); return rt; };
export const dtOffsetDays = (dt, offset) => { const rt = new Date(dt); rt.setDate(rt.getDate() + offset); return rt; };
export const dtToUtc = (dt) => new Date(dt.getTime() + dt.getTimezoneOffset() * 60000);
export const dtNowUtc = () => dtToUtc(new Date());

/**
 * format date ro 'YYmmDDhhMMss'
 * @param {Date} dt the date
 * @return {string} compressed (no separators) representation of dt
 * @example dtToStrCompressed(new Date('2021-01-30T18:29:33')) >> '210130162933'
 */
export const dtToStrCompressed = (dt) => dt.toISOString().slice(2, 19).replace(/[-:T]/g, ''); // returned format YYmmDDhhMMss

export const dtTObjUtc = (dt) => ({ y: dt.getUTCFullYear(), m: dt.getUTCMonth(), d: dt.getUTCDate(), h: dt.getUTCHours(), M: dt.getUTCMinutes() });

/**
 * truncates Date time to precision
 * @param {Date} dt dateTime
 * @param {string} precision requested precision
 * @returns {Date} a new Date truncated ti precision
 */
export const dtTruncate = (dt, precision = 'd') => {
  switch (precision) {
  case 'Y': return new Date(dt.toISOString().substring(0, 4));
  case 'M': return new Date(dt.toISOString().substring(0, 7));
  case 'D': return new Date(dt.toISOString().substring(0, 10));
  case 'h': return new Date(`${dt.toISOString().substring(0, 14)}00`);
  case 'm': return new Date(`${dt.toISOString().substring(0, 17)}00`);
  default: return dt;
  }
};

/**
 * truncates Date time to precision
 * @param {Date} dt dateTime
 * @param {string} precision requested precision
 * @returns {Date} MUTATES!!! original dt
 */
export const dtSetPrecision = (dt, precision = 'm') => {
  const jumpTable = {
    h: () => dt.setHours(0, 0, 0, 0),
    M: () => dt.setMinutes(0, 0, 0),
    s: () => dt.setSeconds(0, 0),
    m: () => dt.setMilliseconds(0),
  };
  return jumpTable[precision](); // returns integer date is changed in place
};

/**
 * converts a milliseconds value to a readable format or an object
 * @param {number} ms value in milliseconds
 * @param {boolean} [asString=true] returns string if true else an object
 * @return {string | object}  ms in   or { d: 0, h: 0, m: 0, s: 0 } if
 * @example convertMS(100000000) >> '01:03:46:40'  convertMS(100000000, false) >>{ d: 1, h: 3, m: 46, s: 40 }
 */
export const convertMS = (ms, asString = true) => {
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
