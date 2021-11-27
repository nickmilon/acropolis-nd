/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
/**
 * @jest-environment node
 */

// eslint-disable-next-line import/no-unresolved
import { setTimeout } from 'timers/promises';
import { randomBetween } from '../lib/Pythagoras.js';
import { inspectIt } from '../lib/scripts/nodeOnly.js';
import { arrIdentical } from '../lib/Zeno.js';

import { PageScroll } from '../lib/Euclid.js';

const logger = (__inspect__ === true) ? console : null;

describe('check pagination', () => {
  const testArr = [
    { _id: '001', pg03: '001', pg04: '001', pg10: '001', rnd1: '019', rnd2: '006', v: 1 },
    { _id: '002', pg03: '001', pg04: '001', pg10: '001', rnd1: '012', rnd2: '003', v: 1 },
    { _id: '003', pg03: '001', pg04: '001', pg10: '001', rnd1: '018', rnd2: '002', v: 1 },
    { _id: '004', pg03: '002', pg04: '001', pg10: '001', rnd1: '019', rnd2: '007', v: 1 },
    { _id: '005', pg03: '002', pg04: '002', pg10: '001', rnd1: '006', rnd2: '008', v: 1 },
    { _id: '006', pg03: '002', pg04: '002', pg10: '001', rnd1: '005', rnd2: '007', v: 1 },
    { _id: '007', pg03: '003', pg04: '002', pg10: '001', rnd1: '017', rnd2: '008', v: 1 },
    { _id: '008', pg03: '003', pg04: '002', pg10: '001', rnd1: '016', rnd2: '009', v: 1 },
    { _id: '009', pg03: '003', pg04: '003', pg10: '001', rnd1: '003', rnd2: '001', v: 1 },
    { _id: '010', pg03: '004', pg04: '003', pg10: '001', rnd1: '009', rnd2: '006', v: 1 },
    { _id: '011', pg03: '004', pg04: '003', pg10: '002', rnd1: '017', rnd2: '009', v: 1 },
    { _id: '012', pg03: '004', pg04: '003', pg10: '002', rnd1: '009', rnd2: '007', v: 1 },
    { _id: '013', pg03: '005', pg04: '004', pg10: '002', rnd1: '017', rnd2: '001', v: 1 },
    { _id: '014', pg03: '005', pg04: '004', pg10: '002', rnd1: '011', rnd2: '001', v: 1 },
    { _id: '015', pg03: '005', pg04: '004', pg10: '002', rnd1: '002', rnd2: '006', v: 1 },
    { _id: '016', pg03: '006', pg04: '004', pg10: '002', rnd1: '018', rnd2: '003', v: 1 },
    { _id: '017', pg03: '006', pg04: '005', pg10: '002', rnd1: '001', rnd2: '005', v: 1 },
    { _id: '018', pg03: '006', pg04: '005', pg10: '002', rnd1: '004', rnd2: '006', v: 1 },
    { _id: '019', pg03: '007', pg04: '005', pg10: '002', rnd1: '018', rnd2: '008', v: 1 },
    { _id: '020', pg03: '007', pg04: '005', pg10: '002', rnd1: '003', rnd2: '003', v: 1 }
  ];

  const arrQuery = (arr, query, pageLen, direction = 1) => {
    let arrayWork = arr.slice(); // don't mutate
    if (direction === -1) { arrayWork.reverse(); }
    if (Object.keys(query).length > 0) {
      arrayWork = arrayWork.filter((el) => ((query.operator === 'GT') ? el._id > query._id : el._id < query._id));
    }
    // inspectIt({ query, pageLen, direction, arrayWork }, logger, 'xx', { breakLength: 140 });
    return arrayWork.slice(0, pageLen);
  };

  const pagesScroll = async (arr, vector) => {
    //  pageLen, direction
    const direction = Math.sign(vector);
    const pageLen = Math.abs(vector);
    let query = {};
    let pg = {};
    const pgRnd = new PageScroll({ fnNext: (doc) => ({ operator: 'GT', _id: doc._id }), fnPrev: (doc) => ({ operator: 'LT', _id: doc._id }) });

    let page = 0;
    const idsArr = arr.map((x) => x._id);
    if (direction === -1) { idsArr.reverse(); }
    const idsArrPg = [];
    inspectIt('', logger, `pagesScroll => pageLen:${pageLen}| direction:${direction}`, { breakLength: 140 });
    do {
      page += 1;
      const resultsArr = arrQuery(arr, query, pageLen, direction);
      // pg = await pgRnd.getPageObj(resultsArr, pg, { direction, limit: pageLen });
      pg = await pgRnd.getPageObj(resultsArr, pg, vector);
      resultsArr.forEach((x) => idsArrPg.push(x._id));
      query = (direction === 1) ? pg.next : pg.prev;
      inspectIt({ resultsArr, pg }, logger, `page:${page}`, { breakLength: 140 });
    } while (pg.position === 0);
    // inspectIt({ prg: idsArrPg, org: idsArr }, logger, `page:${page}`, { breakLength: 140 });
    if (!arrIdentical(idsArr, idsArrPg)) { throw new Error('idsArr not identical to idsArrPg'); }
    return true;
  };

  beforeAll(async () => {
  });

  afterAll(async () => {
    await setTimeout(500); // give it some time for printouts if any
  });

  it('pagination', async () => {
    const countDocs = testArr.length;
    await pagesScroll(testArr, -3);
    const pagesArr = [randomBetween(1, countDocs), randomBetween(1, countDocs - 1), countDocs + 1, 1, 3, 5, 10];
    for (let index = 0; index < pagesArr.length; index += 1) {
      await pagesScroll(testArr, pagesArr[index] * -1);
      await pagesScroll(testArr, pagesArr[index] * 1);
    }
  });
});
