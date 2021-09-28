/* eslint-disable no-cond-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */

/**
 * @module Euclid
 * @fileoverview
 * Named after Euclid an ancient Creek mathematician {@link https://en.wikipedia.org/wiki/Euclid}
 *
 */

import { ErrAcropolisND } from './Hamartia.js';
import { arrFirstLast } from './Zeno.js';

/**
  * paging Object
  * @typedef {object} pageObj
  * @property {int=[-1,0,1]} position   - Where we stand (results Array relative to whole record set) 1=reached start -I reached start 0 somewhere in the middle
  * clients should check this to avoid subsequent requests although nothing forbids them to do so there are valid reasons they can do so
  * (for example polling the record set if they expect new data to arrive)
  * @property {any} next                - Pointer to next page
  * @property {any} prev                - Pointer to previous page
  * @property {integer} vector          - current vector (number of requested records signed by direction top to bottom if positive, bottom to top if negative)
  * @property {integer} pageSize        - current page length (results array size)
  * @property {integer} callCount       - how many times getPageObj has been called (to be used by clients for throttling etc)
  * @property {integer} ts              - UTC timestamp of operation (to be used by clients for throttling etc)
  * @example
     {
        next: { operator: 'GT', _id: '020' },
        prev: { operator: 'LT', _id: '011' },
        position: 0,
        position: 10,
        pageSize: 10,
        callCount: 2,
        ts: 1632854636718
      }
    }

  */

/** PageScroll a universal class for page scrolling
  * Reasoning:
  *    It is well known that the usual pagination mechanism based on skip/limit is inefficient/slow especially when dealing with large data sets
  *    Therefore the need for a more efficient/faster arises when dealing with a large dataset.
  *    Following class implements and encapsulates such a mechanism, which is quite flexible and can possibly accommodate many use cases,
  *    some of which are quite simple (like the scrollDown scrollUp methods) some others can be quite complicated but still useful
  * Terminology:
  *    "doc" When we refer to documents and related variables here we mean a complete document as returned by a mongo query/aggregation
  *    or for efficiency it can be a partial document that only contain the necessary fields used in funNext and funPrevious (^ see below)
  *
  *    last and first generally refer to first and last document/partial document returned by a previously run find/aggregation operation.
  *    There can exist sophisticated use cases where we could possibly want to substitute those with an arbitrary document for efficiency
  *    for example imagine we do an aggregation with a lookup stage it can scan say 1000 parent documents while last one produced a lookup result is
  *    is the 500th document, it will be a waste of resources to start next scan from position 500 of parent document which gave us last lookup match
  *    while we know there are no lookup matches for next 500 documents so we use the 1000th document as socLast in the follow up aggregation for
  *    next page.
  *
  */
class PageScroll {
  constructor(
    {
      fnNext = (row) => row,
      fnPrev = (row) => row,
      vectorDefault = 10,
    } = {},
  ) {
    this._props = { fnNext, fnPrev, vectorDefault };
  }

  /**
    *
    * @param {array} resultsArr array with data (can be empty [])
    * @param {pageObj=} pageObjLast pageObj from last call (can be empty {} on rowFirst call)
    * @param {integer=} vector (number of requested records signed by direction top to bottom if positive, bottom to top if negative)
    * if omitted will be derived from last call class vectorDefault
    * @param {*} overrideFirst conventionally first and last records are derived from results array still clients can override this
    * by providing a valid record in special cases for efficiency when they for some reason wish to jump some records
    * (for example if for some reason they know that query can't be fulfilled from next records in line)
    * @param {*} overrideLast (see above)
    * @returns {pageObj} a pageObj to be used and returned on next call
    */
  async getPageObj(resultsArr, pageObjLast = {}, vector = undefined, { overrideFirst, overrideLast } = {}) {
    vector = vector || pageObjLast.vector || this._props.vectorDefault || 1;  // vector can't be 0
    const direction = Math.sign(vector) || 1;
    const limit = Math.abs(vector);
    const pageSize = resultsArr.length;
    const callCount = pageObjLast.callCount + 1 || 1;
    const ts = Date.now();
    let [dataFirst, dataLast] = arrFirstLast(resultsArr);
    if (direction === -1) { [dataFirst, dataLast] = [dataLast, dataFirst]; }
    dataFirst = overrideFirst || dataFirst;                          // override if provided (special case see documentation)
    dataLast = overrideLast || dataLast;                             // override if provided (special case see documentation)
    if (pageSize >= limit) {
      return { next: this._props.fnNext(dataLast), prev: this._props.fnPrev(dataFirst), position: 0, vector, pageSize, callCount, ts };
    }
    if (pageSize === 0) {
      if (direction === 1) {
        return { next: pageObjLast.next, prev: pageObjLast.prev, position: 1, vector, pageSize, callCount, ts };
      }
      return { next: pageObjLast.next, prev: pageObjLast.prev, position: -1, vector, pageSize, callCount, ts };
    }
    if (pageSize < limit) {                                         // this statement should be the LAST in if chain
      if (direction === 1) {
        return { next: pageObjLast.next, prev: this._props.fnPrev(dataFirst), position: 1, vector, pageSize, callCount, ts };
      }
      return { next: this._props.fnNext(dataLast), prev: pageObjLast.prev, position: -1, vector, pageSize, callCount, ts };
    }
    throw new ErrAcropolisND(5001, JSON.stringify({ vector, direction, limit, pageSize }));  // should never get here;
  }
}

export { PageScroll };
