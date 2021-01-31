/**
 * string utilities
 * Named after Homer author of the Iliad and the Odyssey ( https://en.wikipedia.org/wiki/Homer ) 
 *
 */

const strSizeAlignRight = (str, size, padChr = ' ') => str.padStart(size, padChr).slice(-size);
const strSizeAlignLeft = (str, size, padChr = ' ') => str.padEnd(size, padChr).slice(0, size);
const strSizeEclipse = (str, size, padChr = ' ', alignRight = false) => {
  const rt = (alignRight) ? strSizeAlignRight(str, size, padChr) : strSizeAlignLeft(str, size, padChr);
  if (rt.length >= str.length) { return rt; }
  return `${rt.slice(0, -1)}\u2026`;
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
 * // alternative {@link https://github.com/dmnd/dedent/blob/master/dedent.js}
 * @param {string} str a string replacing crlf and multiple spaces with single space
 * @returns {string} a trimmed string
 */
const trimMultiline = (str) => str.trim().replace(/\n/g, ' ').replace(/  +/g, ' ');

export {
  strSizeAlignRight,
  strSizeAlignLeft,
  strSizeEclipse,
  numFormat,
  trimMultiline,
};
