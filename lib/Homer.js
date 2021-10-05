/* eslint-disable no-bitwise */
/* eslint-disable no-return-assign */

/**
 * @module
 * @fileoverview
 * some string utilities
 * Named after Homer author of the Iliad and the Odyssey {@link https://en.wikipedia.org/wiki/Homer }
 * @exports *
 */

/**
 * Pads str with padChr to size and Right Aligns it
 * @param {String} str  to align
 * @param {number} size size to
 * @param {String} [padChr=' '] character to pad
 * @return {String}  sized String
 */
const strSizeAlignRight = (str, size, padChr = ' ') => str.padStart(size, padChr).slice(-size);

/**
 * Pads str with padChr to size and Left Aligns it
 * @param {String} str  to align
 * @param {number} size size to
 * @param {String} [padChr=' '] character to pad
 * @return {String}  sized String
 */
const strSizeAlignLeft = (str, size, padChr = ' ') => str.padEnd(size, padChr).slice(0, size);

/**
 * Pads str with padChr to size and Right Aligns it
 * @param {String} str  to align
 * @param {number} size size to
 * @param {String} [padChr=' '] character to pad
 * @param {Boolean} [alignRight=false] aligns string to the right if true to left if false (default)
 * @return {String}  sized String
 */
const strSizeEclipse = (str, size, padChr = ' ', alignRight = false) => {
  const rt = (alignRight) ? strSizeAlignRight(str, size, padChr) : strSizeAlignLeft(str, size, padChr);
  return (rt.length >= str.length) ? rt : `${rt.slice(0, -1)}\u2026`;
};

/**
 * colorizes a string
 * @param {String} str  to align
 * @param {String} [color='FgRed'] character to pad
 * @return {String}  a colorized String
 */
const strColorize = (str, color = 'FgRed') => {
  const colorsDict = {
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink: '\x1b[5m',
    Reverse: '\x1b[7m',
    Hidden: '\x1b[8m',
    // foreground colors
    FgBlack: '\x1b[30m',
    FgRed: '\x1b[31m',
    FgGreen: '\x1b[32m',
    FgYellow: '\x1b[33m',
    FgBlue: '\x1b[34m',
    FgMagenta: '\x1b[35m',
    FgCyan: '\x1b[36m',
    FgWhite: '\x1b[37m',
    // background colors
    BgBlack: '\x1b[40m',
    BgRed: '\x1b[41m',
    BgGreen: '\x1b[42m',
    BgYellow: '\x1b[43m',
    BgBlue: '\x1b[44m',
    BgMagenta: '\x1b[45m',
    BgCyan: '\x1b[46m',
    BgWhite: '\x1b[47m',
  };
  return `${colorsDict[color]}${str}\x1b[0m`;
};

/**
 * convert nested array to strings and pads it to maximum column width + margind 
 * @param {Array} arr a 2 level nested Array
 * @param {number} [margin=0] margin to the right
 * @return {Array} with columns padded to max column width
 */
const arr2StrPad = (arr, margin = 0) => {
  const maxLen = {};
  const toStr = (el) => ((Array.isArray(el)) ? `[${el}]` : `${el}`);
  const rowStr = (row) => row.map((v, idx) => (toStr(v)).padEnd(maxLen[idx] + margin));
  arr.forEach((row) => row.forEach((col, idx) => maxLen[idx] = Math.max(toStr(col).length, maxLen[idx] | 0)));
  return arr.map((row) => rowStr(row));
};

/**
 * converts a nested array to MarkDown Table
 * @param {Array} arr2 nested array
 * @param {*} headerArr headers array (same number of elements as arr2 elements)
 * @param {number} [margin=0] margin to the right
 * @return {String}  MarkDown table
 */
const arrToTableMD = (arr2, headerArr, margin = 0) => {
  const dashes = Array(arr2[0].length).fill('-');
  let arrMD = arr2StrPad([headerArr, dashes, ...arr2], margin);
  arrMD[1] = arrMD[1].map((s) => s.replace(/\s/g, '-'));
  arrMD = arrMD.map((row) => `|${row.join('|')}|`);
  return arrMD.join('\n');
};

const numFormat = (vl, digInt = 6, digDec = 2) => {
  // like Intl.NumberFormat
  const vlStr = `${vl}`; // so we stringify objects that lack a toString method
  // eslint-disable-next-line prefer-const
  let [int, dec] = vlStr.split('.');
  int = strSizeAlignRight(int.replace(/\B(?=(\d{3})+(?!\d))/g, ','), digInt, ' ');
  if (digDec === 0) { return int; }
  if (dec === undefined) { return `${int} ${strSizeAlignLeft(' ', digDec)}`; }
  return `${int}.${strSizeAlignLeft(dec, digDec)}`;
};

/**
 * trims string
 * for an alternative see {@link https://github.com/dmnd/dedent/blob/master/dedent.js}
 * @param {string} str a string replacing crlf and multiple spaces with single space
 * @returns {string} a trimmed string
 */
const trimMultiline = (str) => str.trim().replace(/\n/g, ' ').replace(/  +/g, ' ');

export {
  strSizeAlignRight,
  strSizeAlignLeft,
  strSizeEclipse,
  strColorize,
  arr2StrPad,
  arrToTableMD,
  numFormat,
  trimMultiline,
};
