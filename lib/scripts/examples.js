/* eslint-disable no-param-reassign */
/* eslint-disable no-return-await */
/* eslint-disable no-console */
import { inspectIt } from './nodeOnly.js';
import { testEnumBits } from './bitFields.js';
import { isFileNameTrimmedEqual } from '../Pythagoras.js';
import { EnumBits } from '../Thales.js';
import { arrSequence } from '../Zeno.js';


/**
 * an example of an array of flags
 */
const fruitsArr = ['lemon', 'orange', 'watermelon', 'mandarin', 'banana', 'mango', 'strawberry'];

/**
 * helper to create dummy arrays for testing
 * @param {Number} n number of elements to create
 * @param {String} [prefix='flag_'] a prefix to use
 * @return {Array.<string>} an array of strings
 * @example const flagsArr5 = dummyArr(3) >> [flag_0',  'flag_1',  'flag_2']
 */
const dummyArr = (n, prefix = 'flag_') => [...Array(n).keys()].map((idx) => `${prefix}${idx}`);


const counterInc = (counter, key, inc = 1) => counter[key] = counter[key] + inc | inc;

const examples = async (command, parm1) => {
  const enum31 = (count) => {
    count = count || 1;
    // console.log({count})
    const flags = arrSequence(31, (i) => `flag_${i + 1}`);
    console.log({ flags });
    const enumBitsInst = new EnumBits(flags);
    const statsFlagsCount = {};
    console.time('enum31');
    for (let cnt = 1; cnt <= count; cnt += 1) {
      console.log({ cnt });
      const rt = testEnumBits(enumBitsInst);
      counterInc(statsFlagsCount, rt.flagsCount);
      // inspectIt({ rt }, console);
    }

    console.timeEnd('enum31');
    console.log({ statsFlagsCount });
    // inspectIt({ bucketQueries }, console);
    return true;
  };
  let rt;
  switch (command) {
  case 'enum31': return enum31(parm1);
  default: return true;
  }
};

/** if running as script {@link https://stackoverflow.com/questions/45136831/node-js-require-main-module} */
if (isFileNameTrimmedEqual(process.argv[1], import.meta.url)) {
  const arg0Arr = ['enum31'];
  if (process.argv.length < 3) { console.info(`need  one of ${arg0Arr} as parameter`); process.exit(0); }
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
  dummyArr,
};
