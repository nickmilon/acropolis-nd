/**
 * @module
 * @fileoverview
 * error handling utilities
 * Named after ancient Creek word for "to err" or "flaw" {@link https://en.wikipedia.org/wiki/Hamartia }
 * because “To make no mistakes is not in the power of man" (Plutarch  {@link https://en.wikipedia.org/wiki/Plutarch} )
 */

/**
 * @class ErrAcropolis
 * @param {Number} code number to be extracted from errorDict
 * @param {string} [extraMsg=''] any extra string to be amended to message
 * @extends {Error}
 * @note just replace static errorDict() in subclass when inherit
 */
class ErrAcropolis extends Error {
  constructor(code, extraMsg = '') {
    super();
    this.message = this.constructor.errorMsg(code, extraMsg);
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
    this.code = code;
  }

  static errorDict() { // replace errorDict() in subclass
    return {
      1000: 'Dummy_Error',
    };
  }

  static errorMsg(code, extraMsg) {
    return `${this.errorDict()[code]} ${extraMsg}`;
  }
}

/**
 * this class is for use in this library only do not subclass it use @see ErrAcropolis instead
 * @private
 * @class ErrAcropolisND
 * @extends {ErrAcropolis}
 */
class ErrAcropolisND extends ErrAcropolis {
  constructor(code, extraMsg = '') {
    super(code, extraMsg);
  }

  static errorDict() {
    return {
      1001: 'EnumBits: flags array length must be > 0 (empty array is meaningless)',
      1003: 'EnumBits: flags must be unique',
    };
  }
}

export { ErrAcropolis, ErrAcropolisND };
