/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */

/**
 * @module
 * @fileoverview
 * miscellaneous utilities
 * Named after Solon an ancient Creek statesman
 * {@link https://en.wikipedia.org/wiki/Solon}
 * @exports {jsonCycle, LevelCounter}
 */

/**
 * cycles value through JSON stringify => parse
 * useful for type conversions using replace reviver
 *@async
 * @param {object} value to cycle
 * @param {any} replace {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify}
 * @param {any} reviver {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse}
 * @return {object} the val after cycling
 */
import { EventEmitter } from 'events';

export const jsonCycle = async (value, replace, reviver) => JSON.parse(JSON.stringify(value, replace), reviver);

/**
 * a dirty sums counter
 * @param {Object} objCurrent a {key: number, ... } object
 * @param {Object | undefined} objSum {key: number, ... } object (or undefined on first time call)
 * @return {Object} sums
 * @example
 * sum = sumsCounter({foo: 0, bar:1}) -> { foo: 0, bar: 1 }
 * sum = sumsCounter({foo: 10, bar:1}, sum) -> { foo: 10, bar: 2 }
 * sum = sumsCounter({foo: 10, bar:1}, sum) -> { foo: 20, bar: 3 }
 */
export const sumsCounter = (objCurrent, objSum) => {
  if (!objSum) objSum = Object.fromEntries(Object.keys(objCurrent).map((k) => [k, 0]));
  Object.entries(objCurrent).forEach(([k, v]) => objSum[k] += v);
  return objSum;
};

export class LevelCounter {
  constructor(startCounter = 1) {
    this.store = {};
    this.startCounter = startCounter;
  }

  inc(level, val = 1) {
    this.store[level] = (this.store[level] === undefined) ? this.startCounter : this.store[level] += val;
    return this.store[level];
  }

  toStr(level, separator = '.', padTo = 0, padChr = '0') {
    let values = Object.values(this.store).splice(0, level + 1);
    if (padTo !== 0) { values = values.map((x) => x.toString().padStart(padTo, padChr)); }
    return values.splice(0, level + 1).join(separator);
  }
}

export const streamToString = (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
};

/**
 * am event Emitter with a standardized event output
 * listen to auto event 'newListener' if you want to keep track off listeners
 * { @link https://nodejs.org/api/events.html events }
 * @example
 * events = new Events()
 * client = events.register('clientName', ['event1']) > {event1: [Function (anonymous)]
 * client = events.register('client_name', ['event1']) > {event1: [Function (anonymous)]  // it overrides but since event output is standard it doesn't matter
 * client = events.register('client_name', ['event2', 'event3'])
 * server = events.register('server_name', ['event1'] )
 * events.groups() > 'client_name', 'server_name' ]
 * events.on('event1', (...args) => console.log( args))
 * client.event1('foo', 1,2,3) > [ 'client_name', 'event1', 'foo', 1, 2, 3 ]
 * server.event1('bar', 1,2,3) > [ 'server_name', 'event1', 'bar', 1, 2, 3 ]
 * events.eventsOf('client_name') > [ 'event2', 'event3' ] //
 * events.eventsOf() -> [ 'event2', 'event3', 'event1' ]  // all unique groups
 * events.onAll(undefined,(name, event, ...args) => console.log({ name, event, args }))
 * client.event2('foo') > { name: 'client_name', event: 'event2', args: [ 'foo' ] }
 *
}
 */
export class Events extends EventEmitter {
  constructor(name, eventNamesArr = []) {
    super();
    this._eventsObj = {};
    if (name && this.eventNamesArr) { this.register(name, eventNamesArr); }
  }

  /**
   *
   * @param {String} group a name
   * @param {Array<String>} [eventNamesArr=[]] an array of strings (event names)
   * @return {Object} f
   * @memberof Events
   */
  register(group, eventNamesArr = []) {
    this._eventsObj[group] = this._eventsObj[group] || {};
    eventNamesArr.forEach((eventName) => {
      this._eventsObj[group][eventName] = (args = {}) => this.emit(eventName, group, eventName, args); // mutates but doesn't matter since function is same
    });
    return this._eventsObj[group];
  }

  /**
   *
   * @return {Array} Array of group names
   * @memberof Events
   */
  groups() { return Object.keys(this._eventsObj); }

  /**
   * @param {String} group name
   * @return {Array}  Array of events belonging to group (if provided) or to to all groups (reduplicated)
   * @memberof Events
   */
  eventsOf(group) {
    const evOf = (name) => Object.keys(this._eventsObj[name] || {});
    return (group) ? evOf(group) : [...new Set(this.groups().map((n) => evOf(n)).flat())];    // to set coz can have duplicate events in different groups
  }

  /**
   * subscribes function fn to all events of a group or all groups if no group is provided
   * i.e. events.onAll((name, event, ...args) => console.log({ name, event, args }))
   * @param {Function} fn a function
   * @param {Array<String>} eventsArr name of a group or emptu
   * @returns {undefined}
   * @memberof Events
   */
  onEventsArr(fn, eventsArr) { eventsArr.forEach((eventName) => this.on(eventName, (group, event, args) => fn(group, event, args))); }

  /**
   * subscribes function fn to all events of a group or all groups if no group is provided
   * i.e. events.onAll((name, event, ...args) => console.log({ name, event, args }))
   * @param {Function} fn a function
   * @param {String|undefined} groupName name of a group or empty
   * @returns {undefined}
   * @memberof Events
   */
  onAll(fn, groupName) { this.onEventsArr(fn, this.eventsOf(groupName)); }
}

/**
 * just register events to handle
 * @param {Object} eventEmitter: any event emitting object
 * @param {Array} onArr: an array of events to log,
 * @param {Object} optional parameters
 * @returns {true} dummy
 */
 export const eventsHandle = (eventEmitter, onArr = [], { name = 'eventsHandle', logFun = ((x) => console.info(x)), verbose = 0} = {}) => {
  onArr.forEach((on) => {
    eventEmitter.on(on, (event) => {
      const logDetails = { eventFrom: name, on };
      if (verbose > 0) { logDetails.data = event; }
      logFun(logDetails);
    });
  });
  return true;
};
