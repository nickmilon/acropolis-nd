/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-await */
/* eslint-disable no-console */

/**
 * @module
 * @fileoverview
 * some usage examples you can call from shell
 */

import { isFileNameTrimmedEqual } from '../Pythagoras.js';
import { EnumBits, flagsDoc } from '../Thales.js';
import { arrDummyStr } from '../Zeno.js';

const fruitsArr = ['orange', 'mandarin', 'lemon', 'banana', 'mango', 'strawberry', 'watermelon']

const examples = async (command, parm1) => {
  const enum31 = (num) => {
    const fruitsEnum = new EnumBits(fruitsArr);
    if (num < 0 || num > fruitsEnum.maxNum) { throw new Error(`number must be between 0 ${fruitsEnum.maxNum}`); }
    console.info({ fruitsArr });
    console.info(flagsDoc(fruitsEnum, num));
    return true;
  };
  const enumBI = (num) => {
    const arrDummy = arrDummyStr(40);
    const biEnum = new EnumBits(arrDummy);
    if (num < 0n || num > biEnum.maxNum) { throw new Error(`number must be between 0n ${biEnum.maxNum}`); }
    console.info({ arrDummy });
    console.info(flagsDoc(biEnum, num));
    return true;
  };
  switch (command) {
  case 'enum31': return enum31(parm1 | 0);
  case 'enumBI': return enumBI(BigInt(parm1) | 0n);
  default: return true;
  }
};

/** if running as script {@link https://stackoverflow.com/questions/45136831/node-js-require-main-module} */
if (isFileNameTrimmedEqual(process.argv[1], import.meta.url)) {
  const arg0Arr = ['enum31', 'enumBI'];
  if (process.argv.length < 3) { console.info(`need  one of ${arg0Arr} and as parameter`); process.exit(0); }
  const args = process.argv.slice(2);
  examples(args[0], args[1])
    .then((val) => {
      console.log('done', val);
      process.exit(0);
    }).catch((error) => console.log(error));
}

export {
  examples,
  fruitsArr,
};
