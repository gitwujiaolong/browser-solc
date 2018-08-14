(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
        }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];return o(n || r);
        }, p, p.exports, r, e, n, t);
      }return n[i].exports;
    }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);return o;
  }return r;
})()({ 1: [function (require, module, exports) {
    (function (global) {
      'use strict';

      // compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
      // original notice:

      /*!
       * The buffer module from node.js, for the browser.
       *
       * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
       * @license  MIT
       */

      function compare(a, b) {
        if (a === b) {
          return 0;
        }

        var x = a.length;
        var y = b.length;

        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }

        if (x < y) {
          return -1;
        }
        if (y < x) {
          return 1;
        }
        return 0;
      }
      function isBuffer(b) {
        if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
          return global.Buffer.isBuffer(b);
        }
        return !!(b != null && b._isBuffer);
      }

      // based on node assert, original notice:

      // http://wiki.commonjs.org/wiki/Unit_Testing/1.0
      //
      // THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
      //
      // Originally from narwhal.js (http://narwhaljs.org)
      // Copyright (c) 2009 Thomas Robinson <280north.com>
      //
      // Permission is hereby granted, free of charge, to any person obtaining a copy
      // of this software and associated documentation files (the 'Software'), to
      // deal in the Software without restriction, including without limitation the
      // rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
      // sell copies of the Software, and to permit persons to whom the Software is
      // furnished to do so, subject to the following conditions:
      //
      // The above copyright notice and this permission notice shall be included in
      // all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      // AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
      // ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
      // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

      var util = require('util/');
      var hasOwn = Object.prototype.hasOwnProperty;
      var pSlice = Array.prototype.slice;
      var functionsHaveNames = function () {
        return function foo() {}.name === 'foo';
      }();
      function pToString(obj) {
        return Object.prototype.toString.call(obj);
      }
      function isView(arrbuf) {
        if (isBuffer(arrbuf)) {
          return false;
        }
        if (typeof global.ArrayBuffer !== 'function') {
          return false;
        }
        if (typeof ArrayBuffer.isView === 'function') {
          return ArrayBuffer.isView(arrbuf);
        }
        if (!arrbuf) {
          return false;
        }
        if (arrbuf instanceof DataView) {
          return true;
        }
        if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
          return true;
        }
        return false;
      }
      // 1. The assert module provides functions that throw
      // AssertionError's when particular conditions are not met. The
      // assert module must conform to the following interface.

      var assert = module.exports = ok;

      // 2. The AssertionError is defined in assert.
      // new assert.AssertionError({ message: message,
      //                             actual: actual,
      //                             expected: expected })

      var regex = /\s*function\s+([^\(\s]*)\s*/;
      // based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
      function getName(func) {
        if (!util.isFunction(func)) {
          return;
        }
        if (functionsHaveNames) {
          return func.name;
        }
        var str = func.toString();
        var match = str.match(regex);
        return match && match[1];
      }
      assert.AssertionError = function AssertionError(options) {
        this.name = 'AssertionError';
        this.actual = options.actual;
        this.expected = options.expected;
        this.operator = options.operator;
        if (options.message) {
          this.message = options.message;
          this.generatedMessage = false;
        } else {
          this.message = getMessage(this);
          this.generatedMessage = true;
        }
        var stackStartFunction = options.stackStartFunction || fail;
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, stackStartFunction);
        } else {
          // non v8 browsers so we can have a stacktrace
          var err = new Error();
          if (err.stack) {
            var out = err.stack;

            // try to strip useless frames
            var fn_name = getName(stackStartFunction);
            var idx = out.indexOf('\n' + fn_name);
            if (idx >= 0) {
              // once we have located the function frame
              // we need to strip out everything before it (and its line)
              var next_line = out.indexOf('\n', idx + 1);
              out = out.substring(next_line + 1);
            }

            this.stack = out;
          }
        }
      };

      // assert.AssertionError instanceof Error
      util.inherits(assert.AssertionError, Error);

      function truncate(s, n) {
        if (typeof s === 'string') {
          return s.length < n ? s : s.slice(0, n);
        } else {
          return s;
        }
      }
      function inspect(something) {
        if (functionsHaveNames || !util.isFunction(something)) {
          return util.inspect(something);
        }
        var rawname = getName(something);
        var name = rawname ? ': ' + rawname : '';
        return '[Function' + name + ']';
      }
      function getMessage(self) {
        return truncate(inspect(self.actual), 128) + ' ' + self.operator + ' ' + truncate(inspect(self.expected), 128);
      }

      // At present only the three keys mentioned above are used and
      // understood by the spec. Implementations or sub modules can pass
      // other keys to the AssertionError's constructor - they will be
      // ignored.

      // 3. All of the following functions must throw an AssertionError
      // when a corresponding condition is not met, with a message that
      // may be undefined if not provided.  All assertion methods provide
      // both the actual and expected values to the assertion error for
      // display purposes.

      function fail(actual, expected, message, operator, stackStartFunction) {
        throw new assert.AssertionError({
          message: message,
          actual: actual,
          expected: expected,
          operator: operator,
          stackStartFunction: stackStartFunction
        });
      }

      // EXTENSION! allows for well behaved errors defined elsewhere.
      assert.fail = fail;

      // 4. Pure assertion tests whether a value is truthy, as determined
      // by !!guard.
      // assert.ok(guard, message_opt);
      // This statement is equivalent to assert.equal(true, !!guard,
      // message_opt);. To test strictly for the value true, use
      // assert.strictEqual(true, guard, message_opt);.

      function ok(value, message) {
        if (!value) fail(value, true, message, '==', assert.ok);
      }
      assert.ok = ok;

      // 5. The equality assertion tests shallow, coercive equality with
      // ==.
      // assert.equal(actual, expected, message_opt);

      assert.equal = function equal(actual, expected, message) {
        if (actual != expected) fail(actual, expected, message, '==', assert.equal);
      };

      // 6. The non-equality assertion tests for whether two objects are not equal
      // with != assert.notEqual(actual, expected, message_opt);

      assert.notEqual = function notEqual(actual, expected, message) {
        if (actual == expected) {
          fail(actual, expected, message, '!=', assert.notEqual);
        }
      };

      // 7. The equivalence assertion tests a deep equality relation.
      // assert.deepEqual(actual, expected, message_opt);

      assert.deepEqual = function deepEqual(actual, expected, message) {
        if (!_deepEqual(actual, expected, false)) {
          fail(actual, expected, message, 'deepEqual', assert.deepEqual);
        }
      };

      assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
        if (!_deepEqual(actual, expected, true)) {
          fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
        }
      };

      function _deepEqual(actual, expected, strict, memos) {
        // 7.1. All identical values are equivalent, as determined by ===.
        if (actual === expected) {
          return true;
        } else if (isBuffer(actual) && isBuffer(expected)) {
          return compare(actual, expected) === 0;

          // 7.2. If the expected value is a Date object, the actual value is
          // equivalent if it is also a Date object that refers to the same time.
        } else if (util.isDate(actual) && util.isDate(expected)) {
          return actual.getTime() === expected.getTime();

          // 7.3 If the expected value is a RegExp object, the actual value is
          // equivalent if it is also a RegExp object with the same source and
          // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
        } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
          return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase;

          // 7.4. Other pairs that do not both pass typeof value == 'object',
          // equivalence is determined by ==.
        } else if ((actual === null || typeof actual !== 'object') && (expected === null || typeof expected !== 'object')) {
          return strict ? actual === expected : actual == expected;

          // If both values are instances of typed arrays, wrap their underlying
          // ArrayBuffers in a Buffer each to increase performance
          // This optimization requires the arrays to have the same type as checked by
          // Object.prototype.toString (aka pToString). Never perform binary
          // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
          // bit patterns are not identical.
        } else if (isView(actual) && isView(expected) && pToString(actual) === pToString(expected) && !(actual instanceof Float32Array || actual instanceof Float64Array)) {
          return compare(new Uint8Array(actual.buffer), new Uint8Array(expected.buffer)) === 0;

          // 7.5 For all other Object pairs, including Array objects, equivalence is
          // determined by having the same number of owned properties (as verified
          // with Object.prototype.hasOwnProperty.call), the same set of keys
          // (although not necessarily the same order), equivalent values for every
          // corresponding key, and an identical 'prototype' property. Note: this
          // accounts for both named and indexed properties on Arrays.
        } else if (isBuffer(actual) !== isBuffer(expected)) {
          return false;
        } else {
          memos = memos || { actual: [], expected: [] };

          var actualIndex = memos.actual.indexOf(actual);
          if (actualIndex !== -1) {
            if (actualIndex === memos.expected.indexOf(expected)) {
              return true;
            }
          }

          memos.actual.push(actual);
          memos.expected.push(expected);

          return objEquiv(actual, expected, strict, memos);
        }
      }

      function isArguments(object) {
        return Object.prototype.toString.call(object) == '[object Arguments]';
      }

      function objEquiv(a, b, strict, actualVisitedObjects) {
        if (a === null || a === undefined || b === null || b === undefined) return false;
        // if one is a primitive, the other must be same
        if (util.isPrimitive(a) || util.isPrimitive(b)) return a === b;
        if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
        var aIsArgs = isArguments(a);
        var bIsArgs = isArguments(b);
        if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs) return false;
        if (aIsArgs) {
          a = pSlice.call(a);
          b = pSlice.call(b);
          return _deepEqual(a, b, strict);
        }
        var ka = objectKeys(a);
        var kb = objectKeys(b);
        var key, i;
        // having the same number of owned properties (keys incorporates
        // hasOwnProperty)
        if (ka.length !== kb.length) return false;
        //the same set of keys (although not necessarily the same order),
        ka.sort();
        kb.sort();
        //~~~cheap key test
        for (i = ka.length - 1; i >= 0; i--) {
          if (ka[i] !== kb[i]) return false;
        }
        //equivalent values for every corresponding key, and
        //~~~possibly expensive deep test
        for (i = ka.length - 1; i >= 0; i--) {
          key = ka[i];
          if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects)) return false;
        }
        return true;
      }

      // 8. The non-equivalence assertion tests for any deep inequality.
      // assert.notDeepEqual(actual, expected, message_opt);

      assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
        if (_deepEqual(actual, expected, false)) {
          fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
        }
      };

      assert.notDeepStrictEqual = notDeepStrictEqual;
      function notDeepStrictEqual(actual, expected, message) {
        if (_deepEqual(actual, expected, true)) {
          fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
        }
      }

      // 9. The strict equality assertion tests strict equality, as determined by ===.
      // assert.strictEqual(actual, expected, message_opt);

      assert.strictEqual = function strictEqual(actual, expected, message) {
        if (actual !== expected) {
          fail(actual, expected, message, '===', assert.strictEqual);
        }
      };

      // 10. The strict non-equality assertion tests for strict inequality, as
      // determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

      assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
        if (actual === expected) {
          fail(actual, expected, message, '!==', assert.notStrictEqual);
        }
      };

      function expectedException(actual, expected) {
        if (!actual || !expected) {
          return false;
        }

        if (Object.prototype.toString.call(expected) == '[object RegExp]') {
          return expected.test(actual);
        }

        try {
          if (actual instanceof expected) {
            return true;
          }
        } catch (e) {
          // Ignore.  The instanceof check doesn't work for arrow functions.
        }

        if (Error.isPrototypeOf(expected)) {
          return false;
        }

        return expected.call({}, actual) === true;
      }

      function _tryBlock(block) {
        var error;
        try {
          block();
        } catch (e) {
          error = e;
        }
        return error;
      }

      function _throws(shouldThrow, block, expected, message) {
        var actual;

        if (typeof block !== 'function') {
          throw new TypeError('"block" argument must be a function');
        }

        if (typeof expected === 'string') {
          message = expected;
          expected = null;
        }

        actual = _tryBlock(block);

        message = (expected && expected.name ? ' (' + expected.name + ').' : '.') + (message ? ' ' + message : '.');

        if (shouldThrow && !actual) {
          fail(actual, expected, 'Missing expected exception' + message);
        }

        var userProvidedMessage = typeof message === 'string';
        var isUnwantedException = !shouldThrow && util.isError(actual);
        var isUnexpectedException = !shouldThrow && actual && !expected;

        if (isUnwantedException && userProvidedMessage && expectedException(actual, expected) || isUnexpectedException) {
          fail(actual, expected, 'Got unwanted exception' + message);
        }

        if (shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) {
          throw actual;
        }
      }

      // 11. Expected to throw an error:
      // assert.throws(block, Error_opt, message_opt);

      assert.throws = function (block, /*optional*/error, /*optional*/message) {
        _throws(true, block, error, message);
      };

      // EXTENSION! This is annoying to write outside this module.
      assert.doesNotThrow = function (block, /*optional*/error, /*optional*/message) {
        _throws(false, block, error, message);
      };

      assert.ifError = function (err) {
        if (err) throw err;
      };

      var objectKeys = Object.keys || function (obj) {
        var keys = [];
        for (var key in obj) {
          if (hasOwn.call(obj, key)) keys.push(key);
        }
        return keys;
      };
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, { "util/": 54 }], 2: [function (require, module, exports) {
    'use strict';

    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;

    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }

    // Support decoding URL-safe base64 strings, as Node.js does.
    // See: https://en.wikipedia.org/wiki/Base64#URL_applications
    revLookup['-'.charCodeAt(0)] = 62;
    revLookup['_'.charCodeAt(0)] = 63;

    function placeHoldersCount(b64) {
      var len = b64.length;
      if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4');
      }

      // the number of equal signs (place holders)
      // if there are two placeholders, than the two characters before it
      // represent one byte
      // if there is only one, then the three characters before it represent 2 bytes
      // this is just a cheap hack to not do indexOf twice
      return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
    }

    function byteLength(b64) {
      // base64 is 4/3 + up to two characters of the original data
      return b64.length * 3 / 4 - placeHoldersCount(b64);
    }

    function toByteArray(b64) {
      var i, l, tmp, placeHolders, arr;
      var len = b64.length;
      placeHolders = placeHoldersCount(b64);

      arr = new Arr(len * 3 / 4 - placeHolders);

      // if there are placeholders, only get up to the last complete 4 chars
      l = placeHolders > 0 ? len - 4 : len;

      var L = 0;

      for (i = 0; i < l; i += 4) {
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[L++] = tmp >> 16 & 0xFF;
        arr[L++] = tmp >> 8 & 0xFF;
        arr[L++] = tmp & 0xFF;
      }

      if (placeHolders === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[L++] = tmp & 0xFF;
      } else if (placeHolders === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[L++] = tmp >> 8 & 0xFF;
        arr[L++] = tmp & 0xFF;
      }

      return arr;
    }

    function tripletToBase64(num) {
      return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
    }

    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
        output.push(tripletToBase64(tmp));
      }
      return output.join('');
    }

    function fromByteArray(uint8) {
      var tmp;
      var len = uint8.length;
      var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
      var output = '';
      var parts = [];
      var maxChunkLength = 16383; // must be multiple of 3

      // go through the array every three bytes, we'll deal with trailing stuff later
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
      }

      // pad the end with zeros, but make sure to not forget the extra bytes
      if (extraBytes === 1) {
        tmp = uint8[len - 1];
        output += lookup[tmp >> 2];
        output += lookup[tmp << 4 & 0x3F];
        output += '==';
      } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        output += lookup[tmp >> 10];
        output += lookup[tmp >> 4 & 0x3F];
        output += lookup[tmp << 2 & 0x3F];
        output += '=';
      }

      parts.push(output);

      return parts.join('');
    }
  }, {}], 3: [function (require, module, exports) {}, {}], 4: [function (require, module, exports) {
    arguments[4][3][0].apply(exports, arguments);
  }, { "dup": 3 }], 5: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    var Buffer = require('buffer').Buffer;

    var isBufferEncoding = Buffer.isEncoding || function (encoding) {
      switch (encoding && encoding.toLowerCase()) {
        case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
          return true;
        default:
          return false;
      }
    };

    function assertEncoding(encoding) {
      if (encoding && !isBufferEncoding(encoding)) {
        throw new Error('Unknown encoding: ' + encoding);
      }
    }

    // StringDecoder provides an interface for efficiently splitting a series of
    // buffers into a series of JS strings without breaking apart multi-byte
    // characters. CESU-8 is handled as part of the UTF-8 encoding.
    //
    // @TODO Handling all encodings inside a single object makes it very difficult
    // to reason about this code, so it should be split up in the future.
    // @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
    // points as used by CESU-8.
    var StringDecoder = exports.StringDecoder = function (encoding) {
      this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
      assertEncoding(encoding);
      switch (this.encoding) {
        case 'utf8':
          // CESU-8 represents each of Surrogate Pair by 3-bytes
          this.surrogateSize = 3;
          break;
        case 'ucs2':
        case 'utf16le':
          // UTF-16 represents each of Surrogate Pair by 2-bytes
          this.surrogateSize = 2;
          this.detectIncompleteChar = utf16DetectIncompleteChar;
          break;
        case 'base64':
          // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
          this.surrogateSize = 3;
          this.detectIncompleteChar = base64DetectIncompleteChar;
          break;
        default:
          this.write = passThroughWrite;
          return;
      }

      // Enough space to store all bytes of a single character. UTF-8 needs 4
      // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
      this.charBuffer = new Buffer(6);
      // Number of bytes received for the current incomplete multi-byte character.
      this.charReceived = 0;
      // Number of bytes expected for the current incomplete multi-byte character.
      this.charLength = 0;
    };

    // write decodes the given buffer and returns it as JS string that is
    // guaranteed to not contain any partial multi-byte characters. Any partial
    // character found at the end of the buffer is buffered up, and will be
    // returned when calling write again with the remaining bytes.
    //
    // Note: Converting a Buffer containing an orphan surrogate to a String
    // currently works, but converting a String to a Buffer (via `new Buffer`, or
    // Buffer#write) will replace incomplete surrogates with the unicode
    // replacement character. See https://codereview.chromium.org/121173009/ .
    StringDecoder.prototype.write = function (buffer) {
      var charStr = '';
      // if our last write ended with an incomplete multibyte character
      while (this.charLength) {
        // determine how many remaining bytes this buffer has to offer for this char
        var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;

        // add the new bytes to the char buffer
        buffer.copy(this.charBuffer, this.charReceived, 0, available);
        this.charReceived += available;

        if (this.charReceived < this.charLength) {
          // still not enough chars in this buffer? wait for more ...
          return '';
        }

        // remove bytes belonging to the current character from the buffer
        buffer = buffer.slice(available, buffer.length);

        // get the character that was split
        charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

        // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
        var charCode = charStr.charCodeAt(charStr.length - 1);
        if (charCode >= 0xD800 && charCode <= 0xDBFF) {
          this.charLength += this.surrogateSize;
          charStr = '';
          continue;
        }
        this.charReceived = this.charLength = 0;

        // if there are no more bytes in this buffer, just emit our char
        if (buffer.length === 0) {
          return charStr;
        }
        break;
      }

      // determine and set charLength / charReceived
      this.detectIncompleteChar(buffer);

      var end = buffer.length;
      if (this.charLength) {
        // buffer the incomplete character bytes we got
        buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
        end -= this.charReceived;
      }

      charStr += buffer.toString(this.encoding, 0, end);

      var end = charStr.length - 1;
      var charCode = charStr.charCodeAt(end);
      // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
      if (charCode >= 0xD800 && charCode <= 0xDBFF) {
        var size = this.surrogateSize;
        this.charLength += size;
        this.charReceived += size;
        this.charBuffer.copy(this.charBuffer, size, 0, size);
        buffer.copy(this.charBuffer, 0, 0, size);
        return charStr.substring(0, end);
      }

      // or just emit the charStr
      return charStr;
    };

    // detectIncompleteChar determines if there is an incomplete UTF-8 character at
    // the end of the given buffer. If so, it sets this.charLength to the byte
    // length that character, and sets this.charReceived to the number of bytes
    // that are available for this character.
    StringDecoder.prototype.detectIncompleteChar = function (buffer) {
      // determine how many bytes we have to check at the end of this buffer
      var i = buffer.length >= 3 ? 3 : buffer.length;

      // Figure out if one of the last i bytes of our buffer announces an
      // incomplete char.
      for (; i > 0; i--) {
        var c = buffer[buffer.length - i];

        // See http://en.wikipedia.org/wiki/UTF-8#Description

        // 110XXXXX
        if (i == 1 && c >> 5 == 0x06) {
          this.charLength = 2;
          break;
        }

        // 1110XXXX
        if (i <= 2 && c >> 4 == 0x0E) {
          this.charLength = 3;
          break;
        }

        // 11110XXX
        if (i <= 3 && c >> 3 == 0x1E) {
          this.charLength = 4;
          break;
        }
      }
      this.charReceived = i;
    };

    StringDecoder.prototype.end = function (buffer) {
      var res = '';
      if (buffer && buffer.length) res = this.write(buffer);

      if (this.charReceived) {
        var cr = this.charReceived;
        var buf = this.charBuffer;
        var enc = this.encoding;
        res += buf.slice(0, cr).toString(enc);
      }

      return res;
    };

    function passThroughWrite(buffer) {
      return buffer.toString(this.encoding);
    }

    function utf16DetectIncompleteChar(buffer) {
      this.charReceived = buffer.length % 2;
      this.charLength = this.charReceived ? 2 : 0;
    }

    function base64DetectIncompleteChar(buffer) {
      this.charReceived = buffer.length % 3;
      this.charLength = this.charReceived ? 3 : 0;
    }
  }, { "buffer": 6 }], 6: [function (require, module, exports) {
    (function (global) {
      /*!
       * The buffer module from node.js, for the browser.
       *
       * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
       * @license  MIT
       */
      /* eslint-disable no-proto */

      'use strict';

      var base64 = require('base64-js');
      var ieee754 = require('ieee754');
      var isArray = require('isarray');

      exports.Buffer = Buffer;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;

      /**
       * If `Buffer.TYPED_ARRAY_SUPPORT`:
       *   === true    Use Uint8Array implementation (fastest)
       *   === false   Use Object implementation (most compatible, even IE6)
       *
       * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
       * Opera 11.6+, iOS 4.2+.
       *
       * Due to various browser bugs, sometimes the Object implementation will be used even
       * when the browser supports typed arrays.
       *
       * Note:
       *
       *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
       *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
       *
       *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
       *
       *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
       *     incorrect length in some situations.
      
       * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
       * get the Object implementation, which is slower but behaves correctly.
       */
      Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

      /*
       * Export kMaxLength after typed array support is determined.
       */
      exports.kMaxLength = kMaxLength();

      function typedArraySupport() {
        try {
          var arr = new Uint8Array(1);
          arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () {
              return 42;
            } };
          return arr.foo() === 42 && // typed array instances can be augmented
          typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
          arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
        } catch (e) {
          return false;
        }
      }

      function kMaxLength() {
        return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
      }

      function createBuffer(that, length) {
        if (kMaxLength() < length) {
          throw new RangeError('Invalid typed array length');
        }
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          // Return an augmented `Uint8Array` instance, for best performance
          that = new Uint8Array(length);
          that.__proto__ = Buffer.prototype;
        } else {
          // Fallback: Return an object instance of the Buffer class
          if (that === null) {
            that = new Buffer(length);
          }
          that.length = length;
        }

        return that;
      }

      /**
       * The Buffer constructor returns instances of `Uint8Array` that have their
       * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
       * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
       * and the `Uint8Array` methods. Square bracket notation works as expected -- it
       * returns a single octet.
       *
       * The `Uint8Array` prototype remains unmodified.
       */

      function Buffer(arg, encodingOrOffset, length) {
        if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
          return new Buffer(arg, encodingOrOffset, length);
        }

        // Common case.
        if (typeof arg === 'number') {
          if (typeof encodingOrOffset === 'string') {
            throw new Error('If encoding is specified then the first argument must be a string');
          }
          return allocUnsafe(this, arg);
        }
        return from(this, arg, encodingOrOffset, length);
      }

      Buffer.poolSize = 8192; // not used by this implementation

      // TODO: Legacy, not needed anymore. Remove in next major version.
      Buffer._augment = function (arr) {
        arr.__proto__ = Buffer.prototype;
        return arr;
      };

      function from(that, value, encodingOrOffset, length) {
        if (typeof value === 'number') {
          throw new TypeError('"value" argument must not be a number');
        }

        if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
          return fromArrayBuffer(that, value, encodingOrOffset, length);
        }

        if (typeof value === 'string') {
          return fromString(that, value, encodingOrOffset);
        }

        return fromObject(that, value);
      }

      /**
       * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
       * if value is a number.
       * Buffer.from(str[, encoding])
       * Buffer.from(array)
       * Buffer.from(buffer)
       * Buffer.from(arrayBuffer[, byteOffset[, length]])
       **/
      Buffer.from = function (value, encodingOrOffset, length) {
        return from(null, value, encodingOrOffset, length);
      };

      if (Buffer.TYPED_ARRAY_SUPPORT) {
        Buffer.prototype.__proto__ = Uint8Array.prototype;
        Buffer.__proto__ = Uint8Array;
        if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
          // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
          Object.defineProperty(Buffer, Symbol.species, {
            value: null,
            configurable: true
          });
        }
      }

      function assertSize(size) {
        if (typeof size !== 'number') {
          throw new TypeError('"size" argument must be a number');
        } else if (size < 0) {
          throw new RangeError('"size" argument must not be negative');
        }
      }

      function alloc(that, size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(that, size);
        }
        if (fill !== undefined) {
          // Only pay attention to encoding if it's a string. This
          // prevents accidentally sending in a number that would
          // be interpretted as a start offset.
          return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
        }
        return createBuffer(that, size);
      }

      /**
       * Creates a new filled Buffer instance.
       * alloc(size[, fill[, encoding]])
       **/
      Buffer.alloc = function (size, fill, encoding) {
        return alloc(null, size, fill, encoding);
      };

      function allocUnsafe(that, size) {
        assertSize(size);
        that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
        if (!Buffer.TYPED_ARRAY_SUPPORT) {
          for (var i = 0; i < size; ++i) {
            that[i] = 0;
          }
        }
        return that;
      }

      /**
       * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
       * */
      Buffer.allocUnsafe = function (size) {
        return allocUnsafe(null, size);
      };
      /**
       * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
       */
      Buffer.allocUnsafeSlow = function (size) {
        return allocUnsafe(null, size);
      };

      function fromString(that, string, encoding) {
        if (typeof encoding !== 'string' || encoding === '') {
          encoding = 'utf8';
        }

        if (!Buffer.isEncoding(encoding)) {
          throw new TypeError('"encoding" must be a valid string encoding');
        }

        var length = byteLength(string, encoding) | 0;
        that = createBuffer(that, length);

        var actual = that.write(string, encoding);

        if (actual !== length) {
          // Writing a hex string, for example, that contains invalid characters will
          // cause everything after the first invalid character to be ignored. (e.g.
          // 'abxxcd' will be treated as 'ab')
          that = that.slice(0, actual);
        }

        return that;
      }

      function fromArrayLike(that, array) {
        var length = array.length < 0 ? 0 : checked(array.length) | 0;
        that = createBuffer(that, length);
        for (var i = 0; i < length; i += 1) {
          that[i] = array[i] & 255;
        }
        return that;
      }

      function fromArrayBuffer(that, array, byteOffset, length) {
        array.byteLength; // this throws if `array` is not a valid ArrayBuffer

        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('\'offset\' is out of bounds');
        }

        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('\'length\' is out of bounds');
        }

        if (byteOffset === undefined && length === undefined) {
          array = new Uint8Array(array);
        } else if (length === undefined) {
          array = new Uint8Array(array, byteOffset);
        } else {
          array = new Uint8Array(array, byteOffset, length);
        }

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          // Return an augmented `Uint8Array` instance, for best performance
          that = array;
          that.__proto__ = Buffer.prototype;
        } else {
          // Fallback: Return an object instance of the Buffer class
          that = fromArrayLike(that, array);
        }
        return that;
      }

      function fromObject(that, obj) {
        if (Buffer.isBuffer(obj)) {
          var len = checked(obj.length) | 0;
          that = createBuffer(that, len);

          if (that.length === 0) {
            return that;
          }

          obj.copy(that, 0, 0, len);
          return that;
        }

        if (obj) {
          if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
            if (typeof obj.length !== 'number' || isnan(obj.length)) {
              return createBuffer(that, 0);
            }
            return fromArrayLike(that, obj);
          }

          if (obj.type === 'Buffer' && isArray(obj.data)) {
            return fromArrayLike(that, obj.data);
          }
        }

        throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
      }

      function checked(length) {
        // Note: cannot use `length < kMaxLength()` here because that fails when
        // length is NaN (which is otherwise coerced to zero.)
        if (length >= kMaxLength()) {
          throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
        }
        return length | 0;
      }

      function SlowBuffer(length) {
        if (+length != length) {
          // eslint-disable-line eqeqeq
          length = 0;
        }
        return Buffer.alloc(+length);
      }

      Buffer.isBuffer = function isBuffer(b) {
        return !!(b != null && b._isBuffer);
      };

      Buffer.compare = function compare(a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
          throw new TypeError('Arguments must be Buffers');
        }

        if (a === b) return 0;

        var x = a.length;
        var y = b.length;

        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }

        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };

      Buffer.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case 'hex':
          case 'utf8':
          case 'utf-8':
          case 'ascii':
          case 'latin1':
          case 'binary':
          case 'base64':
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return true;
          default:
            return false;
        }
      };

      Buffer.concat = function concat(list, length) {
        if (!isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }

        if (list.length === 0) {
          return Buffer.alloc(0);
        }

        var i;
        if (length === undefined) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }

        var buffer = Buffer.allocUnsafe(length);
        var pos = 0;
        for (i = 0; i < list.length; ++i) {
          var buf = list[i];
          if (!Buffer.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          }
          buf.copy(buffer, pos);
          pos += buf.length;
        }
        return buffer;
      };

      function byteLength(string, encoding) {
        if (Buffer.isBuffer(string)) {
          return string.length;
        }
        if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== 'string') {
          string = '' + string;
        }

        var len = string.length;
        if (len === 0) return 0;

        // Use a for loop to avoid recursion
        var loweredCase = false;
        for (;;) {
          switch (encoding) {
            case 'ascii':
            case 'latin1':
            case 'binary':
              return len;
            case 'utf8':
            case 'utf-8':
            case undefined:
              return utf8ToBytes(string).length;
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return len * 2;
            case 'hex':
              return len >>> 1;
            case 'base64':
              return base64ToBytes(string).length;
            default:
              if (loweredCase) return utf8ToBytes(string).length; // assume utf8
              encoding = ('' + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer.byteLength = byteLength;

      function slowToString(encoding, start, end) {
        var loweredCase = false;

        // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
        // property of a typed array.

        // This behaves neither like String nor Uint8Array in that we set start/end
        // to their upper/lower bounds if the value passed is out of range.
        // undefined is handled specially as per ECMA-262 6th Edition,
        // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
        if (start === undefined || start < 0) {
          start = 0;
        }
        // Return early if start > this.length. Done here to prevent potential uint32
        // coercion fail below.
        if (start > this.length) {
          return '';
        }

        if (end === undefined || end > this.length) {
          end = this.length;
        }

        if (end <= 0) {
          return '';
        }

        // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
        end >>>= 0;
        start >>>= 0;

        if (end <= start) {
          return '';
        }

        if (!encoding) encoding = 'utf8';

        while (true) {
          switch (encoding) {
            case 'hex':
              return hexSlice(this, start, end);

            case 'utf8':
            case 'utf-8':
              return utf8Slice(this, start, end);

            case 'ascii':
              return asciiSlice(this, start, end);

            case 'latin1':
            case 'binary':
              return latin1Slice(this, start, end);

            case 'base64':
              return base64Slice(this, start, end);

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return utf16leSlice(this, start, end);

            default:
              if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
              encoding = (encoding + '').toLowerCase();
              loweredCase = true;
          }
        }
      }

      // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
      // Buffer instances.
      Buffer.prototype._isBuffer = true;

      function swap(b, n, m) {
        var i = b[n];
        b[n] = b[m];
        b[m] = i;
      }

      Buffer.prototype.swap16 = function swap16() {
        var len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 16-bits');
        }
        for (var i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };

      Buffer.prototype.swap32 = function swap32() {
        var len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 32-bits');
        }
        for (var i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };

      Buffer.prototype.swap64 = function swap64() {
        var len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 64-bits');
        }
        for (var i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };

      Buffer.prototype.toString = function toString() {
        var length = this.length | 0;
        if (length === 0) return '';
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };

      Buffer.prototype.equals = function equals(b) {
        if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
        if (this === b) return true;
        return Buffer.compare(this, b) === 0;
      };

      Buffer.prototype.inspect = function inspect() {
        var str = '';
        var max = exports.INSPECT_MAX_BYTES;
        if (this.length > 0) {
          str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
          if (this.length > max) str += ' ... ';
        }
        return '<Buffer ' + str + '>';
      };

      Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (!Buffer.isBuffer(target)) {
          throw new TypeError('Argument must be a Buffer');
        }

        if (start === undefined) {
          start = 0;
        }
        if (end === undefined) {
          end = target ? target.length : 0;
        }
        if (thisStart === undefined) {
          thisStart = 0;
        }
        if (thisEnd === undefined) {
          thisEnd = this.length;
        }

        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError('out of range index');
        }

        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }

        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;

        if (this === target) return 0;

        var x = thisEnd - thisStart;
        var y = end - start;
        var len = Math.min(x, y);

        var thisCopy = this.slice(thisStart, thisEnd);
        var targetCopy = target.slice(start, end);

        for (var i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }

        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };

      // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
      // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
      //
      // Arguments:
      // - buffer - a Buffer to search
      // - val - a string, Buffer, or number
      // - byteOffset - an index into `buffer`; will be clamped to an int32
      // - encoding - an optional encoding, relevant is val is a string
      // - dir - true for indexOf, false for lastIndexOf
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        // Empty buffer means no match
        if (buffer.length === 0) return -1;

        // Normalize byteOffset
        if (typeof byteOffset === 'string') {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 0x7fffffff) {
          byteOffset = 0x7fffffff;
        } else if (byteOffset < -0x80000000) {
          byteOffset = -0x80000000;
        }
        byteOffset = +byteOffset; // Coerce to Number.
        if (isNaN(byteOffset)) {
          // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
          byteOffset = dir ? 0 : buffer.length - 1;
        }

        // Normalize byteOffset: negative offsets start from the end of the buffer
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;else return -1;
        }

        // Normalize val
        if (typeof val === 'string') {
          val = Buffer.from(val, encoding);
        }

        // Finally, search either indexOf (if dir is true) or lastIndexOf
        if (Buffer.isBuffer(val)) {
          // Special case: looking for empty string/buffer always fails
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === 'number') {
          val = val & 0xFF; // Search for a byte value [0-255]
          if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }

        throw new TypeError('val must be string, number or Buffer');
      }

      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        var indexSize = 1;
        var arrLength = arr.length;
        var valLength = val.length;

        if (encoding !== undefined) {
          encoding = String(encoding).toLowerCase();
          if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }

        function read(buf, i) {
          if (indexSize === 1) {
            return buf[i];
          } else {
            return buf.readUInt16BE(i * indexSize);
          }
        }

        var i;
        if (dir) {
          var foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            var found = true;
            for (var j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }

        return -1;
      }

      Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };

      Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };

      Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };

      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        var remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }

        // must be an even number of digits
        var strLen = string.length;
        if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

        if (length > strLen / 2) {
          length = strLen / 2;
        }
        for (var i = 0; i < length; ++i) {
          var parsed = parseInt(string.substr(i * 2, 2), 16);
          if (isNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }

      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }

      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }

      function latin1Write(buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length);
      }

      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }

      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }

      Buffer.prototype.write = function write(string, offset, length, encoding) {
        // Buffer#write(string)
        if (offset === undefined) {
          encoding = 'utf8';
          length = this.length;
          offset = 0;
          // Buffer#write(string, encoding)
        } else if (length === undefined && typeof offset === 'string') {
          encoding = offset;
          length = this.length;
          offset = 0;
          // Buffer#write(string, offset[, length][, encoding])
        } else if (isFinite(offset)) {
          offset = offset | 0;
          if (isFinite(length)) {
            length = length | 0;
            if (encoding === undefined) encoding = 'utf8';
          } else {
            encoding = length;
            length = undefined;
          }
          // legacy write(string, encoding, offset, length) - remove in v0.13
        } else {
          throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
        }

        var remaining = this.length - offset;
        if (length === undefined || length > remaining) length = remaining;

        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError('Attempt to write outside buffer bounds');
        }

        if (!encoding) encoding = 'utf8';

        var loweredCase = false;
        for (;;) {
          switch (encoding) {
            case 'hex':
              return hexWrite(this, string, offset, length);

            case 'utf8':
            case 'utf-8':
              return utf8Write(this, string, offset, length);

            case 'ascii':
              return asciiWrite(this, string, offset, length);

            case 'latin1':
            case 'binary':
              return latin1Write(this, string, offset, length);

            case 'base64':
              // Warning: maxLength not taken into account in base64Write
              return base64Write(this, string, offset, length);

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return ucs2Write(this, string, offset, length);

            default:
              if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
              encoding = ('' + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };

      Buffer.prototype.toJSON = function toJSON() {
        return {
          type: 'Buffer',
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };

      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }

      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        var res = [];

        var i = start;
        while (i < end) {
          var firstByte = buf[i];
          var codePoint = null;
          var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

          if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;

            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 0x80) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
                  if (tempCodePoint > 0x7F) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
                  if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
                  if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }

          if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD;
            bytesPerSequence = 1;
          } else if (codePoint > 0xFFFF) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000;
            res.push(codePoint >>> 10 & 0x3FF | 0xD800);
            codePoint = 0xDC00 | codePoint & 0x3FF;
          }

          res.push(codePoint);
          i += bytesPerSequence;
        }

        return decodeCodePointsArray(res);
      }

      // Based on http://stackoverflow.com/a/22747272/680742, the browser with
      // the lowest limit is Chrome, with 0x10000 args.
      // We go 1 magnitude less, for safety
      var MAX_ARGUMENTS_LENGTH = 0x1000;

      function decodeCodePointsArray(codePoints) {
        var len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
        }

        // Decode in chunks to avoid "call stack size exceeded".
        var res = '';
        var i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
        }
        return res;
      }

      function asciiSlice(buf, start, end) {
        var ret = '';
        end = Math.min(buf.length, end);

        for (var i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 0x7F);
        }
        return ret;
      }

      function latin1Slice(buf, start, end) {
        var ret = '';
        end = Math.min(buf.length, end);

        for (var i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }

      function hexSlice(buf, start, end) {
        var len = buf.length;

        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;

        var out = '';
        for (var i = start; i < end; ++i) {
          out += toHex(buf[i]);
        }
        return out;
      }

      function utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end);
        var res = '';
        for (var i = 0; i < bytes.length; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }

      Buffer.prototype.slice = function slice(start, end) {
        var len = this.length;
        start = ~~start;
        end = end === undefined ? len : ~~end;

        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }

        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }

        if (end < start) end = start;

        var newBuf;
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          newBuf = this.subarray(start, end);
          newBuf.__proto__ = Buffer.prototype;
        } else {
          var sliceLen = end - start;
          newBuf = new Buffer(sliceLen, undefined);
          for (var i = 0; i < sliceLen; ++i) {
            newBuf[i] = this[i + start];
          }
        }

        return newBuf;
      };

      /*
       * Need to make sure that buffer isn't trying to write out of bounds.
       */
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
        if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
      }

      Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
        offset = offset | 0;
        byteLength = byteLength | 0;
        if (!noAssert) checkOffset(offset, byteLength, this.length);

        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 0x100)) {
          val += this[offset + i] * mul;
        }

        return val;
      };

      Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
        offset = offset | 0;
        byteLength = byteLength | 0;
        if (!noAssert) {
          checkOffset(offset, byteLength, this.length);
        }

        var val = this[offset + --byteLength];
        var mul = 1;
        while (byteLength > 0 && (mul *= 0x100)) {
          val += this[offset + --byteLength] * mul;
        }

        return val;
      };

      Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };

      Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };

      Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };

      Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length);

        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
      };

      Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length);

        return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };

      Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
        offset = offset | 0;
        byteLength = byteLength | 0;
        if (!noAssert) checkOffset(offset, byteLength, this.length);

        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 0x100)) {
          val += this[offset + i] * mul;
        }
        mul *= 0x80;

        if (val >= mul) val -= Math.pow(2, 8 * byteLength);

        return val;
      };

      Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
        offset = offset | 0;
        byteLength = byteLength | 0;
        if (!noAssert) checkOffset(offset, byteLength, this.length);

        var i = byteLength;
        var mul = 1;
        var val = this[offset + --i];
        while (i > 0 && (mul *= 0x100)) {
          val += this[offset + --i] * mul;
        }
        mul *= 0x80;

        if (val >= mul) val -= Math.pow(2, 8 * byteLength);

        return val;
      };

      Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 0x80)) return this[offset];
        return (0xff - this[offset] + 1) * -1;
      };

      Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length);
        var val = this[offset] | this[offset + 1] << 8;
        return val & 0x8000 ? val | 0xFFFF0000 : val;
      };

      Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length);
        var val = this[offset + 1] | this[offset] << 8;
        return val & 0x8000 ? val | 0xFFFF0000 : val;
      };

      Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length);

        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };

      Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length);

        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };

      Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };

      Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };

      Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };

      Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };

      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError('Index out of range');
      }

      Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset | 0;
        byteLength = byteLength | 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }

        var mul = 1;
        var i = 0;
        this[offset] = value & 0xFF;
        while (++i < byteLength && (mul *= 0x100)) {
          this[offset + i] = value / mul & 0xFF;
        }

        return offset + byteLength;
      };

      Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset | 0;
        byteLength = byteLength | 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }

        var i = byteLength - 1;
        var mul = 1;
        this[offset + i] = value & 0xFF;
        while (--i >= 0 && (mul *= 0x100)) {
          this[offset + i] = value / mul & 0xFF;
        }

        return offset + byteLength;
      };

      Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
        if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
        this[offset] = value & 0xff;
        return offset + 1;
      };

      function objectWriteUInt16(buf, value, offset, littleEndian) {
        if (value < 0) value = 0xffff + value + 1;
        for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
          buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
        }
      }

      Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value & 0xff;
          this[offset + 1] = value >>> 8;
        } else {
          objectWriteUInt16(this, value, offset, true);
        }
        return offset + 2;
      };

      Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = value & 0xff;
        } else {
          objectWriteUInt16(this, value, offset, false);
        }
        return offset + 2;
      };

      function objectWriteUInt32(buf, value, offset, littleEndian) {
        if (value < 0) value = 0xffffffff + value + 1;
        for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
          buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
        }
      }

      Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset + 3] = value >>> 24;
          this[offset + 2] = value >>> 16;
          this[offset + 1] = value >>> 8;
          this[offset] = value & 0xff;
        } else {
          objectWriteUInt32(this, value, offset, true);
        }
        return offset + 4;
      };

      Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = value & 0xff;
        } else {
          objectWriteUInt32(this, value, offset, false);
        }
        return offset + 4;
      };

      Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);

          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }

        var i = 0;
        var mul = 1;
        var sub = 0;
        this[offset] = value & 0xFF;
        while (++i < byteLength && (mul *= 0x100)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 0xFF;
        }

        return offset + byteLength;
      };

      Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);

          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }

        var i = byteLength - 1;
        var mul = 1;
        var sub = 0;
        this[offset + i] = value & 0xFF;
        while (--i >= 0 && (mul *= 0x100)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 0xFF;
        }

        return offset + byteLength;
      };

      Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
        if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
        if (value < 0) value = 0xff + value + 1;
        this[offset] = value & 0xff;
        return offset + 1;
      };

      Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value & 0xff;
          this[offset + 1] = value >>> 8;
        } else {
          objectWriteUInt16(this, value, offset, true);
        }
        return offset + 2;
      };

      Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = value & 0xff;
        } else {
          objectWriteUInt16(this, value, offset, false);
        }
        return offset + 2;
      };

      Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value & 0xff;
          this[offset + 1] = value >>> 8;
          this[offset + 2] = value >>> 16;
          this[offset + 3] = value >>> 24;
        } else {
          objectWriteUInt32(this, value, offset, true);
        }
        return offset + 4;
      };

      Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
        if (value < 0) value = 0xffffffff + value + 1;
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = value & 0xff;
        } else {
          objectWriteUInt32(this, value, offset, false);
        }
        return offset + 4;
      };

      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError('Index out of range');
        if (offset < 0) throw new RangeError('Index out of range');
      }

      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }

      Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };

      Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };

      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }

      Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };

      Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };

      // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
      Buffer.prototype.copy = function copy(target, targetStart, start, end) {
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;

        // Copy 0 bytes; we're done
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;

        // Fatal error conditions
        if (targetStart < 0) {
          throw new RangeError('targetStart out of bounds');
        }
        if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
        if (end < 0) throw new RangeError('sourceEnd out of bounds');

        // Are we oob?
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }

        var len = end - start;
        var i;

        if (this === target && start < targetStart && targetStart < end) {
          // descending copy from end
          for (i = len - 1; i >= 0; --i) {
            target[i + targetStart] = this[i + start];
          }
        } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
          // ascending copy from start
          for (i = 0; i < len; ++i) {
            target[i + targetStart] = this[i + start];
          }
        } else {
          Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
        }

        return len;
      };

      // Usage:
      //    buffer.fill(number[, offset[, end]])
      //    buffer.fill(buffer[, offset[, end]])
      //    buffer.fill(string[, offset[, end]][, encoding])
      Buffer.prototype.fill = function fill(val, start, end, encoding) {
        // Handle string cases:
        if (typeof val === 'string') {
          if (typeof start === 'string') {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === 'string') {
            encoding = end;
            end = this.length;
          }
          if (val.length === 1) {
            var code = val.charCodeAt(0);
            if (code < 256) {
              val = code;
            }
          }
          if (encoding !== undefined && typeof encoding !== 'string') {
            throw new TypeError('encoding must be a string');
          }
          if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
            throw new TypeError('Unknown encoding: ' + encoding);
          }
        } else if (typeof val === 'number') {
          val = val & 255;
        }

        // Invalid ranges are not set to a default, so can range check early.
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError('Out of range index');
        }

        if (end <= start) {
          return this;
        }

        start = start >>> 0;
        end = end === undefined ? this.length : end >>> 0;

        if (!val) val = 0;

        var i;
        if (typeof val === 'number') {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
          var len = bytes.length;
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }

        return this;
      };

      // HELPER FUNCTIONS
      // ================

      var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

      function base64clean(str) {
        // Node strips out invalid characters like \n and \t from the string, base64-js does not
        str = stringtrim(str).replace(INVALID_BASE64_RE, '');
        // Node converts strings with length < 2 to ''
        if (str.length < 2) return '';
        // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
        while (str.length % 4 !== 0) {
          str = str + '=';
        }
        return str;
      }

      function stringtrim(str) {
        if (str.trim) return str.trim();
        return str.replace(/^\s+|\s+$/g, '');
      }

      function toHex(n) {
        if (n < 16) return '0' + n.toString(16);
        return n.toString(16);
      }

      function utf8ToBytes(string, units) {
        units = units || Infinity;
        var codePoint;
        var length = string.length;
        var leadSurrogate = null;
        var bytes = [];

        for (var i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);

          // is surrogate component
          if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
              // no lead yet
              if (codePoint > 0xDBFF) {
                // unexpected trail
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                continue;
              } else if (i + 1 === length) {
                // unpaired lead
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                continue;
              }

              // valid lead
              leadSurrogate = codePoint;

              continue;
            }

            // 2 leads in a row
            if (codePoint < 0xDC00) {
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              leadSurrogate = codePoint;
              continue;
            }

            // valid surrogate pair
            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
          } else if (leadSurrogate) {
            // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          }

          leadSurrogate = null;

          // encode utf8
          if (codePoint < 0x80) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
          } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
          } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
          } else {
            throw new Error('Invalid code point');
          }
        }

        return bytes;
      }

      function asciiToBytes(str) {
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) {
          // Node's code seems to be doing this and not & 0x7F..
          byteArray.push(str.charCodeAt(i) & 0xFF);
        }
        return byteArray;
      }

      function utf16leToBytes(str, units) {
        var c, hi, lo;
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;

          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }

        return byteArray;
      }

      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }

      function blitBuffer(src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }

      function isnan(val) {
        return val !== val; // eslint-disable-line no-self-compare
      }
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, { "base64-js": 2, "ieee754": 12, "isarray": 15 }], 7: [function (require, module, exports) {
    module.exports = {
      "100": "Continue",
      "101": "Switching Protocols",
      "102": "Processing",
      "200": "OK",
      "201": "Created",
      "202": "Accepted",
      "203": "Non-Authoritative Information",
      "204": "No Content",
      "205": "Reset Content",
      "206": "Partial Content",
      "207": "Multi-Status",
      "208": "Already Reported",
      "226": "IM Used",
      "300": "Multiple Choices",
      "301": "Moved Permanently",
      "302": "Found",
      "303": "See Other",
      "304": "Not Modified",
      "305": "Use Proxy",
      "307": "Temporary Redirect",
      "308": "Permanent Redirect",
      "400": "Bad Request",
      "401": "Unauthorized",
      "402": "Payment Required",
      "403": "Forbidden",
      "404": "Not Found",
      "405": "Method Not Allowed",
      "406": "Not Acceptable",
      "407": "Proxy Authentication Required",
      "408": "Request Timeout",
      "409": "Conflict",
      "410": "Gone",
      "411": "Length Required",
      "412": "Precondition Failed",
      "413": "Payload Too Large",
      "414": "URI Too Long",
      "415": "Unsupported Media Type",
      "416": "Range Not Satisfiable",
      "417": "Expectation Failed",
      "418": "I'm a teapot",
      "421": "Misdirected Request",
      "422": "Unprocessable Entity",
      "423": "Locked",
      "424": "Failed Dependency",
      "425": "Unordered Collection",
      "426": "Upgrade Required",
      "428": "Precondition Required",
      "429": "Too Many Requests",
      "431": "Request Header Fields Too Large",
      "451": "Unavailable For Legal Reasons",
      "500": "Internal Server Error",
      "501": "Not Implemented",
      "502": "Bad Gateway",
      "503": "Service Unavailable",
      "504": "Gateway Timeout",
      "505": "HTTP Version Not Supported",
      "506": "Variant Also Negotiates",
      "507": "Insufficient Storage",
      "508": "Loop Detected",
      "509": "Bandwidth Limit Exceeded",
      "510": "Not Extended",
      "511": "Network Authentication Required"
    };
  }, {}], 8: [function (require, module, exports) {
    (function (Buffer) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      // NOTE: These type checking functions intentionally don't use `instanceof`
      // because it is fragile and can be easily faked with `Object.create()`.

      function isArray(arg) {
        if (Array.isArray) {
          return Array.isArray(arg);
        }
        return objectToString(arg) === '[object Array]';
      }
      exports.isArray = isArray;

      function isBoolean(arg) {
        return typeof arg === 'boolean';
      }
      exports.isBoolean = isBoolean;

      function isNull(arg) {
        return arg === null;
      }
      exports.isNull = isNull;

      function isNullOrUndefined(arg) {
        return arg == null;
      }
      exports.isNullOrUndefined = isNullOrUndefined;

      function isNumber(arg) {
        return typeof arg === 'number';
      }
      exports.isNumber = isNumber;

      function isString(arg) {
        return typeof arg === 'string';
      }
      exports.isString = isString;

      function isSymbol(arg) {
        return typeof arg === 'symbol';
      }
      exports.isSymbol = isSymbol;

      function isUndefined(arg) {
        return arg === void 0;
      }
      exports.isUndefined = isUndefined;

      function isRegExp(re) {
        return objectToString(re) === '[object RegExp]';
      }
      exports.isRegExp = isRegExp;

      function isObject(arg) {
        return typeof arg === 'object' && arg !== null;
      }
      exports.isObject = isObject;

      function isDate(d) {
        return objectToString(d) === '[object Date]';
      }
      exports.isDate = isDate;

      function isError(e) {
        return objectToString(e) === '[object Error]' || e instanceof Error;
      }
      exports.isError = isError;

      function isFunction(arg) {
        return typeof arg === 'function';
      }
      exports.isFunction = isFunction;

      function isPrimitive(arg) {
        return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
        typeof arg === 'undefined';
      }
      exports.isPrimitive = isPrimitive;

      exports.isBuffer = Buffer.isBuffer;

      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }
    }).call(this, { "isBuffer": require("../../is-buffer/index.js") });
  }, { "../../is-buffer/index.js": 14 }], 9: [function (require, module, exports) {
    (function (process, global) {
      /*!
       * https://github.com/paulmillr/es6-shim
       * @license es6-shim Copyright 2013-2016 by Paul Miller (http://paulmillr.com)
       *   and contributors,  MIT License
       * es6-shim: v0.35.1
       * see https://github.com/paulmillr/es6-shim/blob/0.35.1/LICENSE
       * Details and documentation:
       * https://github.com/paulmillr/es6-shim/
       */

      // UMD (Universal Module Definition)
      // see https://github.com/umdjs/umd/blob/master/returnExports.js
      (function (root, factory) {
        /*global define, module, exports */
        if (typeof define === 'function' && define.amd) {
          // AMD. Register as an anonymous module.
          define(factory);
        } else if (typeof exports === 'object') {
          // Node. Does not work with strict CommonJS, but
          // only CommonJS-like environments that support module.exports,
          // like Node.
          module.exports = factory();
        } else {
          // Browser globals (root is window)
          root.returnExports = factory();
        }
      })(this, function () {
        'use strict';

        var _apply = Function.call.bind(Function.apply);
        var _call = Function.call.bind(Function.call);
        var isArray = Array.isArray;
        var keys = Object.keys;

        var not = function notThunker(func) {
          return function notThunk() {
            return !_apply(func, this, arguments);
          };
        };
        var throwsError = function (func) {
          try {
            func();
            return false;
          } catch (e) {
            return true;
          }
        };
        var valueOrFalseIfThrows = function valueOrFalseIfThrows(func) {
          try {
            return func();
          } catch (e) {
            return false;
          }
        };

        var isCallableWithoutNew = not(throwsError);
        var arePropertyDescriptorsSupported = function () {
          // if Object.defineProperty exists but throws, it's IE 8
          return !throwsError(function () {
            Object.defineProperty({}, 'x', { get: function () {} });
          });
        };
        var supportsDescriptors = !!Object.defineProperty && arePropertyDescriptorsSupported();
        var functionsHaveNames = function foo() {}.name === 'foo'; // eslint-disable-line no-extra-parens

        var _forEach = Function.call.bind(Array.prototype.forEach);
        var _reduce = Function.call.bind(Array.prototype.reduce);
        var _filter = Function.call.bind(Array.prototype.filter);
        var _some = Function.call.bind(Array.prototype.some);

        var defineProperty = function (object, name, value, force) {
          if (!force && name in object) {
            return;
          }
          if (supportsDescriptors) {
            Object.defineProperty(object, name, {
              configurable: true,
              enumerable: false,
              writable: true,
              value: value
            });
          } else {
            object[name] = value;
          }
        };

        // Define configurable, writable and non-enumerable props
        // if they don’t exist.
        var defineProperties = function (object, map, forceOverride) {
          _forEach(keys(map), function (name) {
            var method = map[name];
            defineProperty(object, name, method, !!forceOverride);
          });
        };

        var _toString = Function.call.bind(Object.prototype.toString);
        var isCallable = typeof /abc/ === 'function' ? function IsCallableSlow(x) {
          // Some old browsers (IE, FF) say that typeof /abc/ === 'function'
          return typeof x === 'function' && _toString(x) === '[object Function]';
        } : function IsCallableFast(x) {
          return typeof x === 'function';
        };

        var Value = {
          getter: function (object, name, getter) {
            if (!supportsDescriptors) {
              throw new TypeError('getters require true ES5 support');
            }
            Object.defineProperty(object, name, {
              configurable: true,
              enumerable: false,
              get: getter
            });
          },
          proxy: function (originalObject, key, targetObject) {
            if (!supportsDescriptors) {
              throw new TypeError('getters require true ES5 support');
            }
            var originalDescriptor = Object.getOwnPropertyDescriptor(originalObject, key);
            Object.defineProperty(targetObject, key, {
              configurable: originalDescriptor.configurable,
              enumerable: originalDescriptor.enumerable,
              get: function getKey() {
                return originalObject[key];
              },
              set: function setKey(value) {
                originalObject[key] = value;
              }
            });
          },
          redefine: function (object, property, newValue) {
            if (supportsDescriptors) {
              var descriptor = Object.getOwnPropertyDescriptor(object, property);
              descriptor.value = newValue;
              Object.defineProperty(object, property, descriptor);
            } else {
              object[property] = newValue;
            }
          },
          defineByDescriptor: function (object, property, descriptor) {
            if (supportsDescriptors) {
              Object.defineProperty(object, property, descriptor);
            } else if ('value' in descriptor) {
              object[property] = descriptor.value;
            }
          },
          preserveToString: function (target, source) {
            if (source && isCallable(source.toString)) {
              defineProperty(target, 'toString', source.toString.bind(source), true);
            }
          }
        };

        // Simple shim for Object.create on ES3 browsers
        // (unlike real shim, no attempt to support `prototype === null`)
        var create = Object.create || function (prototype, properties) {
          var Prototype = function Prototype() {};
          Prototype.prototype = prototype;
          var object = new Prototype();
          if (typeof properties !== 'undefined') {
            keys(properties).forEach(function (key) {
              Value.defineByDescriptor(object, key, properties[key]);
            });
          }
          return object;
        };

        var supportsSubclassing = function (C, f) {
          if (!Object.setPrototypeOf) {
            return false; /* skip test on IE < 11 */
          }
          return valueOrFalseIfThrows(function () {
            var Sub = function Subclass(arg) {
              var o = new C(arg);
              Object.setPrototypeOf(o, Subclass.prototype);
              return o;
            };
            Object.setPrototypeOf(Sub, C);
            Sub.prototype = create(C.prototype, {
              constructor: { value: Sub }
            });
            return f(Sub);
          });
        };

        var getGlobal = function () {
          /* global self, window, global */
          // the only reliable means to get the global object is
          // `Function('return this')()`
          // However, this causes CSP violations in Chrome apps.
          if (typeof self !== 'undefined') {
            return self;
          }
          if (typeof window !== 'undefined') {
            return window;
          }
          if (typeof global !== 'undefined') {
            return global;
          }
          throw new Error('unable to locate global object');
        };

        var globals = getGlobal();
        var globalIsFinite = globals.isFinite;
        var _indexOf = Function.call.bind(String.prototype.indexOf);
        var _arrayIndexOfApply = Function.apply.bind(Array.prototype.indexOf);
        var _concat = Function.call.bind(Array.prototype.concat);
        // var _sort = Function.call.bind(Array.prototype.sort);
        var _strSlice = Function.call.bind(String.prototype.slice);
        var _push = Function.call.bind(Array.prototype.push);
        var _pushApply = Function.apply.bind(Array.prototype.push);
        var _shift = Function.call.bind(Array.prototype.shift);
        var _max = Math.max;
        var _min = Math.min;
        var _floor = Math.floor;
        var _abs = Math.abs;
        var _exp = Math.exp;
        var _log = Math.log;
        var _sqrt = Math.sqrt;
        var _hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
        var ArrayIterator; // make our implementation private
        var noop = function () {};

        var OrigMap = globals.Map;
        var origMapDelete = OrigMap && OrigMap.prototype['delete'];
        var origMapGet = OrigMap && OrigMap.prototype.get;
        var origMapHas = OrigMap && OrigMap.prototype.has;
        var origMapSet = OrigMap && OrigMap.prototype.set;

        var Symbol = globals.Symbol || {};
        var symbolSpecies = Symbol.species || '@@species';

        var numberIsNaN = Number.isNaN || function isNaN(value) {
          // NaN !== NaN, but they are identical.
          // NaNs are the only non-reflexive value, i.e., if x !== x,
          // then x is NaN.
          // isNaN is broken: it converts its argument to number, so
          // isNaN('foo') => true
          return value !== value;
        };
        var numberIsFinite = Number.isFinite || function isFinite(value) {
          return typeof value === 'number' && globalIsFinite(value);
        };
        var _sign = isCallable(Math.sign) ? Math.sign : function sign(value) {
          var number = Number(value);
          if (number === 0) {
            return number;
          }
          if (numberIsNaN(number)) {
            return number;
          }
          return number < 0 ? -1 : 1;
        };

        // taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
        // can be replaced with require('is-arguments') if we ever use a build process instead
        var isStandardArguments = function isArguments(value) {
          return _toString(value) === '[object Arguments]';
        };
        var isLegacyArguments = function isArguments(value) {
          return value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && _toString(value) !== '[object Array]' && _toString(value.callee) === '[object Function]';
        };
        var isArguments = isStandardArguments(arguments) ? isStandardArguments : isLegacyArguments;

        var Type = {
          primitive: function (x) {
            return x === null || typeof x !== 'function' && typeof x !== 'object';
          },
          string: function (x) {
            return _toString(x) === '[object String]';
          },
          regex: function (x) {
            return _toString(x) === '[object RegExp]';
          },
          symbol: function (x) {
            return typeof globals.Symbol === 'function' && typeof x === 'symbol';
          }
        };

        var overrideNative = function overrideNative(object, property, replacement) {
          var original = object[property];
          defineProperty(object, property, replacement, true);
          Value.preserveToString(object[property], original);
        };

        // eslint-disable-next-line no-restricted-properties
        var hasSymbols = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' && Type.symbol(Symbol());

        // This is a private name in the es6 spec, equal to '[Symbol.iterator]'
        // we're going to use an arbitrary _-prefixed name to make our shims
        // work properly with each other, even though we don't have full Iterator
        // support.  That is, `Array.from(map.keys())` will work, but we don't
        // pretend to export a "real" Iterator interface.
        var $iterator$ = Type.symbol(Symbol.iterator) ? Symbol.iterator : '_es6-shim iterator_';
        // Firefox ships a partial implementation using the name @@iterator.
        // https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
        // So use that name if we detect it.
        if (globals.Set && typeof new globals.Set()['@@iterator'] === 'function') {
          $iterator$ = '@@iterator';
        }

        // Reflect
        if (!globals.Reflect) {
          defineProperty(globals, 'Reflect', {}, true);
        }
        var Reflect = globals.Reflect;

        var $String = String;

        /* global document */
        var domAll = typeof document === 'undefined' || !document ? null : document.all;
        /* jshint eqnull:true */
        var isNullOrUndefined = domAll == null ? function isNullOrUndefined(x) {
          /* jshint eqnull:true */
          return x == null;
        } : function isNullOrUndefinedAndNotDocumentAll(x) {
          /* jshint eqnull:true */
          return x == null && x !== domAll;
        };

        var ES = {
          // http://www.ecma-international.org/ecma-262/6.0/#sec-call
          Call: function Call(F, V) {
            var args = arguments.length > 2 ? arguments[2] : [];
            if (!ES.IsCallable(F)) {
              throw new TypeError(F + ' is not a function');
            }
            return _apply(F, V, args);
          },

          RequireObjectCoercible: function (x, optMessage) {
            if (isNullOrUndefined(x)) {
              throw new TypeError(optMessage || 'Cannot call method on ' + x);
            }
            return x;
          },

          // This might miss the "(non-standard exotic and does not implement
          // [[Call]])" case from
          // http://www.ecma-international.org/ecma-262/6.0/#sec-typeof-operator-runtime-semantics-evaluation
          // but we can't find any evidence these objects exist in practice.
          // If we find some in the future, you could test `Object(x) === x`,
          // which is reliable according to
          // http://www.ecma-international.org/ecma-262/6.0/#sec-toobject
          // but is not well optimized by runtimes and creates an object
          // whenever it returns false, and thus is very slow.
          TypeIsObject: function (x) {
            if (x === void 0 || x === null || x === true || x === false) {
              return false;
            }
            return typeof x === 'function' || typeof x === 'object' || x === domAll;
          },

          ToObject: function (o, optMessage) {
            return Object(ES.RequireObjectCoercible(o, optMessage));
          },

          IsCallable: isCallable,

          IsConstructor: function (x) {
            // We can't tell callables from constructors in ES5
            return ES.IsCallable(x);
          },

          ToInt32: function (x) {
            return ES.ToNumber(x) >> 0;
          },

          ToUint32: function (x) {
            return ES.ToNumber(x) >>> 0;
          },

          ToNumber: function (value) {
            if (_toString(value) === '[object Symbol]') {
              throw new TypeError('Cannot convert a Symbol value to a number');
            }
            return +value;
          },

          ToInteger: function (value) {
            var number = ES.ToNumber(value);
            if (numberIsNaN(number)) {
              return 0;
            }
            if (number === 0 || !numberIsFinite(number)) {
              return number;
            }
            return (number > 0 ? 1 : -1) * _floor(_abs(number));
          },

          ToLength: function (value) {
            var len = ES.ToInteger(value);
            if (len <= 0) {
              return 0;
            } // includes converting -0 to +0
            if (len > Number.MAX_SAFE_INTEGER) {
              return Number.MAX_SAFE_INTEGER;
            }
            return len;
          },

          SameValue: function (a, b) {
            if (a === b) {
              // 0 === -0, but they are not identical.
              if (a === 0) {
                return 1 / a === 1 / b;
              }
              return true;
            }
            return numberIsNaN(a) && numberIsNaN(b);
          },

          SameValueZero: function (a, b) {
            // same as SameValue except for SameValueZero(+0, -0) == true
            return a === b || numberIsNaN(a) && numberIsNaN(b);
          },

          IsIterable: function (o) {
            return ES.TypeIsObject(o) && (typeof o[$iterator$] !== 'undefined' || isArguments(o));
          },

          GetIterator: function (o) {
            if (isArguments(o)) {
              // special case support for `arguments`
              return new ArrayIterator(o, 'value');
            }
            var itFn = ES.GetMethod(o, $iterator$);
            if (!ES.IsCallable(itFn)) {
              // Better diagnostics if itFn is null or undefined
              throw new TypeError('value is not an iterable');
            }
            var it = ES.Call(itFn, o);
            if (!ES.TypeIsObject(it)) {
              throw new TypeError('bad iterator');
            }
            return it;
          },

          GetMethod: function (o, p) {
            var func = ES.ToObject(o)[p];
            if (isNullOrUndefined(func)) {
              return void 0;
            }
            if (!ES.IsCallable(func)) {
              throw new TypeError('Method not callable: ' + p);
            }
            return func;
          },

          IteratorComplete: function (iterResult) {
            return !!iterResult.done;
          },

          IteratorClose: function (iterator, completionIsThrow) {
            var returnMethod = ES.GetMethod(iterator, 'return');
            if (returnMethod === void 0) {
              return;
            }
            var innerResult, innerException;
            try {
              innerResult = ES.Call(returnMethod, iterator);
            } catch (e) {
              innerException = e;
            }
            if (completionIsThrow) {
              return;
            }
            if (innerException) {
              throw innerException;
            }
            if (!ES.TypeIsObject(innerResult)) {
              throw new TypeError("Iterator's return method returned a non-object.");
            }
          },

          IteratorNext: function (it) {
            var result = arguments.length > 1 ? it.next(arguments[1]) : it.next();
            if (!ES.TypeIsObject(result)) {
              throw new TypeError('bad iterator');
            }
            return result;
          },

          IteratorStep: function (it) {
            var result = ES.IteratorNext(it);
            var done = ES.IteratorComplete(result);
            return done ? false : result;
          },

          Construct: function (C, args, newTarget, isES6internal) {
            var target = typeof newTarget === 'undefined' ? C : newTarget;

            if (!isES6internal && Reflect.construct) {
              // Try to use Reflect.construct if available
              return Reflect.construct(C, args, target);
            }
            // OK, we have to fake it.  This will only work if the
            // C.[[ConstructorKind]] == "base" -- but that's the only
            // kind we can make in ES5 code anyway.

            // OrdinaryCreateFromConstructor(target, "%ObjectPrototype%")
            var proto = target.prototype;
            if (!ES.TypeIsObject(proto)) {
              proto = Object.prototype;
            }
            var obj = create(proto);
            // Call the constructor.
            var result = ES.Call(C, obj, args);
            return ES.TypeIsObject(result) ? result : obj;
          },

          SpeciesConstructor: function (O, defaultConstructor) {
            var C = O.constructor;
            if (C === void 0) {
              return defaultConstructor;
            }
            if (!ES.TypeIsObject(C)) {
              throw new TypeError('Bad constructor');
            }
            var S = C[symbolSpecies];
            if (isNullOrUndefined(S)) {
              return defaultConstructor;
            }
            if (!ES.IsConstructor(S)) {
              throw new TypeError('Bad @@species');
            }
            return S;
          },

          CreateHTML: function (string, tag, attribute, value) {
            var S = ES.ToString(string);
            var p1 = '<' + tag;
            if (attribute !== '') {
              var V = ES.ToString(value);
              var escapedV = V.replace(/"/g, '&quot;');
              p1 += ' ' + attribute + '="' + escapedV + '"';
            }
            var p2 = p1 + '>';
            var p3 = p2 + S;
            return p3 + '</' + tag + '>';
          },

          IsRegExp: function IsRegExp(argument) {
            if (!ES.TypeIsObject(argument)) {
              return false;
            }
            var isRegExp = argument[Symbol.match];
            if (typeof isRegExp !== 'undefined') {
              return !!isRegExp;
            }
            return Type.regex(argument);
          },

          ToString: function ToString(string) {
            return $String(string);
          }
        };

        // Well-known Symbol shims
        if (supportsDescriptors && hasSymbols) {
          var defineWellKnownSymbol = function defineWellKnownSymbol(name) {
            if (Type.symbol(Symbol[name])) {
              return Symbol[name];
            }
            // eslint-disable-next-line no-restricted-properties
            var sym = Symbol['for']('Symbol.' + name);
            Object.defineProperty(Symbol, name, {
              configurable: false,
              enumerable: false,
              writable: false,
              value: sym
            });
            return sym;
          };
          if (!Type.symbol(Symbol.search)) {
            var symbolSearch = defineWellKnownSymbol('search');
            var originalSearch = String.prototype.search;
            defineProperty(RegExp.prototype, symbolSearch, function search(string) {
              return ES.Call(originalSearch, string, [this]);
            });
            var searchShim = function search(regexp) {
              var O = ES.RequireObjectCoercible(this);
              if (!isNullOrUndefined(regexp)) {
                var searcher = ES.GetMethod(regexp, symbolSearch);
                if (typeof searcher !== 'undefined') {
                  return ES.Call(searcher, regexp, [O]);
                }
              }
              return ES.Call(originalSearch, O, [ES.ToString(regexp)]);
            };
            overrideNative(String.prototype, 'search', searchShim);
          }
          if (!Type.symbol(Symbol.replace)) {
            var symbolReplace = defineWellKnownSymbol('replace');
            var originalReplace = String.prototype.replace;
            defineProperty(RegExp.prototype, symbolReplace, function replace(string, replaceValue) {
              return ES.Call(originalReplace, string, [this, replaceValue]);
            });
            var replaceShim = function replace(searchValue, replaceValue) {
              var O = ES.RequireObjectCoercible(this);
              if (!isNullOrUndefined(searchValue)) {
                var replacer = ES.GetMethod(searchValue, symbolReplace);
                if (typeof replacer !== 'undefined') {
                  return ES.Call(replacer, searchValue, [O, replaceValue]);
                }
              }
              return ES.Call(originalReplace, O, [ES.ToString(searchValue), replaceValue]);
            };
            overrideNative(String.prototype, 'replace', replaceShim);
          }
          if (!Type.symbol(Symbol.split)) {
            var symbolSplit = defineWellKnownSymbol('split');
            var originalSplit = String.prototype.split;
            defineProperty(RegExp.prototype, symbolSplit, function split(string, limit) {
              return ES.Call(originalSplit, string, [this, limit]);
            });
            var splitShim = function split(separator, limit) {
              var O = ES.RequireObjectCoercible(this);
              if (!isNullOrUndefined(separator)) {
                var splitter = ES.GetMethod(separator, symbolSplit);
                if (typeof splitter !== 'undefined') {
                  return ES.Call(splitter, separator, [O, limit]);
                }
              }
              return ES.Call(originalSplit, O, [ES.ToString(separator), limit]);
            };
            overrideNative(String.prototype, 'split', splitShim);
          }
          var symbolMatchExists = Type.symbol(Symbol.match);
          var stringMatchIgnoresSymbolMatch = symbolMatchExists && function () {
            // Firefox 41, through Nightly 45 has Symbol.match, but String#match ignores it.
            // Firefox 40 and below have Symbol.match but String#match works fine.
            var o = {};
            o[Symbol.match] = function () {
              return 42;
            };
            return 'a'.match(o) !== 42;
          }();
          if (!symbolMatchExists || stringMatchIgnoresSymbolMatch) {
            var symbolMatch = defineWellKnownSymbol('match');

            var originalMatch = String.prototype.match;
            defineProperty(RegExp.prototype, symbolMatch, function match(string) {
              return ES.Call(originalMatch, string, [this]);
            });

            var matchShim = function match(regexp) {
              var O = ES.RequireObjectCoercible(this);
              if (!isNullOrUndefined(regexp)) {
                var matcher = ES.GetMethod(regexp, symbolMatch);
                if (typeof matcher !== 'undefined') {
                  return ES.Call(matcher, regexp, [O]);
                }
              }
              return ES.Call(originalMatch, O, [ES.ToString(regexp)]);
            };
            overrideNative(String.prototype, 'match', matchShim);
          }
        }

        var wrapConstructor = function wrapConstructor(original, replacement, keysToSkip) {
          Value.preserveToString(replacement, original);
          if (Object.setPrototypeOf) {
            // sets up proper prototype chain where possible
            Object.setPrototypeOf(original, replacement);
          }
          if (supportsDescriptors) {
            _forEach(Object.getOwnPropertyNames(original), function (key) {
              if (key in noop || keysToSkip[key]) {
                return;
              }
              Value.proxy(original, key, replacement);
            });
          } else {
            _forEach(Object.keys(original), function (key) {
              if (key in noop || keysToSkip[key]) {
                return;
              }
              replacement[key] = original[key];
            });
          }
          replacement.prototype = original.prototype;
          Value.redefine(original.prototype, 'constructor', replacement);
        };

        var defaultSpeciesGetter = function () {
          return this;
        };
        var addDefaultSpecies = function (C) {
          if (supportsDescriptors && !_hasOwnProperty(C, symbolSpecies)) {
            Value.getter(C, symbolSpecies, defaultSpeciesGetter);
          }
        };

        var addIterator = function (prototype, impl) {
          var implementation = impl || function iterator() {
            return this;
          };
          defineProperty(prototype, $iterator$, implementation);
          if (!prototype[$iterator$] && Type.symbol($iterator$)) {
            // implementations are buggy when $iterator$ is a Symbol
            prototype[$iterator$] = implementation;
          }
        };

        var createDataProperty = function createDataProperty(object, name, value) {
          if (supportsDescriptors) {
            Object.defineProperty(object, name, {
              configurable: true,
              enumerable: true,
              writable: true,
              value: value
            });
          } else {
            object[name] = value;
          }
        };
        var createDataPropertyOrThrow = function createDataPropertyOrThrow(object, name, value) {
          createDataProperty(object, name, value);
          if (!ES.SameValue(object[name], value)) {
            throw new TypeError('property is nonconfigurable');
          }
        };

        var emulateES6construct = function (o, defaultNewTarget, defaultProto, slots) {
          // This is an es5 approximation to es6 construct semantics.  in es6,
          // 'new Foo' invokes Foo.[[Construct]] which (for almost all objects)
          // just sets the internal variable NewTarget (in es6 syntax `new.target`)
          // to Foo and then returns Foo().

          // Many ES6 object then have constructors of the form:
          // 1. If NewTarget is undefined, throw a TypeError exception
          // 2. Let xxx by OrdinaryCreateFromConstructor(NewTarget, yyy, zzz)

          // So we're going to emulate those first two steps.
          if (!ES.TypeIsObject(o)) {
            throw new TypeError('Constructor requires `new`: ' + defaultNewTarget.name);
          }
          var proto = defaultNewTarget.prototype;
          if (!ES.TypeIsObject(proto)) {
            proto = defaultProto;
          }
          var obj = create(proto);
          for (var name in slots) {
            if (_hasOwnProperty(slots, name)) {
              var value = slots[name];
              defineProperty(obj, name, value, true);
            }
          }
          return obj;
        };

        // Firefox 31 reports this function's length as 0
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1062484
        if (String.fromCodePoint && String.fromCodePoint.length !== 1) {
          var originalFromCodePoint = String.fromCodePoint;
          overrideNative(String, 'fromCodePoint', function fromCodePoint(codePoints) {
            return ES.Call(originalFromCodePoint, this, arguments);
          });
        }

        var StringShims = {
          fromCodePoint: function fromCodePoint(codePoints) {
            var result = [];
            var next;
            for (var i = 0, length = arguments.length; i < length; i++) {
              next = Number(arguments[i]);
              if (!ES.SameValue(next, ES.ToInteger(next)) || next < 0 || next > 0x10FFFF) {
                throw new RangeError('Invalid code point ' + next);
              }

              if (next < 0x10000) {
                _push(result, String.fromCharCode(next));
              } else {
                next -= 0x10000;
                _push(result, String.fromCharCode((next >> 10) + 0xD800));
                _push(result, String.fromCharCode(next % 0x400 + 0xDC00));
              }
            }
            return result.join('');
          },

          raw: function raw(callSite) {
            var cooked = ES.ToObject(callSite, 'bad callSite');
            var rawString = ES.ToObject(cooked.raw, 'bad raw value');
            var len = rawString.length;
            var literalsegments = ES.ToLength(len);
            if (literalsegments <= 0) {
              return '';
            }

            var stringElements = [];
            var nextIndex = 0;
            var nextKey, next, nextSeg, nextSub;
            while (nextIndex < literalsegments) {
              nextKey = ES.ToString(nextIndex);
              nextSeg = ES.ToString(rawString[nextKey]);
              _push(stringElements, nextSeg);
              if (nextIndex + 1 >= literalsegments) {
                break;
              }
              next = nextIndex + 1 < arguments.length ? arguments[nextIndex + 1] : '';
              nextSub = ES.ToString(next);
              _push(stringElements, nextSub);
              nextIndex += 1;
            }
            return stringElements.join('');
          }
        };
        if (String.raw && String.raw({ raw: { 0: 'x', 1: 'y', length: 2 } }) !== 'xy') {
          // IE 11 TP has a broken String.raw implementation
          overrideNative(String, 'raw', StringShims.raw);
        }
        defineProperties(String, StringShims);

        // Fast repeat, uses the `Exponentiation by squaring` algorithm.
        // Perf: http://jsperf.com/string-repeat2/2
        var stringRepeat = function repeat(s, times) {
          if (times < 1) {
            return '';
          }
          if (times % 2) {
            return repeat(s, times - 1) + s;
          }
          var half = repeat(s, times / 2);
          return half + half;
        };
        var stringMaxLength = Infinity;

        var StringPrototypeShims = {
          repeat: function repeat(times) {
            var thisStr = ES.ToString(ES.RequireObjectCoercible(this));
            var numTimes = ES.ToInteger(times);
            if (numTimes < 0 || numTimes >= stringMaxLength) {
              throw new RangeError('repeat count must be less than infinity and not overflow maximum string size');
            }
            return stringRepeat(thisStr, numTimes);
          },

          startsWith: function startsWith(searchString) {
            var S = ES.ToString(ES.RequireObjectCoercible(this));
            if (ES.IsRegExp(searchString)) {
              throw new TypeError('Cannot call method "startsWith" with a regex');
            }
            var searchStr = ES.ToString(searchString);
            var position;
            if (arguments.length > 1) {
              position = arguments[1];
            }
            var start = _max(ES.ToInteger(position), 0);
            return _strSlice(S, start, start + searchStr.length) === searchStr;
          },

          endsWith: function endsWith(searchString) {
            var S = ES.ToString(ES.RequireObjectCoercible(this));
            if (ES.IsRegExp(searchString)) {
              throw new TypeError('Cannot call method "endsWith" with a regex');
            }
            var searchStr = ES.ToString(searchString);
            var len = S.length;
            var endPosition;
            if (arguments.length > 1) {
              endPosition = arguments[1];
            }
            var pos = typeof endPosition === 'undefined' ? len : ES.ToInteger(endPosition);
            var end = _min(_max(pos, 0), len);
            return _strSlice(S, end - searchStr.length, end) === searchStr;
          },

          includes: function includes(searchString) {
            if (ES.IsRegExp(searchString)) {
              throw new TypeError('"includes" does not accept a RegExp');
            }
            var searchStr = ES.ToString(searchString);
            var position;
            if (arguments.length > 1) {
              position = arguments[1];
            }
            // Somehow this trick makes method 100% compat with the spec.
            return _indexOf(this, searchStr, position) !== -1;
          },

          codePointAt: function codePointAt(pos) {
            var thisStr = ES.ToString(ES.RequireObjectCoercible(this));
            var position = ES.ToInteger(pos);
            var length = thisStr.length;
            if (position >= 0 && position < length) {
              var first = thisStr.charCodeAt(position);
              var isEnd = position + 1 === length;
              if (first < 0xD800 || first > 0xDBFF || isEnd) {
                return first;
              }
              var second = thisStr.charCodeAt(position + 1);
              if (second < 0xDC00 || second > 0xDFFF) {
                return first;
              }
              return (first - 0xD800) * 1024 + (second - 0xDC00) + 0x10000;
            }
          }
        };
        if (String.prototype.includes && 'a'.includes('a', Infinity) !== false) {
          overrideNative(String.prototype, 'includes', StringPrototypeShims.includes);
        }

        if (String.prototype.startsWith && String.prototype.endsWith) {
          var startsWithRejectsRegex = throwsError(function () {
            /* throws if spec-compliant */
            '/a/'.startsWith(/a/);
          });
          var startsWithHandlesInfinity = valueOrFalseIfThrows(function () {
            return 'abc'.startsWith('a', Infinity) === false;
          });
          if (!startsWithRejectsRegex || !startsWithHandlesInfinity) {
            // Firefox (< 37?) and IE 11 TP have a noncompliant startsWith implementation
            overrideNative(String.prototype, 'startsWith', StringPrototypeShims.startsWith);
            overrideNative(String.prototype, 'endsWith', StringPrototypeShims.endsWith);
          }
        }
        if (hasSymbols) {
          var startsWithSupportsSymbolMatch = valueOrFalseIfThrows(function () {
            var re = /a/;
            re[Symbol.match] = false;
            return '/a/'.startsWith(re);
          });
          if (!startsWithSupportsSymbolMatch) {
            overrideNative(String.prototype, 'startsWith', StringPrototypeShims.startsWith);
          }
          var endsWithSupportsSymbolMatch = valueOrFalseIfThrows(function () {
            var re = /a/;
            re[Symbol.match] = false;
            return '/a/'.endsWith(re);
          });
          if (!endsWithSupportsSymbolMatch) {
            overrideNative(String.prototype, 'endsWith', StringPrototypeShims.endsWith);
          }
          var includesSupportsSymbolMatch = valueOrFalseIfThrows(function () {
            var re = /a/;
            re[Symbol.match] = false;
            return '/a/'.includes(re);
          });
          if (!includesSupportsSymbolMatch) {
            overrideNative(String.prototype, 'includes', StringPrototypeShims.includes);
          }
        }

        defineProperties(String.prototype, StringPrototypeShims);

        // whitespace from: http://es5.github.io/#x15.5.4.20
        // implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
        var ws = ['\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003', '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028', '\u2029\uFEFF'].join('');
        var trimRegexp = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
        var trimShim = function trim() {
          return ES.ToString(ES.RequireObjectCoercible(this)).replace(trimRegexp, '');
        };
        var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
        var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
        var isBadHexRegex = /^[-+]0x[0-9a-f]+$/i;
        var hasStringTrimBug = nonWS.trim().length !== nonWS.length;
        defineProperty(String.prototype, 'trim', trimShim, hasStringTrimBug);

        // Given an argument x, it will return an IteratorResult object,
        // with value set to x and done to false.
        // Given no arguments, it will return an iterator completion object.
        var iteratorResult = function (x) {
          return { value: x, done: arguments.length === 0 };
        };

        // see http://www.ecma-international.org/ecma-262/6.0/#sec-string.prototype-@@iterator
        var StringIterator = function (s) {
          ES.RequireObjectCoercible(s);
          this._s = ES.ToString(s);
          this._i = 0;
        };
        StringIterator.prototype.next = function () {
          var s = this._s;
          var i = this._i;
          if (typeof s === 'undefined' || i >= s.length) {
            this._s = void 0;
            return iteratorResult();
          }
          var first = s.charCodeAt(i);
          var second, len;
          if (first < 0xD800 || first > 0xDBFF || i + 1 === s.length) {
            len = 1;
          } else {
            second = s.charCodeAt(i + 1);
            len = second < 0xDC00 || second > 0xDFFF ? 1 : 2;
          }
          this._i = i + len;
          return iteratorResult(s.substr(i, len));
        };
        addIterator(StringIterator.prototype);
        addIterator(String.prototype, function () {
          return new StringIterator(this);
        });

        var ArrayShims = {
          from: function from(items) {
            var C = this;
            var mapFn;
            if (arguments.length > 1) {
              mapFn = arguments[1];
            }
            var mapping, T;
            if (typeof mapFn === 'undefined') {
              mapping = false;
            } else {
              if (!ES.IsCallable(mapFn)) {
                throw new TypeError('Array.from: when provided, the second argument must be a function');
              }
              if (arguments.length > 2) {
                T = arguments[2];
              }
              mapping = true;
            }

            // Note that that Arrays will use ArrayIterator:
            // https://bugs.ecmascript.org/show_bug.cgi?id=2416
            var usingIterator = typeof (isArguments(items) || ES.GetMethod(items, $iterator$)) !== 'undefined';

            var length, result, i;
            if (usingIterator) {
              result = ES.IsConstructor(C) ? Object(new C()) : [];
              var iterator = ES.GetIterator(items);
              var next, nextValue;

              i = 0;
              while (true) {
                next = ES.IteratorStep(iterator);
                if (next === false) {
                  break;
                }
                nextValue = next.value;
                try {
                  if (mapping) {
                    nextValue = typeof T === 'undefined' ? mapFn(nextValue, i) : _call(mapFn, T, nextValue, i);
                  }
                  result[i] = nextValue;
                } catch (e) {
                  ES.IteratorClose(iterator, true);
                  throw e;
                }
                i += 1;
              }
              length = i;
            } else {
              var arrayLike = ES.ToObject(items);
              length = ES.ToLength(arrayLike.length);
              result = ES.IsConstructor(C) ? Object(new C(length)) : new Array(length);
              var value;
              for (i = 0; i < length; ++i) {
                value = arrayLike[i];
                if (mapping) {
                  value = typeof T === 'undefined' ? mapFn(value, i) : _call(mapFn, T, value, i);
                }
                createDataPropertyOrThrow(result, i, value);
              }
            }

            result.length = length;
            return result;
          },

          of: function of() {
            var len = arguments.length;
            var C = this;
            var A = isArray(C) || !ES.IsCallable(C) ? new Array(len) : ES.Construct(C, [len]);
            for (var k = 0; k < len; ++k) {
              createDataPropertyOrThrow(A, k, arguments[k]);
            }
            A.length = len;
            return A;
          }
        };
        defineProperties(Array, ArrayShims);
        addDefaultSpecies(Array);

        // Our ArrayIterator is private; see
        // https://github.com/paulmillr/es6-shim/issues/252
        ArrayIterator = function (array, kind) {
          this.i = 0;
          this.array = array;
          this.kind = kind;
        };

        defineProperties(ArrayIterator.prototype, {
          next: function () {
            var i = this.i;
            var array = this.array;
            if (!(this instanceof ArrayIterator)) {
              throw new TypeError('Not an ArrayIterator');
            }
            if (typeof array !== 'undefined') {
              var len = ES.ToLength(array.length);
              for (; i < len; i++) {
                var kind = this.kind;
                var retval;
                if (kind === 'key') {
                  retval = i;
                } else if (kind === 'value') {
                  retval = array[i];
                } else if (kind === 'entry') {
                  retval = [i, array[i]];
                }
                this.i = i + 1;
                return iteratorResult(retval);
              }
            }
            this.array = void 0;
            return iteratorResult();
          }
        });
        addIterator(ArrayIterator.prototype);

        /*
          var orderKeys = function orderKeys(a, b) {
            var aNumeric = String(ES.ToInteger(a)) === a;
            var bNumeric = String(ES.ToInteger(b)) === b;
            if (aNumeric && bNumeric) {
              return b - a;
            } else if (aNumeric && !bNumeric) {
              return -1;
            } else if (!aNumeric && bNumeric) {
              return 1;
            } else {
              return a.localeCompare(b);
            }
          };
        
          var getAllKeys = function getAllKeys(object) {
            var ownKeys = [];
            var keys = [];
        
            for (var key in object) {
              _push(_hasOwnProperty(object, key) ? ownKeys : keys, key);
            }
            _sort(ownKeys, orderKeys);
            _sort(keys, orderKeys);
        
            return _concat(ownKeys, keys);
          };
          */

        // note: this is positioned here because it depends on ArrayIterator
        var arrayOfSupportsSubclassing = Array.of === ArrayShims.of || function () {
          // Detects a bug in Webkit nightly r181886
          var Foo = function Foo(len) {
            this.length = len;
          };
          Foo.prototype = [];
          var fooArr = Array.of.apply(Foo, [1, 2]);
          return fooArr instanceof Foo && fooArr.length === 2;
        }();
        if (!arrayOfSupportsSubclassing) {
          overrideNative(Array, 'of', ArrayShims.of);
        }

        var ArrayPrototypeShims = {
          copyWithin: function copyWithin(target, start) {
            var o = ES.ToObject(this);
            var len = ES.ToLength(o.length);
            var relativeTarget = ES.ToInteger(target);
            var relativeStart = ES.ToInteger(start);
            var to = relativeTarget < 0 ? _max(len + relativeTarget, 0) : _min(relativeTarget, len);
            var from = relativeStart < 0 ? _max(len + relativeStart, 0) : _min(relativeStart, len);
            var end;
            if (arguments.length > 2) {
              end = arguments[2];
            }
            var relativeEnd = typeof end === 'undefined' ? len : ES.ToInteger(end);
            var finalItem = relativeEnd < 0 ? _max(len + relativeEnd, 0) : _min(relativeEnd, len);
            var count = _min(finalItem - from, len - to);
            var direction = 1;
            if (from < to && to < from + count) {
              direction = -1;
              from += count - 1;
              to += count - 1;
            }
            while (count > 0) {
              if (from in o) {
                o[to] = o[from];
              } else {
                delete o[to];
              }
              from += direction;
              to += direction;
              count -= 1;
            }
            return o;
          },

          fill: function fill(value) {
            var start;
            if (arguments.length > 1) {
              start = arguments[1];
            }
            var end;
            if (arguments.length > 2) {
              end = arguments[2];
            }
            var O = ES.ToObject(this);
            var len = ES.ToLength(O.length);
            start = ES.ToInteger(typeof start === 'undefined' ? 0 : start);
            end = ES.ToInteger(typeof end === 'undefined' ? len : end);

            var relativeStart = start < 0 ? _max(len + start, 0) : _min(start, len);
            var relativeEnd = end < 0 ? len + end : end;

            for (var i = relativeStart; i < len && i < relativeEnd; ++i) {
              O[i] = value;
            }
            return O;
          },

          find: function find(predicate) {
            var list = ES.ToObject(this);
            var length = ES.ToLength(list.length);
            if (!ES.IsCallable(predicate)) {
              throw new TypeError('Array#find: predicate must be a function');
            }
            var thisArg = arguments.length > 1 ? arguments[1] : null;
            for (var i = 0, value; i < length; i++) {
              value = list[i];
              if (thisArg) {
                if (_call(predicate, thisArg, value, i, list)) {
                  return value;
                }
              } else if (predicate(value, i, list)) {
                return value;
              }
            }
          },

          findIndex: function findIndex(predicate) {
            var list = ES.ToObject(this);
            var length = ES.ToLength(list.length);
            if (!ES.IsCallable(predicate)) {
              throw new TypeError('Array#findIndex: predicate must be a function');
            }
            var thisArg = arguments.length > 1 ? arguments[1] : null;
            for (var i = 0; i < length; i++) {
              if (thisArg) {
                if (_call(predicate, thisArg, list[i], i, list)) {
                  return i;
                }
              } else if (predicate(list[i], i, list)) {
                return i;
              }
            }
            return -1;
          },

          keys: function keys() {
            return new ArrayIterator(this, 'key');
          },

          values: function values() {
            return new ArrayIterator(this, 'value');
          },

          entries: function entries() {
            return new ArrayIterator(this, 'entry');
          }
        };
        // Safari 7.1 defines Array#keys and Array#entries natively,
        // but the resulting ArrayIterator objects don't have a "next" method.
        if (Array.prototype.keys && !ES.IsCallable([1].keys().next)) {
          delete Array.prototype.keys;
        }
        if (Array.prototype.entries && !ES.IsCallable([1].entries().next)) {
          delete Array.prototype.entries;
        }

        // Chrome 38 defines Array#keys and Array#entries, and Array#@@iterator, but not Array#values
        if (Array.prototype.keys && Array.prototype.entries && !Array.prototype.values && Array.prototype[$iterator$]) {
          defineProperties(Array.prototype, {
            values: Array.prototype[$iterator$]
          });
          if (Type.symbol(Symbol.unscopables)) {
            Array.prototype[Symbol.unscopables].values = true;
          }
        }
        // Chrome 40 defines Array#values with the incorrect name, although Array#{keys,entries} have the correct name
        if (functionsHaveNames && Array.prototype.values && Array.prototype.values.name !== 'values') {
          var originalArrayPrototypeValues = Array.prototype.values;
          overrideNative(Array.prototype, 'values', function values() {
            return ES.Call(originalArrayPrototypeValues, this, arguments);
          });
          defineProperty(Array.prototype, $iterator$, Array.prototype.values, true);
        }
        defineProperties(Array.prototype, ArrayPrototypeShims);

        if (1 / [true].indexOf(true, -0) < 0) {
          // indexOf when given a position arg of -0 should return +0.
          // https://github.com/tc39/ecma262/pull/316
          defineProperty(Array.prototype, 'indexOf', function indexOf(searchElement) {
            var value = _arrayIndexOfApply(this, arguments);
            if (value === 0 && 1 / value < 0) {
              return 0;
            }
            return value;
          }, true);
        }

        addIterator(Array.prototype, function () {
          return this.values();
        });
        // Chrome defines keys/values/entries on Array, but doesn't give us
        // any way to identify its iterator.  So add our own shimmed field.
        if (Object.getPrototypeOf) {
          addIterator(Object.getPrototypeOf([].values()));
        }

        // note: this is positioned here because it relies on Array#entries
        var arrayFromSwallowsNegativeLengths = function () {
          // Detects a Firefox bug in v32
          // https://bugzilla.mozilla.org/show_bug.cgi?id=1063993
          return valueOrFalseIfThrows(function () {
            return Array.from({ length: -1 }).length === 0;
          });
        }();
        var arrayFromHandlesIterables = function () {
          // Detects a bug in Webkit nightly r181886
          var arr = Array.from([0].entries());
          return arr.length === 1 && isArray(arr[0]) && arr[0][0] === 0 && arr[0][1] === 0;
        }();
        if (!arrayFromSwallowsNegativeLengths || !arrayFromHandlesIterables) {
          overrideNative(Array, 'from', ArrayShims.from);
        }
        var arrayFromHandlesUndefinedMapFunction = function () {
          // Microsoft Edge v0.11 throws if the mapFn argument is *provided* but undefined,
          // but the spec doesn't care if it's provided or not - undefined doesn't throw.
          return valueOrFalseIfThrows(function () {
            return Array.from([0], void 0);
          });
        }();
        if (!arrayFromHandlesUndefinedMapFunction) {
          var origArrayFrom = Array.from;
          overrideNative(Array, 'from', function from(items) {
            if (arguments.length > 1 && typeof arguments[1] !== 'undefined') {
              return ES.Call(origArrayFrom, this, arguments);
            } else {
              return _call(origArrayFrom, this, items);
            }
          });
        }

        var int32sAsOne = -(Math.pow(2, 32) - 1);
        var toLengthsCorrectly = function (method, reversed) {
          var obj = { length: int32sAsOne };
          obj[reversed ? (obj.length >>> 0) - 1 : 0] = true;
          return valueOrFalseIfThrows(function () {
            _call(method, obj, function () {
              // note: in nonconforming browsers, this will be called
              // -1 >>> 0 times, which is 4294967295, so the throw matters.
              throw new RangeError('should not reach here');
            }, []);
            return true;
          });
        };
        if (!toLengthsCorrectly(Array.prototype.forEach)) {
          var originalForEach = Array.prototype.forEach;
          overrideNative(Array.prototype, 'forEach', function forEach(callbackFn) {
            return ES.Call(originalForEach, this.length >= 0 ? this : [], arguments);
          }, true);
        }
        if (!toLengthsCorrectly(Array.prototype.map)) {
          var originalMap = Array.prototype.map;
          overrideNative(Array.prototype, 'map', function map(callbackFn) {
            return ES.Call(originalMap, this.length >= 0 ? this : [], arguments);
          }, true);
        }
        if (!toLengthsCorrectly(Array.prototype.filter)) {
          var originalFilter = Array.prototype.filter;
          overrideNative(Array.prototype, 'filter', function filter(callbackFn) {
            return ES.Call(originalFilter, this.length >= 0 ? this : [], arguments);
          }, true);
        }
        if (!toLengthsCorrectly(Array.prototype.some)) {
          var originalSome = Array.prototype.some;
          overrideNative(Array.prototype, 'some', function some(callbackFn) {
            return ES.Call(originalSome, this.length >= 0 ? this : [], arguments);
          }, true);
        }
        if (!toLengthsCorrectly(Array.prototype.every)) {
          var originalEvery = Array.prototype.every;
          overrideNative(Array.prototype, 'every', function every(callbackFn) {
            return ES.Call(originalEvery, this.length >= 0 ? this : [], arguments);
          }, true);
        }
        if (!toLengthsCorrectly(Array.prototype.reduce)) {
          var originalReduce = Array.prototype.reduce;
          overrideNative(Array.prototype, 'reduce', function reduce(callbackFn) {
            return ES.Call(originalReduce, this.length >= 0 ? this : [], arguments);
          }, true);
        }
        if (!toLengthsCorrectly(Array.prototype.reduceRight, true)) {
          var originalReduceRight = Array.prototype.reduceRight;
          overrideNative(Array.prototype, 'reduceRight', function reduceRight(callbackFn) {
            return ES.Call(originalReduceRight, this.length >= 0 ? this : [], arguments);
          }, true);
        }

        var lacksOctalSupport = Number('0o10') !== 8;
        var lacksBinarySupport = Number('0b10') !== 2;
        var trimsNonWhitespace = _some(nonWS, function (c) {
          return Number(c + 0 + c) === 0;
        });
        if (lacksOctalSupport || lacksBinarySupport || trimsNonWhitespace) {
          var OrigNumber = Number;
          var binaryRegex = /^0b[01]+$/i;
          var octalRegex = /^0o[0-7]+$/i;
          // Note that in IE 8, RegExp.prototype.test doesn't seem to exist: ie, "test" is an own property of regexes. wtf.
          var isBinary = binaryRegex.test.bind(binaryRegex);
          var isOctal = octalRegex.test.bind(octalRegex);
          var toPrimitive = function (O) {
            // need to replace this with `es-to-primitive/es6`
            var result;
            if (typeof O.valueOf === 'function') {
              result = O.valueOf();
              if (Type.primitive(result)) {
                return result;
              }
            }
            if (typeof O.toString === 'function') {
              result = O.toString();
              if (Type.primitive(result)) {
                return result;
              }
            }
            throw new TypeError('No default value');
          };
          var hasNonWS = nonWSregex.test.bind(nonWSregex);
          var isBadHex = isBadHexRegex.test.bind(isBadHexRegex);
          var NumberShim = function () {
            // this is wrapped in an IIFE because of IE 6-8's wacky scoping issues with named function expressions.
            var NumberShim = function Number(value) {
              var primValue;
              if (arguments.length > 0) {
                primValue = Type.primitive(value) ? value : toPrimitive(value, 'number');
              } else {
                primValue = 0;
              }
              if (typeof primValue === 'string') {
                primValue = ES.Call(trimShim, primValue);
                if (isBinary(primValue)) {
                  primValue = parseInt(_strSlice(primValue, 2), 2);
                } else if (isOctal(primValue)) {
                  primValue = parseInt(_strSlice(primValue, 2), 8);
                } else if (hasNonWS(primValue) || isBadHex(primValue)) {
                  primValue = NaN;
                }
              }
              var receiver = this;
              var valueOfSucceeds = valueOrFalseIfThrows(function () {
                OrigNumber.prototype.valueOf.call(receiver);
                return true;
              });
              if (receiver instanceof NumberShim && !valueOfSucceeds) {
                return new OrigNumber(primValue);
              }
              /* jshint newcap: false */
              return OrigNumber(primValue);
              /* jshint newcap: true */
            };
            return NumberShim;
          }();
          wrapConstructor(OrigNumber, NumberShim, {});
          // this is necessary for ES3 browsers, where these properties are non-enumerable.
          defineProperties(NumberShim, {
            NaN: OrigNumber.NaN,
            MAX_VALUE: OrigNumber.MAX_VALUE,
            MIN_VALUE: OrigNumber.MIN_VALUE,
            NEGATIVE_INFINITY: OrigNumber.NEGATIVE_INFINITY,
            POSITIVE_INFINITY: OrigNumber.POSITIVE_INFINITY
          });
          /* globals Number: true */
          /* eslint-disable no-undef, no-global-assign */
          /* jshint -W020 */
          Number = NumberShim;
          Value.redefine(globals, 'Number', NumberShim);
          /* jshint +W020 */
          /* eslint-enable no-undef, no-global-assign */
          /* globals Number: false */
        }

        var maxSafeInteger = Math.pow(2, 53) - 1;
        defineProperties(Number, {
          MAX_SAFE_INTEGER: maxSafeInteger,
          MIN_SAFE_INTEGER: -maxSafeInteger,
          EPSILON: 2.220446049250313e-16,

          parseInt: globals.parseInt,
          parseFloat: globals.parseFloat,

          isFinite: numberIsFinite,

          isInteger: function isInteger(value) {
            return numberIsFinite(value) && ES.ToInteger(value) === value;
          },

          isSafeInteger: function isSafeInteger(value) {
            return Number.isInteger(value) && _abs(value) <= Number.MAX_SAFE_INTEGER;
          },

          isNaN: numberIsNaN
        });
        // Firefox 37 has a conforming Number.parseInt, but it's not === to the global parseInt (fixed in v40)
        defineProperty(Number, 'parseInt', globals.parseInt, Number.parseInt !== globals.parseInt);

        // Work around bugs in Array#find and Array#findIndex -- early
        // implementations skipped holes in sparse arrays. (Note that the
        // implementations of find/findIndex indirectly use shimmed
        // methods of Number, so this test has to happen down here.)
        /*jshint elision: true */
        /* eslint-disable no-sparse-arrays */
        if ([, 1].find(function () {
          return true;
        }) === 1) {
          overrideNative(Array.prototype, 'find', ArrayPrototypeShims.find);
        }
        if ([, 1].findIndex(function () {
          return true;
        }) !== 0) {
          overrideNative(Array.prototype, 'findIndex', ArrayPrototypeShims.findIndex);
        }
        /* eslint-enable no-sparse-arrays */
        /*jshint elision: false */

        var isEnumerableOn = Function.bind.call(Function.bind, Object.prototype.propertyIsEnumerable);
        var ensureEnumerable = function ensureEnumerable(obj, prop) {
          if (supportsDescriptors && isEnumerableOn(obj, prop)) {
            Object.defineProperty(obj, prop, { enumerable: false });
          }
        };
        var sliceArgs = function sliceArgs() {
          // per https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
          // and https://gist.github.com/WebReflection/4327762cb87a8c634a29
          var initial = Number(this);
          var len = arguments.length;
          var desiredArgCount = len - initial;
          var args = new Array(desiredArgCount < 0 ? 0 : desiredArgCount);
          for (var i = initial; i < len; ++i) {
            args[i - initial] = arguments[i];
          }
          return args;
        };
        var assignTo = function assignTo(source) {
          return function assignToSource(target, key) {
            target[key] = source[key];
            return target;
          };
        };
        var assignReducer = function (target, source) {
          var sourceKeys = keys(Object(source));
          var symbols;
          if (ES.IsCallable(Object.getOwnPropertySymbols)) {
            symbols = _filter(Object.getOwnPropertySymbols(Object(source)), isEnumerableOn(source));
          }
          return _reduce(_concat(sourceKeys, symbols || []), assignTo(source), target);
        };

        var ObjectShims = {
          // 19.1.3.1
          assign: function (target, source) {
            var to = ES.ToObject(target, 'Cannot convert undefined or null to object');
            return _reduce(ES.Call(sliceArgs, 1, arguments), assignReducer, to);
          },

          // Added in WebKit in https://bugs.webkit.org/show_bug.cgi?id=143865
          is: function is(a, b) {
            return ES.SameValue(a, b);
          }
        };
        var assignHasPendingExceptions = Object.assign && Object.preventExtensions && function () {
          // Firefox 37 still has "pending exception" logic in its Object.assign implementation,
          // which is 72% slower than our shim, and Firefox 40's native implementation.
          var thrower = Object.preventExtensions({ 1: 2 });
          try {
            Object.assign(thrower, 'xy');
          } catch (e) {
            return thrower[1] === 'y';
          }
        }();
        if (assignHasPendingExceptions) {
          overrideNative(Object, 'assign', ObjectShims.assign);
        }
        defineProperties(Object, ObjectShims);

        if (supportsDescriptors) {
          var ES5ObjectShims = {
            // 19.1.3.9
            // shim from https://gist.github.com/WebReflection/5593554
            setPrototypeOf: function (Object, magic) {
              var set;

              var checkArgs = function (O, proto) {
                if (!ES.TypeIsObject(O)) {
                  throw new TypeError('cannot set prototype on a non-object');
                }
                if (!(proto === null || ES.TypeIsObject(proto))) {
                  throw new TypeError('can only set prototype to an object or null' + proto);
                }
              };

              var setPrototypeOf = function (O, proto) {
                checkArgs(O, proto);
                _call(set, O, proto);
                return O;
              };

              try {
                // this works already in Firefox and Safari
                set = Object.getOwnPropertyDescriptor(Object.prototype, magic).set;
                _call(set, {}, null);
              } catch (e) {
                if (Object.prototype !== {}[magic]) {
                  // IE < 11 cannot be shimmed
                  return;
                }
                // probably Chrome or some old Mobile stock browser
                set = function (proto) {
                  this[magic] = proto;
                };
                // please note that this will **not** work
                // in those browsers that do not inherit
                // __proto__ by mistake from Object.prototype
                // in these cases we should probably throw an error
                // or at least be informed about the issue
                setPrototypeOf.polyfill = setPrototypeOf(setPrototypeOf({}, null), Object.prototype) instanceof Object;
                // setPrototypeOf.polyfill === true means it works as meant
                // setPrototypeOf.polyfill === false means it's not 100% reliable
                // setPrototypeOf.polyfill === undefined
                // or
                // setPrototypeOf.polyfill ==  null means it's not a polyfill
                // which means it works as expected
                // we can even delete Object.prototype.__proto__;
              }
              return setPrototypeOf;
            }(Object, '__proto__')
          };

          defineProperties(Object, ES5ObjectShims);
        }

        // Workaround bug in Opera 12 where setPrototypeOf(x, null) doesn't work,
        // but Object.create(null) does.
        if (Object.setPrototypeOf && Object.getPrototypeOf && Object.getPrototypeOf(Object.setPrototypeOf({}, null)) !== null && Object.getPrototypeOf(Object.create(null)) === null) {
          (function () {
            var FAKENULL = Object.create(null);
            var gpo = Object.getPrototypeOf;
            var spo = Object.setPrototypeOf;
            Object.getPrototypeOf = function (o) {
              var result = gpo(o);
              return result === FAKENULL ? null : result;
            };
            Object.setPrototypeOf = function (o, p) {
              var proto = p === null ? FAKENULL : p;
              return spo(o, proto);
            };
            Object.setPrototypeOf.polyfill = false;
          })();
        }

        var objectKeysAcceptsPrimitives = !throwsError(function () {
          Object.keys('foo');
        });
        if (!objectKeysAcceptsPrimitives) {
          var originalObjectKeys = Object.keys;
          overrideNative(Object, 'keys', function keys(value) {
            return originalObjectKeys(ES.ToObject(value));
          });
          keys = Object.keys;
        }
        var objectKeysRejectsRegex = throwsError(function () {
          Object.keys(/a/g);
        });
        if (objectKeysRejectsRegex) {
          var regexRejectingObjectKeys = Object.keys;
          overrideNative(Object, 'keys', function keys(value) {
            if (Type.regex(value)) {
              var regexKeys = [];
              for (var k in value) {
                if (_hasOwnProperty(value, k)) {
                  _push(regexKeys, k);
                }
              }
              return regexKeys;
            }
            return regexRejectingObjectKeys(value);
          });
          keys = Object.keys;
        }

        if (Object.getOwnPropertyNames) {
          var objectGOPNAcceptsPrimitives = !throwsError(function () {
            Object.getOwnPropertyNames('foo');
          });
          if (!objectGOPNAcceptsPrimitives) {
            var cachedWindowNames = typeof window === 'object' ? Object.getOwnPropertyNames(window) : [];
            var originalObjectGetOwnPropertyNames = Object.getOwnPropertyNames;
            overrideNative(Object, 'getOwnPropertyNames', function getOwnPropertyNames(value) {
              var val = ES.ToObject(value);
              if (_toString(val) === '[object Window]') {
                try {
                  return originalObjectGetOwnPropertyNames(val);
                } catch (e) {
                  // IE bug where layout engine calls userland gOPN for cross-domain `window` objects
                  return _concat([], cachedWindowNames);
                }
              }
              return originalObjectGetOwnPropertyNames(val);
            });
          }
        }
        if (Object.getOwnPropertyDescriptor) {
          var objectGOPDAcceptsPrimitives = !throwsError(function () {
            Object.getOwnPropertyDescriptor('foo', 'bar');
          });
          if (!objectGOPDAcceptsPrimitives) {
            var originalObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
            overrideNative(Object, 'getOwnPropertyDescriptor', function getOwnPropertyDescriptor(value, property) {
              return originalObjectGetOwnPropertyDescriptor(ES.ToObject(value), property);
            });
          }
        }
        if (Object.seal) {
          var objectSealAcceptsPrimitives = !throwsError(function () {
            Object.seal('foo');
          });
          if (!objectSealAcceptsPrimitives) {
            var originalObjectSeal = Object.seal;
            overrideNative(Object, 'seal', function seal(value) {
              if (!ES.TypeIsObject(value)) {
                return value;
              }
              return originalObjectSeal(value);
            });
          }
        }
        if (Object.isSealed) {
          var objectIsSealedAcceptsPrimitives = !throwsError(function () {
            Object.isSealed('foo');
          });
          if (!objectIsSealedAcceptsPrimitives) {
            var originalObjectIsSealed = Object.isSealed;
            overrideNative(Object, 'isSealed', function isSealed(value) {
              if (!ES.TypeIsObject(value)) {
                return true;
              }
              return originalObjectIsSealed(value);
            });
          }
        }
        if (Object.freeze) {
          var objectFreezeAcceptsPrimitives = !throwsError(function () {
            Object.freeze('foo');
          });
          if (!objectFreezeAcceptsPrimitives) {
            var originalObjectFreeze = Object.freeze;
            overrideNative(Object, 'freeze', function freeze(value) {
              if (!ES.TypeIsObject(value)) {
                return value;
              }
              return originalObjectFreeze(value);
            });
          }
        }
        if (Object.isFrozen) {
          var objectIsFrozenAcceptsPrimitives = !throwsError(function () {
            Object.isFrozen('foo');
          });
          if (!objectIsFrozenAcceptsPrimitives) {
            var originalObjectIsFrozen = Object.isFrozen;
            overrideNative(Object, 'isFrozen', function isFrozen(value) {
              if (!ES.TypeIsObject(value)) {
                return true;
              }
              return originalObjectIsFrozen(value);
            });
          }
        }
        if (Object.preventExtensions) {
          var objectPreventExtensionsAcceptsPrimitives = !throwsError(function () {
            Object.preventExtensions('foo');
          });
          if (!objectPreventExtensionsAcceptsPrimitives) {
            var originalObjectPreventExtensions = Object.preventExtensions;
            overrideNative(Object, 'preventExtensions', function preventExtensions(value) {
              if (!ES.TypeIsObject(value)) {
                return value;
              }
              return originalObjectPreventExtensions(value);
            });
          }
        }
        if (Object.isExtensible) {
          var objectIsExtensibleAcceptsPrimitives = !throwsError(function () {
            Object.isExtensible('foo');
          });
          if (!objectIsExtensibleAcceptsPrimitives) {
            var originalObjectIsExtensible = Object.isExtensible;
            overrideNative(Object, 'isExtensible', function isExtensible(value) {
              if (!ES.TypeIsObject(value)) {
                return false;
              }
              return originalObjectIsExtensible(value);
            });
          }
        }
        if (Object.getPrototypeOf) {
          var objectGetProtoAcceptsPrimitives = !throwsError(function () {
            Object.getPrototypeOf('foo');
          });
          if (!objectGetProtoAcceptsPrimitives) {
            var originalGetProto = Object.getPrototypeOf;
            overrideNative(Object, 'getPrototypeOf', function getPrototypeOf(value) {
              return originalGetProto(ES.ToObject(value));
            });
          }
        }

        var hasFlags = supportsDescriptors && function () {
          var desc = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags');
          return desc && ES.IsCallable(desc.get);
        }();
        if (supportsDescriptors && !hasFlags) {
          var regExpFlagsGetter = function flags() {
            if (!ES.TypeIsObject(this)) {
              throw new TypeError('Method called on incompatible type: must be an object.');
            }
            var result = '';
            if (this.global) {
              result += 'g';
            }
            if (this.ignoreCase) {
              result += 'i';
            }
            if (this.multiline) {
              result += 'm';
            }
            if (this.unicode) {
              result += 'u';
            }
            if (this.sticky) {
              result += 'y';
            }
            return result;
          };

          Value.getter(RegExp.prototype, 'flags', regExpFlagsGetter);
        }

        var regExpSupportsFlagsWithRegex = supportsDescriptors && valueOrFalseIfThrows(function () {
          return String(new RegExp(/a/g, 'i')) === '/a/i';
        });
        var regExpNeedsToSupportSymbolMatch = hasSymbols && supportsDescriptors && function () {
          // Edge 0.12 supports flags fully, but does not support Symbol.match
          var regex = /./;
          regex[Symbol.match] = false;
          return RegExp(regex) === regex;
        }();

        var regexToStringIsGeneric = valueOrFalseIfThrows(function () {
          return RegExp.prototype.toString.call({ source: 'abc' }) === '/abc/';
        });
        var regexToStringSupportsGenericFlags = regexToStringIsGeneric && valueOrFalseIfThrows(function () {
          return RegExp.prototype.toString.call({ source: 'a', flags: 'b' }) === '/a/b';
        });
        if (!regexToStringIsGeneric || !regexToStringSupportsGenericFlags) {
          var origRegExpToString = RegExp.prototype.toString;
          defineProperty(RegExp.prototype, 'toString', function toString() {
            var R = ES.RequireObjectCoercible(this);
            if (Type.regex(R)) {
              return _call(origRegExpToString, R);
            }
            var pattern = $String(R.source);
            var flags = $String(R.flags);
            return '/' + pattern + '/' + flags;
          }, true);
          Value.preserveToString(RegExp.prototype.toString, origRegExpToString);
        }

        if (supportsDescriptors && (!regExpSupportsFlagsWithRegex || regExpNeedsToSupportSymbolMatch)) {
          var flagsGetter = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get;
          var sourceDesc = Object.getOwnPropertyDescriptor(RegExp.prototype, 'source') || {};
          var legacySourceGetter = function () {
            // prior to it being a getter, it's own + nonconfigurable
            return this.source;
          };
          var sourceGetter = ES.IsCallable(sourceDesc.get) ? sourceDesc.get : legacySourceGetter;

          var OrigRegExp = RegExp;
          var RegExpShim = function () {
            return function RegExp(pattern, flags) {
              var patternIsRegExp = ES.IsRegExp(pattern);
              var calledWithNew = this instanceof RegExp;
              if (!calledWithNew && patternIsRegExp && typeof flags === 'undefined' && pattern.constructor === RegExp) {
                return pattern;
              }

              var P = pattern;
              var F = flags;
              if (Type.regex(pattern)) {
                P = ES.Call(sourceGetter, pattern);
                F = typeof flags === 'undefined' ? ES.Call(flagsGetter, pattern) : flags;
                return new RegExp(P, F);
              } else if (patternIsRegExp) {
                P = pattern.source;
                F = typeof flags === 'undefined' ? pattern.flags : flags;
              }
              return new OrigRegExp(pattern, flags);
            };
          }();
          wrapConstructor(OrigRegExp, RegExpShim, {
            $input: true // Chrome < v39 & Opera < 26 have a nonstandard "$input" property
          });
          /* globals RegExp: true */
          /* eslint-disable no-undef, no-global-assign */
          /* jshint -W020 */
          RegExp = RegExpShim;
          Value.redefine(globals, 'RegExp', RegExpShim);
          /* jshint +W020 */
          /* eslint-enable no-undef, no-global-assign */
          /* globals RegExp: false */
        }

        if (supportsDescriptors) {
          var regexGlobals = {
            input: '$_',
            lastMatch: '$&',
            lastParen: '$+',
            leftContext: '$`',
            rightContext: '$\''
          };
          _forEach(keys(regexGlobals), function (prop) {
            if (prop in RegExp && !(regexGlobals[prop] in RegExp)) {
              Value.getter(RegExp, regexGlobals[prop], function get() {
                return RegExp[prop];
              });
            }
          });
        }
        addDefaultSpecies(RegExp);

        var inverseEpsilon = 1 / Number.EPSILON;
        var roundTiesToEven = function roundTiesToEven(n) {
          // Even though this reduces down to `return n`, it takes advantage of built-in rounding.
          return n + inverseEpsilon - inverseEpsilon;
        };
        var BINARY_32_EPSILON = Math.pow(2, -23);
        var BINARY_32_MAX_VALUE = Math.pow(2, 127) * (2 - BINARY_32_EPSILON);
        var BINARY_32_MIN_VALUE = Math.pow(2, -126);
        var E = Math.E;
        var LOG2E = Math.LOG2E;
        var LOG10E = Math.LOG10E;
        var numberCLZ = Number.prototype.clz;
        delete Number.prototype.clz; // Safari 8 has Number#clz

        var MathShims = {
          acosh: function acosh(value) {
            var x = Number(value);
            if (numberIsNaN(x) || value < 1) {
              return NaN;
            }
            if (x === 1) {
              return 0;
            }
            if (x === Infinity) {
              return x;
            }
            return _log(x / E + _sqrt(x + 1) * _sqrt(x - 1) / E) + 1;
          },

          asinh: function asinh(value) {
            var x = Number(value);
            if (x === 0 || !globalIsFinite(x)) {
              return x;
            }
            return x < 0 ? -asinh(-x) : _log(x + _sqrt(x * x + 1));
          },

          atanh: function atanh(value) {
            var x = Number(value);
            if (numberIsNaN(x) || x < -1 || x > 1) {
              return NaN;
            }
            if (x === -1) {
              return -Infinity;
            }
            if (x === 1) {
              return Infinity;
            }
            if (x === 0) {
              return x;
            }
            return 0.5 * _log((1 + x) / (1 - x));
          },

          cbrt: function cbrt(value) {
            var x = Number(value);
            if (x === 0) {
              return x;
            }
            var negate = x < 0;
            var result;
            if (negate) {
              x = -x;
            }
            if (x === Infinity) {
              result = Infinity;
            } else {
              result = _exp(_log(x) / 3);
              // from http://en.wikipedia.org/wiki/Cube_root#Numerical_methods
              result = (x / (result * result) + 2 * result) / 3;
            }
            return negate ? -result : result;
          },

          clz32: function clz32(value) {
            // See https://bugs.ecmascript.org/show_bug.cgi?id=2465
            var x = Number(value);
            var number = ES.ToUint32(x);
            if (number === 0) {
              return 32;
            }
            return numberCLZ ? ES.Call(numberCLZ, number) : 31 - _floor(_log(number + 0.5) * LOG2E);
          },

          cosh: function cosh(value) {
            var x = Number(value);
            if (x === 0) {
              return 1;
            } // +0 or -0
            if (numberIsNaN(x)) {
              return NaN;
            }
            if (!globalIsFinite(x)) {
              return Infinity;
            }
            if (x < 0) {
              x = -x;
            }
            if (x > 21) {
              return _exp(x) / 2;
            }
            return (_exp(x) + _exp(-x)) / 2;
          },

          expm1: function expm1(value) {
            var x = Number(value);
            if (x === -Infinity) {
              return -1;
            }
            if (!globalIsFinite(x) || x === 0) {
              return x;
            }
            if (_abs(x) > 0.5) {
              return _exp(x) - 1;
            }
            // A more precise approximation using Taylor series expansion
            // from https://github.com/paulmillr/es6-shim/issues/314#issuecomment-70293986
            var t = x;
            var sum = 0;
            var n = 1;
            while (sum + t !== sum) {
              sum += t;
              n += 1;
              t *= x / n;
            }
            return sum;
          },

          hypot: function hypot(x, y) {
            var result = 0;
            var largest = 0;
            for (var i = 0; i < arguments.length; ++i) {
              var value = _abs(Number(arguments[i]));
              if (largest < value) {
                result *= largest / value * (largest / value);
                result += 1;
                largest = value;
              } else {
                result += value > 0 ? value / largest * (value / largest) : value;
              }
            }
            return largest === Infinity ? Infinity : largest * _sqrt(result);
          },

          log2: function log2(value) {
            return _log(value) * LOG2E;
          },

          log10: function log10(value) {
            return _log(value) * LOG10E;
          },

          log1p: function log1p(value) {
            var x = Number(value);
            if (x < -1 || numberIsNaN(x)) {
              return NaN;
            }
            if (x === 0 || x === Infinity) {
              return x;
            }
            if (x === -1) {
              return -Infinity;
            }

            return 1 + x - 1 === 0 ? x : x * (_log(1 + x) / (1 + x - 1));
          },

          sign: _sign,

          sinh: function sinh(value) {
            var x = Number(value);
            if (!globalIsFinite(x) || x === 0) {
              return x;
            }

            if (_abs(x) < 1) {
              return (Math.expm1(x) - Math.expm1(-x)) / 2;
            }
            return (_exp(x - 1) - _exp(-x - 1)) * E / 2;
          },

          tanh: function tanh(value) {
            var x = Number(value);
            if (numberIsNaN(x) || x === 0) {
              return x;
            }
            // can exit early at +-20 as JS loses precision for true value at this integer
            if (x >= 20) {
              return 1;
            }
            if (x <= -20) {
              return -1;
            }

            return (Math.expm1(x) - Math.expm1(-x)) / (_exp(x) + _exp(-x));
          },

          trunc: function trunc(value) {
            var x = Number(value);
            return x < 0 ? -_floor(-x) : _floor(x);
          },

          imul: function imul(x, y) {
            // taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
            var a = ES.ToUint32(x);
            var b = ES.ToUint32(y);
            var ah = a >>> 16 & 0xffff;
            var al = a & 0xffff;
            var bh = b >>> 16 & 0xffff;
            var bl = b & 0xffff;
            // the shift by 0 fixes the sign on the high part
            // the final |0 converts the unsigned value into a signed value
            return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0;
          },

          fround: function fround(x) {
            var v = Number(x);
            if (v === 0 || v === Infinity || v === -Infinity || numberIsNaN(v)) {
              return v;
            }
            var sign = _sign(v);
            var abs = _abs(v);
            if (abs < BINARY_32_MIN_VALUE) {
              return sign * roundTiesToEven(abs / BINARY_32_MIN_VALUE / BINARY_32_EPSILON) * BINARY_32_MIN_VALUE * BINARY_32_EPSILON;
            }
            // Veltkamp's splitting (?)
            var a = (1 + BINARY_32_EPSILON / Number.EPSILON) * abs;
            var result = a - (a - abs);
            if (result > BINARY_32_MAX_VALUE || numberIsNaN(result)) {
              return sign * Infinity;
            }
            return sign * result;
          }
        };
        defineProperties(Math, MathShims);
        // IE 11 TP has an imprecise log1p: reports Math.log1p(-1e-17) as 0
        defineProperty(Math, 'log1p', MathShims.log1p, Math.log1p(-1e-17) !== -1e-17);
        // IE 11 TP has an imprecise asinh: reports Math.asinh(-1e7) as not exactly equal to -Math.asinh(1e7)
        defineProperty(Math, 'asinh', MathShims.asinh, Math.asinh(-1e7) !== -Math.asinh(1e7));
        // Chrome 40 has an imprecise Math.tanh with very small numbers
        defineProperty(Math, 'tanh', MathShims.tanh, Math.tanh(-2e-17) !== -2e-17);
        // Chrome 40 loses Math.acosh precision with high numbers
        defineProperty(Math, 'acosh', MathShims.acosh, Math.acosh(Number.MAX_VALUE) === Infinity);
        // Firefox 38 on Windows
        defineProperty(Math, 'cbrt', MathShims.cbrt, Math.abs(1 - Math.cbrt(1e-300) / 1e-100) / Number.EPSILON > 8);
        // node 0.11 has an imprecise Math.sinh with very small numbers
        defineProperty(Math, 'sinh', MathShims.sinh, Math.sinh(-2e-17) !== -2e-17);
        // FF 35 on Linux reports 22025.465794806725 for Math.expm1(10)
        var expm1OfTen = Math.expm1(10);
        defineProperty(Math, 'expm1', MathShims.expm1, expm1OfTen > 22025.465794806719 || expm1OfTen < 22025.4657948067165168);

        var origMathRound = Math.round;
        // breaks in e.g. Safari 8, Internet Explorer 11, Opera 12
        var roundHandlesBoundaryConditions = Math.round(0.5 - Number.EPSILON / 4) === 0 && Math.round(-0.5 + Number.EPSILON / 3.99) === 1;

        // When engines use Math.floor(x + 0.5) internally, Math.round can be buggy for large integers.
        // This behavior should be governed by "round to nearest, ties to even mode"
        // see http://www.ecma-international.org/ecma-262/6.0/#sec-terms-and-definitions-number-type
        // These are the boundary cases where it breaks.
        var smallestPositiveNumberWhereRoundBreaks = inverseEpsilon + 1;
        var largestPositiveNumberWhereRoundBreaks = 2 * inverseEpsilon - 1;
        var roundDoesNotIncreaseIntegers = [smallestPositiveNumberWhereRoundBreaks, largestPositiveNumberWhereRoundBreaks].every(function (num) {
          return Math.round(num) === num;
        });
        defineProperty(Math, 'round', function round(x) {
          var floor = _floor(x);
          var ceil = floor === -1 ? -0 : floor + 1;
          return x - floor < 0.5 ? floor : ceil;
        }, !roundHandlesBoundaryConditions || !roundDoesNotIncreaseIntegers);
        Value.preserveToString(Math.round, origMathRound);

        var origImul = Math.imul;
        if (Math.imul(0xffffffff, 5) !== -5) {
          // Safari 6.1, at least, reports "0" for this value
          Math.imul = MathShims.imul;
          Value.preserveToString(Math.imul, origImul);
        }
        if (Math.imul.length !== 2) {
          // Safari 8.0.4 has a length of 1
          // fixed in https://bugs.webkit.org/show_bug.cgi?id=143658
          overrideNative(Math, 'imul', function imul(x, y) {
            return ES.Call(origImul, Math, arguments);
          });
        }

        // Promises
        // Simplest possible implementation; use a 3rd-party library if you
        // want the best possible speed and/or long stack traces.
        var PromiseShim = function () {
          var setTimeout = globals.setTimeout;
          // some environments don't have setTimeout - no way to shim here.
          if (typeof setTimeout !== 'function' && typeof setTimeout !== 'object') {
            return;
          }

          ES.IsPromise = function (promise) {
            if (!ES.TypeIsObject(promise)) {
              return false;
            }
            if (typeof promise._promise === 'undefined') {
              return false; // uninitialized, or missing our hidden field.
            }
            return true;
          };

          // "PromiseCapability" in the spec is what most promise implementations
          // call a "deferred".
          var PromiseCapability = function (C) {
            if (!ES.IsConstructor(C)) {
              throw new TypeError('Bad promise constructor');
            }
            var capability = this;
            var resolver = function (resolve, reject) {
              if (capability.resolve !== void 0 || capability.reject !== void 0) {
                throw new TypeError('Bad Promise implementation!');
              }
              capability.resolve = resolve;
              capability.reject = reject;
            };
            // Initialize fields to inform optimizers about the object shape.
            capability.resolve = void 0;
            capability.reject = void 0;
            capability.promise = new C(resolver);
            if (!(ES.IsCallable(capability.resolve) && ES.IsCallable(capability.reject))) {
              throw new TypeError('Bad promise constructor');
            }
          };

          // find an appropriate setImmediate-alike
          var makeZeroTimeout;
          /*global window */
          if (typeof window !== 'undefined' && ES.IsCallable(window.postMessage)) {
            makeZeroTimeout = function () {
              // from http://dbaron.org/log/20100309-faster-timeouts
              var timeouts = [];
              var messageName = 'zero-timeout-message';
              var setZeroTimeout = function (fn) {
                _push(timeouts, fn);
                window.postMessage(messageName, '*');
              };
              var handleMessage = function (event) {
                if (event.source === window && event.data === messageName) {
                  event.stopPropagation();
                  if (timeouts.length === 0) {
                    return;
                  }
                  var fn = _shift(timeouts);
                  fn();
                }
              };
              window.addEventListener('message', handleMessage, true);
              return setZeroTimeout;
            };
          }
          var makePromiseAsap = function () {
            // An efficient task-scheduler based on a pre-existing Promise
            // implementation, which we can use even if we override the
            // global Promise below (in order to workaround bugs)
            // https://github.com/Raynos/observ-hash/issues/2#issuecomment-35857671
            var P = globals.Promise;
            var pr = P && P.resolve && P.resolve();
            return pr && function (task) {
              return pr.then(task);
            };
          };
          /*global process */
          /* jscs:disable disallowMultiLineTernary */
          var enqueue = ES.IsCallable(globals.setImmediate) ? globals.setImmediate : typeof process === 'object' && process.nextTick ? process.nextTick : makePromiseAsap() || (ES.IsCallable(makeZeroTimeout) ? makeZeroTimeout() : function (task) {
            setTimeout(task, 0);
          }); // fallback
          /* jscs:enable disallowMultiLineTernary */

          // Constants for Promise implementation
          var PROMISE_IDENTITY = function (x) {
            return x;
          };
          var PROMISE_THROWER = function (e) {
            throw e;
          };
          var PROMISE_PENDING = 0;
          var PROMISE_FULFILLED = 1;
          var PROMISE_REJECTED = 2;
          // We store fulfill/reject handlers and capabilities in a single array.
          var PROMISE_FULFILL_OFFSET = 0;
          var PROMISE_REJECT_OFFSET = 1;
          var PROMISE_CAPABILITY_OFFSET = 2;
          // This is used in an optimization for chaining promises via then.
          var PROMISE_FAKE_CAPABILITY = {};

          var enqueuePromiseReactionJob = function (handler, capability, argument) {
            enqueue(function () {
              promiseReactionJob(handler, capability, argument);
            });
          };

          var promiseReactionJob = function (handler, promiseCapability, argument) {
            var handlerResult, f;
            if (promiseCapability === PROMISE_FAKE_CAPABILITY) {
              // Fast case, when we don't actually need to chain through to a
              // (real) promiseCapability.
              return handler(argument);
            }
            try {
              handlerResult = handler(argument);
              f = promiseCapability.resolve;
            } catch (e) {
              handlerResult = e;
              f = promiseCapability.reject;
            }
            f(handlerResult);
          };

          var fulfillPromise = function (promise, value) {
            var _promise = promise._promise;
            var length = _promise.reactionLength;
            if (length > 0) {
              enqueuePromiseReactionJob(_promise.fulfillReactionHandler0, _promise.reactionCapability0, value);
              _promise.fulfillReactionHandler0 = void 0;
              _promise.rejectReactions0 = void 0;
              _promise.reactionCapability0 = void 0;
              if (length > 1) {
                for (var i = 1, idx = 0; i < length; i++, idx += 3) {
                  enqueuePromiseReactionJob(_promise[idx + PROMISE_FULFILL_OFFSET], _promise[idx + PROMISE_CAPABILITY_OFFSET], value);
                  promise[idx + PROMISE_FULFILL_OFFSET] = void 0;
                  promise[idx + PROMISE_REJECT_OFFSET] = void 0;
                  promise[idx + PROMISE_CAPABILITY_OFFSET] = void 0;
                }
              }
            }
            _promise.result = value;
            _promise.state = PROMISE_FULFILLED;
            _promise.reactionLength = 0;
          };

          var rejectPromise = function (promise, reason) {
            var _promise = promise._promise;
            var length = _promise.reactionLength;
            if (length > 0) {
              enqueuePromiseReactionJob(_promise.rejectReactionHandler0, _promise.reactionCapability0, reason);
              _promise.fulfillReactionHandler0 = void 0;
              _promise.rejectReactions0 = void 0;
              _promise.reactionCapability0 = void 0;
              if (length > 1) {
                for (var i = 1, idx = 0; i < length; i++, idx += 3) {
                  enqueuePromiseReactionJob(_promise[idx + PROMISE_REJECT_OFFSET], _promise[idx + PROMISE_CAPABILITY_OFFSET], reason);
                  promise[idx + PROMISE_FULFILL_OFFSET] = void 0;
                  promise[idx + PROMISE_REJECT_OFFSET] = void 0;
                  promise[idx + PROMISE_CAPABILITY_OFFSET] = void 0;
                }
              }
            }
            _promise.result = reason;
            _promise.state = PROMISE_REJECTED;
            _promise.reactionLength = 0;
          };

          var createResolvingFunctions = function (promise) {
            var alreadyResolved = false;
            var resolve = function (resolution) {
              var then;
              if (alreadyResolved) {
                return;
              }
              alreadyResolved = true;
              if (resolution === promise) {
                return rejectPromise(promise, new TypeError('Self resolution'));
              }
              if (!ES.TypeIsObject(resolution)) {
                return fulfillPromise(promise, resolution);
              }
              try {
                then = resolution.then;
              } catch (e) {
                return rejectPromise(promise, e);
              }
              if (!ES.IsCallable(then)) {
                return fulfillPromise(promise, resolution);
              }
              enqueue(function () {
                promiseResolveThenableJob(promise, resolution, then);
              });
            };
            var reject = function (reason) {
              if (alreadyResolved) {
                return;
              }
              alreadyResolved = true;
              return rejectPromise(promise, reason);
            };
            return { resolve: resolve, reject: reject };
          };

          var optimizedThen = function (then, thenable, resolve, reject) {
            // Optimization: since we discard the result, we can pass our
            // own then implementation a special hint to let it know it
            // doesn't have to create it.  (The PROMISE_FAKE_CAPABILITY
            // object is local to this implementation and unforgeable outside.)
            if (then === Promise$prototype$then) {
              _call(then, thenable, resolve, reject, PROMISE_FAKE_CAPABILITY);
            } else {
              _call(then, thenable, resolve, reject);
            }
          };
          var promiseResolveThenableJob = function (promise, thenable, then) {
            var resolvingFunctions = createResolvingFunctions(promise);
            var resolve = resolvingFunctions.resolve;
            var reject = resolvingFunctions.reject;
            try {
              optimizedThen(then, thenable, resolve, reject);
            } catch (e) {
              reject(e);
            }
          };

          var Promise$prototype, Promise$prototype$then;
          var Promise = function () {
            var PromiseShim = function Promise(resolver) {
              if (!(this instanceof PromiseShim)) {
                throw new TypeError('Constructor Promise requires "new"');
              }
              if (this && this._promise) {
                throw new TypeError('Bad construction');
              }
              // see https://bugs.ecmascript.org/show_bug.cgi?id=2482
              if (!ES.IsCallable(resolver)) {
                throw new TypeError('not a valid resolver');
              }
              var promise = emulateES6construct(this, PromiseShim, Promise$prototype, {
                _promise: {
                  result: void 0,
                  state: PROMISE_PENDING,
                  // The first member of the "reactions" array is inlined here,
                  // since most promises only have one reaction.
                  // We've also exploded the 'reaction' object to inline the
                  // "handler" and "capability" fields, since both fulfill and
                  // reject reactions share the same capability.
                  reactionLength: 0,
                  fulfillReactionHandler0: void 0,
                  rejectReactionHandler0: void 0,
                  reactionCapability0: void 0
                }
              });
              var resolvingFunctions = createResolvingFunctions(promise);
              var reject = resolvingFunctions.reject;
              try {
                resolver(resolvingFunctions.resolve, reject);
              } catch (e) {
                reject(e);
              }
              return promise;
            };
            return PromiseShim;
          }();
          Promise$prototype = Promise.prototype;

          var _promiseAllResolver = function (index, values, capability, remaining) {
            var alreadyCalled = false;
            return function (x) {
              if (alreadyCalled) {
                return;
              }
              alreadyCalled = true;
              values[index] = x;
              if (--remaining.count === 0) {
                var resolve = capability.resolve;
                resolve(values); // call w/ this===undefined
              }
            };
          };

          var performPromiseAll = function (iteratorRecord, C, resultCapability) {
            var it = iteratorRecord.iterator;
            var values = [];
            var remaining = { count: 1 };
            var next, nextValue;
            var index = 0;
            while (true) {
              try {
                next = ES.IteratorStep(it);
                if (next === false) {
                  iteratorRecord.done = true;
                  break;
                }
                nextValue = next.value;
              } catch (e) {
                iteratorRecord.done = true;
                throw e;
              }
              values[index] = void 0;
              var nextPromise = C.resolve(nextValue);
              var resolveElement = _promiseAllResolver(index, values, resultCapability, remaining);
              remaining.count += 1;
              optimizedThen(nextPromise.then, nextPromise, resolveElement, resultCapability.reject);
              index += 1;
            }
            if (--remaining.count === 0) {
              var resolve = resultCapability.resolve;
              resolve(values); // call w/ this===undefined
            }
            return resultCapability.promise;
          };

          var performPromiseRace = function (iteratorRecord, C, resultCapability) {
            var it = iteratorRecord.iterator;
            var next, nextValue, nextPromise;
            while (true) {
              try {
                next = ES.IteratorStep(it);
                if (next === false) {
                  // NOTE: If iterable has no items, resulting promise will never
                  // resolve; see:
                  // https://github.com/domenic/promises-unwrapping/issues/75
                  // https://bugs.ecmascript.org/show_bug.cgi?id=2515
                  iteratorRecord.done = true;
                  break;
                }
                nextValue = next.value;
              } catch (e) {
                iteratorRecord.done = true;
                throw e;
              }
              nextPromise = C.resolve(nextValue);
              optimizedThen(nextPromise.then, nextPromise, resultCapability.resolve, resultCapability.reject);
            }
            return resultCapability.promise;
          };

          defineProperties(Promise, {
            all: function all(iterable) {
              var C = this;
              if (!ES.TypeIsObject(C)) {
                throw new TypeError('Promise is not object');
              }
              var capability = new PromiseCapability(C);
              var iterator, iteratorRecord;
              try {
                iterator = ES.GetIterator(iterable);
                iteratorRecord = { iterator: iterator, done: false };
                return performPromiseAll(iteratorRecord, C, capability);
              } catch (e) {
                var exception = e;
                if (iteratorRecord && !iteratorRecord.done) {
                  try {
                    ES.IteratorClose(iterator, true);
                  } catch (ee) {
                    exception = ee;
                  }
                }
                var reject = capability.reject;
                reject(exception);
                return capability.promise;
              }
            },

            race: function race(iterable) {
              var C = this;
              if (!ES.TypeIsObject(C)) {
                throw new TypeError('Promise is not object');
              }
              var capability = new PromiseCapability(C);
              var iterator, iteratorRecord;
              try {
                iterator = ES.GetIterator(iterable);
                iteratorRecord = { iterator: iterator, done: false };
                return performPromiseRace(iteratorRecord, C, capability);
              } catch (e) {
                var exception = e;
                if (iteratorRecord && !iteratorRecord.done) {
                  try {
                    ES.IteratorClose(iterator, true);
                  } catch (ee) {
                    exception = ee;
                  }
                }
                var reject = capability.reject;
                reject(exception);
                return capability.promise;
              }
            },

            reject: function reject(reason) {
              var C = this;
              if (!ES.TypeIsObject(C)) {
                throw new TypeError('Bad promise constructor');
              }
              var capability = new PromiseCapability(C);
              var rejectFunc = capability.reject;
              rejectFunc(reason); // call with this===undefined
              return capability.promise;
            },

            resolve: function resolve(v) {
              // See https://esdiscuss.org/topic/fixing-promise-resolve for spec
              var C = this;
              if (!ES.TypeIsObject(C)) {
                throw new TypeError('Bad promise constructor');
              }
              if (ES.IsPromise(v)) {
                var constructor = v.constructor;
                if (constructor === C) {
                  return v;
                }
              }
              var capability = new PromiseCapability(C);
              var resolveFunc = capability.resolve;
              resolveFunc(v); // call with this===undefined
              return capability.promise;
            }
          });

          defineProperties(Promise$prototype, {
            'catch': function (onRejected) {
              return this.then(null, onRejected);
            },

            then: function then(onFulfilled, onRejected) {
              var promise = this;
              if (!ES.IsPromise(promise)) {
                throw new TypeError('not a promise');
              }
              var C = ES.SpeciesConstructor(promise, Promise);
              var resultCapability;
              var returnValueIsIgnored = arguments.length > 2 && arguments[2] === PROMISE_FAKE_CAPABILITY;
              if (returnValueIsIgnored && C === Promise) {
                resultCapability = PROMISE_FAKE_CAPABILITY;
              } else {
                resultCapability = new PromiseCapability(C);
              }
              // PerformPromiseThen(promise, onFulfilled, onRejected, resultCapability)
              // Note that we've split the 'reaction' object into its two
              // components, "capabilities" and "handler"
              // "capabilities" is always equal to `resultCapability`
              var fulfillReactionHandler = ES.IsCallable(onFulfilled) ? onFulfilled : PROMISE_IDENTITY;
              var rejectReactionHandler = ES.IsCallable(onRejected) ? onRejected : PROMISE_THROWER;
              var _promise = promise._promise;
              var value;
              if (_promise.state === PROMISE_PENDING) {
                if (_promise.reactionLength === 0) {
                  _promise.fulfillReactionHandler0 = fulfillReactionHandler;
                  _promise.rejectReactionHandler0 = rejectReactionHandler;
                  _promise.reactionCapability0 = resultCapability;
                } else {
                  var idx = 3 * (_promise.reactionLength - 1);
                  _promise[idx + PROMISE_FULFILL_OFFSET] = fulfillReactionHandler;
                  _promise[idx + PROMISE_REJECT_OFFSET] = rejectReactionHandler;
                  _promise[idx + PROMISE_CAPABILITY_OFFSET] = resultCapability;
                }
                _promise.reactionLength += 1;
              } else if (_promise.state === PROMISE_FULFILLED) {
                value = _promise.result;
                enqueuePromiseReactionJob(fulfillReactionHandler, resultCapability, value);
              } else if (_promise.state === PROMISE_REJECTED) {
                value = _promise.result;
                enqueuePromiseReactionJob(rejectReactionHandler, resultCapability, value);
              } else {
                throw new TypeError('unexpected Promise state');
              }
              return resultCapability.promise;
            }
          });
          // This helps the optimizer by ensuring that methods which take
          // capabilities aren't polymorphic.
          PROMISE_FAKE_CAPABILITY = new PromiseCapability(Promise);
          Promise$prototype$then = Promise$prototype.then;

          return Promise;
        }();

        // Chrome's native Promise has extra methods that it shouldn't have. Let's remove them.
        if (globals.Promise) {
          delete globals.Promise.accept;
          delete globals.Promise.defer;
          delete globals.Promise.prototype.chain;
        }

        if (typeof PromiseShim === 'function') {
          // export the Promise constructor.
          defineProperties(globals, { Promise: PromiseShim });
          // In Chrome 33 (and thereabouts) Promise is defined, but the
          // implementation is buggy in a number of ways.  Let's check subclassing
          // support to see if we have a buggy implementation.
          var promiseSupportsSubclassing = supportsSubclassing(globals.Promise, function (S) {
            return S.resolve(42).then(function () {}) instanceof S;
          });
          var promiseIgnoresNonFunctionThenCallbacks = !throwsError(function () {
            globals.Promise.reject(42).then(null, 5).then(null, noop);
          });
          var promiseRequiresObjectContext = throwsError(function () {
            globals.Promise.call(3, noop);
          });
          // Promise.resolve() was errata'ed late in the ES6 process.
          // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1170742
          //      https://code.google.com/p/v8/issues/detail?id=4161
          // It serves as a proxy for a number of other bugs in early Promise
          // implementations.
          var promiseResolveBroken = function (Promise) {
            var p = Promise.resolve(5);
            p.constructor = {};
            var p2 = Promise.resolve(p);
            try {
              p2.then(null, noop).then(null, noop); // avoid "uncaught rejection" warnings in console
            } catch (e) {
              return true; // v8 native Promises break here https://code.google.com/p/chromium/issues/detail?id=575314
            }
            return p === p2; // This *should* be false!
          }(globals.Promise);

          // Chrome 46 (probably older too) does not retrieve a thenable's .then synchronously
          var getsThenSynchronously = supportsDescriptors && function () {
            var count = 0;
            var thenable = Object.defineProperty({}, 'then', { get: function () {
                count += 1;
              } });
            Promise.resolve(thenable);
            return count === 1;
          }();

          var BadResolverPromise = function BadResolverPromise(executor) {
            var p = new Promise(executor);
            executor(3, function () {});
            this.then = p.then;
            this.constructor = BadResolverPromise;
          };
          BadResolverPromise.prototype = Promise.prototype;
          BadResolverPromise.all = Promise.all;
          // Chrome Canary 49 (probably older too) has some implementation bugs
          var hasBadResolverPromise = valueOrFalseIfThrows(function () {
            return !!BadResolverPromise.all([1, 2]);
          });

          if (!promiseSupportsSubclassing || !promiseIgnoresNonFunctionThenCallbacks || !promiseRequiresObjectContext || promiseResolveBroken || !getsThenSynchronously || hasBadResolverPromise) {
            /* globals Promise: true */
            /* eslint-disable no-undef, no-global-assign */
            /* jshint -W020 */
            Promise = PromiseShim;
            /* jshint +W020 */
            /* eslint-enable no-undef, no-global-assign */
            /* globals Promise: false */
            overrideNative(globals, 'Promise', PromiseShim);
          }
          if (Promise.all.length !== 1) {
            var origAll = Promise.all;
            overrideNative(Promise, 'all', function all(iterable) {
              return ES.Call(origAll, this, arguments);
            });
          }
          if (Promise.race.length !== 1) {
            var origRace = Promise.race;
            overrideNative(Promise, 'race', function race(iterable) {
              return ES.Call(origRace, this, arguments);
            });
          }
          if (Promise.resolve.length !== 1) {
            var origResolve = Promise.resolve;
            overrideNative(Promise, 'resolve', function resolve(x) {
              return ES.Call(origResolve, this, arguments);
            });
          }
          if (Promise.reject.length !== 1) {
            var origReject = Promise.reject;
            overrideNative(Promise, 'reject', function reject(r) {
              return ES.Call(origReject, this, arguments);
            });
          }
          ensureEnumerable(Promise, 'all');
          ensureEnumerable(Promise, 'race');
          ensureEnumerable(Promise, 'resolve');
          ensureEnumerable(Promise, 'reject');
          addDefaultSpecies(Promise);
        }

        // Map and Set require a true ES5 environment
        // Their fast path also requires that the environment preserve
        // property insertion order, which is not guaranteed by the spec.
        var testOrder = function (a) {
          var b = keys(_reduce(a, function (o, k) {
            o[k] = true;
            return o;
          }, {}));
          return a.join(':') === b.join(':');
        };
        var preservesInsertionOrder = testOrder(['z', 'a', 'bb']);
        // some engines (eg, Chrome) only preserve insertion order for string keys
        var preservesNumericInsertionOrder = testOrder(['z', 1, 'a', '3', 2]);

        if (supportsDescriptors) {

          var fastkey = function fastkey(key, skipInsertionOrderCheck) {
            if (!skipInsertionOrderCheck && !preservesInsertionOrder) {
              return null;
            }
            if (isNullOrUndefined(key)) {
              return '^' + ES.ToString(key);
            } else if (typeof key === 'string') {
              return '$' + key;
            } else if (typeof key === 'number') {
              // note that -0 will get coerced to "0" when used as a property key
              if (!preservesNumericInsertionOrder) {
                return 'n' + key;
              }
              return key;
            } else if (typeof key === 'boolean') {
              return 'b' + key;
            }
            return null;
          };

          var emptyObject = function emptyObject() {
            // accomodate some older not-quite-ES5 browsers
            return Object.create ? Object.create(null) : {};
          };

          var addIterableToMap = function addIterableToMap(MapConstructor, map, iterable) {
            if (isArray(iterable) || Type.string(iterable)) {
              _forEach(iterable, function (entry) {
                if (!ES.TypeIsObject(entry)) {
                  throw new TypeError('Iterator value ' + entry + ' is not an entry object');
                }
                map.set(entry[0], entry[1]);
              });
            } else if (iterable instanceof MapConstructor) {
              _call(MapConstructor.prototype.forEach, iterable, function (value, key) {
                map.set(key, value);
              });
            } else {
              var iter, adder;
              if (!isNullOrUndefined(iterable)) {
                adder = map.set;
                if (!ES.IsCallable(adder)) {
                  throw new TypeError('bad map');
                }
                iter = ES.GetIterator(iterable);
              }
              if (typeof iter !== 'undefined') {
                while (true) {
                  var next = ES.IteratorStep(iter);
                  if (next === false) {
                    break;
                  }
                  var nextItem = next.value;
                  try {
                    if (!ES.TypeIsObject(nextItem)) {
                      throw new TypeError('Iterator value ' + nextItem + ' is not an entry object');
                    }
                    _call(adder, map, nextItem[0], nextItem[1]);
                  } catch (e) {
                    ES.IteratorClose(iter, true);
                    throw e;
                  }
                }
              }
            }
          };
          var addIterableToSet = function addIterableToSet(SetConstructor, set, iterable) {
            if (isArray(iterable) || Type.string(iterable)) {
              _forEach(iterable, function (value) {
                set.add(value);
              });
            } else if (iterable instanceof SetConstructor) {
              _call(SetConstructor.prototype.forEach, iterable, function (value) {
                set.add(value);
              });
            } else {
              var iter, adder;
              if (!isNullOrUndefined(iterable)) {
                adder = set.add;
                if (!ES.IsCallable(adder)) {
                  throw new TypeError('bad set');
                }
                iter = ES.GetIterator(iterable);
              }
              if (typeof iter !== 'undefined') {
                while (true) {
                  var next = ES.IteratorStep(iter);
                  if (next === false) {
                    break;
                  }
                  var nextValue = next.value;
                  try {
                    _call(adder, set, nextValue);
                  } catch (e) {
                    ES.IteratorClose(iter, true);
                    throw e;
                  }
                }
              }
            }
          };

          var collectionShims = {
            Map: function () {

              var empty = {};

              var MapEntry = function MapEntry(key, value) {
                this.key = key;
                this.value = value;
                this.next = null;
                this.prev = null;
              };

              MapEntry.prototype.isRemoved = function isRemoved() {
                return this.key === empty;
              };

              var isMap = function isMap(map) {
                return !!map._es6map;
              };

              var requireMapSlot = function requireMapSlot(map, method) {
                if (!ES.TypeIsObject(map) || !isMap(map)) {
                  throw new TypeError('Method Map.prototype.' + method + ' called on incompatible receiver ' + ES.ToString(map));
                }
              };

              var MapIterator = function MapIterator(map, kind) {
                requireMapSlot(map, '[[MapIterator]]');
                this.head = map._head;
                this.i = this.head;
                this.kind = kind;
              };

              MapIterator.prototype = {
                next: function next() {
                  var i = this.i;
                  var kind = this.kind;
                  var head = this.head;
                  if (typeof this.i === 'undefined') {
                    return iteratorResult();
                  }
                  while (i.isRemoved() && i !== head) {
                    // back up off of removed entries
                    i = i.prev;
                  }
                  // advance to next unreturned element.
                  var result;
                  while (i.next !== head) {
                    i = i.next;
                    if (!i.isRemoved()) {
                      if (kind === 'key') {
                        result = i.key;
                      } else if (kind === 'value') {
                        result = i.value;
                      } else {
                        result = [i.key, i.value];
                      }
                      this.i = i;
                      return iteratorResult(result);
                    }
                  }
                  // once the iterator is done, it is done forever.
                  this.i = void 0;
                  return iteratorResult();
                }
              };
              addIterator(MapIterator.prototype);

              var Map$prototype;
              var MapShim = function Map() {
                if (!(this instanceof Map)) {
                  throw new TypeError('Constructor Map requires "new"');
                }
                if (this && this._es6map) {
                  throw new TypeError('Bad construction');
                }
                var map = emulateES6construct(this, Map, Map$prototype, {
                  _es6map: true,
                  _head: null,
                  _map: OrigMap ? new OrigMap() : null,
                  _size: 0,
                  _storage: emptyObject()
                });

                var head = new MapEntry(null, null);
                // circular doubly-linked list.
                /* eslint no-multi-assign: 1 */
                head.next = head.prev = head;
                map._head = head;

                // Optionally initialize map from iterable
                if (arguments.length > 0) {
                  addIterableToMap(Map, map, arguments[0]);
                }
                return map;
              };
              Map$prototype = MapShim.prototype;

              Value.getter(Map$prototype, 'size', function () {
                if (typeof this._size === 'undefined') {
                  throw new TypeError('size method called on incompatible Map');
                }
                return this._size;
              });

              defineProperties(Map$prototype, {
                get: function get(key) {
                  requireMapSlot(this, 'get');
                  var entry;
                  var fkey = fastkey(key, true);
                  if (fkey !== null) {
                    // fast O(1) path
                    entry = this._storage[fkey];
                    if (entry) {
                      return entry.value;
                    } else {
                      return;
                    }
                  }
                  if (this._map) {
                    // fast object key path
                    entry = origMapGet.call(this._map, key);
                    if (entry) {
                      return entry.value;
                    } else {
                      return;
                    }
                  }
                  var head = this._head;
                  var i = head;
                  while ((i = i.next) !== head) {
                    if (ES.SameValueZero(i.key, key)) {
                      return i.value;
                    }
                  }
                },

                has: function has(key) {
                  requireMapSlot(this, 'has');
                  var fkey = fastkey(key, true);
                  if (fkey !== null) {
                    // fast O(1) path
                    return typeof this._storage[fkey] !== 'undefined';
                  }
                  if (this._map) {
                    // fast object key path
                    return origMapHas.call(this._map, key);
                  }
                  var head = this._head;
                  var i = head;
                  while ((i = i.next) !== head) {
                    if (ES.SameValueZero(i.key, key)) {
                      return true;
                    }
                  }
                  return false;
                },

                set: function set(key, value) {
                  requireMapSlot(this, 'set');
                  var head = this._head;
                  var i = head;
                  var entry;
                  var fkey = fastkey(key, true);
                  if (fkey !== null) {
                    // fast O(1) path
                    if (typeof this._storage[fkey] !== 'undefined') {
                      this._storage[fkey].value = value;
                      return this;
                    } else {
                      entry = this._storage[fkey] = new MapEntry(key, value); /* eslint no-multi-assign: 1 */
                      i = head.prev;
                      // fall through
                    }
                  } else if (this._map) {
                    // fast object key path
                    if (origMapHas.call(this._map, key)) {
                      origMapGet.call(this._map, key).value = value;
                    } else {
                      entry = new MapEntry(key, value);
                      origMapSet.call(this._map, key, entry);
                      i = head.prev;
                      // fall through
                    }
                  }
                  while ((i = i.next) !== head) {
                    if (ES.SameValueZero(i.key, key)) {
                      i.value = value;
                      return this;
                    }
                  }
                  entry = entry || new MapEntry(key, value);
                  if (ES.SameValue(-0, key)) {
                    entry.key = +0; // coerce -0 to +0 in entry
                  }
                  entry.next = this._head;
                  entry.prev = this._head.prev;
                  entry.prev.next = entry;
                  entry.next.prev = entry;
                  this._size += 1;
                  return this;
                },

                'delete': function (key) {
                  requireMapSlot(this, 'delete');
                  var head = this._head;
                  var i = head;
                  var fkey = fastkey(key, true);
                  if (fkey !== null) {
                    // fast O(1) path
                    if (typeof this._storage[fkey] === 'undefined') {
                      return false;
                    }
                    i = this._storage[fkey].prev;
                    delete this._storage[fkey];
                    // fall through
                  } else if (this._map) {
                    // fast object key path
                    if (!origMapHas.call(this._map, key)) {
                      return false;
                    }
                    i = origMapGet.call(this._map, key).prev;
                    origMapDelete.call(this._map, key);
                    // fall through
                  }
                  while ((i = i.next) !== head) {
                    if (ES.SameValueZero(i.key, key)) {
                      i.key = empty;
                      i.value = empty;
                      i.prev.next = i.next;
                      i.next.prev = i.prev;
                      this._size -= 1;
                      return true;
                    }
                  }
                  return false;
                },

                clear: function clear() {
                  /* eslint no-multi-assign: 1 */
                  requireMapSlot(this, 'clear');
                  this._map = OrigMap ? new OrigMap() : null;
                  this._size = 0;
                  this._storage = emptyObject();
                  var head = this._head;
                  var i = head;
                  var p = i.next;
                  while ((i = p) !== head) {
                    i.key = empty;
                    i.value = empty;
                    p = i.next;
                    i.next = i.prev = head;
                  }
                  head.next = head.prev = head;
                },

                keys: function keys() {
                  requireMapSlot(this, 'keys');
                  return new MapIterator(this, 'key');
                },

                values: function values() {
                  requireMapSlot(this, 'values');
                  return new MapIterator(this, 'value');
                },

                entries: function entries() {
                  requireMapSlot(this, 'entries');
                  return new MapIterator(this, 'key+value');
                },

                forEach: function forEach(callback) {
                  requireMapSlot(this, 'forEach');
                  var context = arguments.length > 1 ? arguments[1] : null;
                  var it = this.entries();
                  for (var entry = it.next(); !entry.done; entry = it.next()) {
                    if (context) {
                      _call(callback, context, entry.value[1], entry.value[0], this);
                    } else {
                      callback(entry.value[1], entry.value[0], this);
                    }
                  }
                }
              });
              addIterator(Map$prototype, Map$prototype.entries);

              return MapShim;
            }(),

            Set: function () {
              var isSet = function isSet(set) {
                return set._es6set && typeof set._storage !== 'undefined';
              };
              var requireSetSlot = function requireSetSlot(set, method) {
                if (!ES.TypeIsObject(set) || !isSet(set)) {
                  // https://github.com/paulmillr/es6-shim/issues/176
                  throw new TypeError('Set.prototype.' + method + ' called on incompatible receiver ' + ES.ToString(set));
                }
              };

              // Creating a Map is expensive.  To speed up the common case of
              // Sets containing only string or numeric keys, we use an object
              // as backing storage and lazily create a full Map only when
              // required.
              var Set$prototype;
              var SetShim = function Set() {
                if (!(this instanceof Set)) {
                  throw new TypeError('Constructor Set requires "new"');
                }
                if (this && this._es6set) {
                  throw new TypeError('Bad construction');
                }
                var set = emulateES6construct(this, Set, Set$prototype, {
                  _es6set: true,
                  '[[SetData]]': null,
                  _storage: emptyObject()
                });
                if (!set._es6set) {
                  throw new TypeError('bad set');
                }

                // Optionally initialize Set from iterable
                if (arguments.length > 0) {
                  addIterableToSet(Set, set, arguments[0]);
                }
                return set;
              };
              Set$prototype = SetShim.prototype;

              var decodeKey = function (key) {
                var k = key;
                if (k === '^null') {
                  return null;
                } else if (k === '^undefined') {
                  return void 0;
                } else {
                  var first = k.charAt(0);
                  if (first === '$') {
                    return _strSlice(k, 1);
                  } else if (first === 'n') {
                    return +_strSlice(k, 1);
                  } else if (first === 'b') {
                    return k === 'btrue';
                  }
                }
                return +k;
              };
              // Switch from the object backing storage to a full Map.
              var ensureMap = function ensureMap(set) {
                if (!set['[[SetData]]']) {
                  var m = new collectionShims.Map();
                  set['[[SetData]]'] = m;
                  _forEach(keys(set._storage), function (key) {
                    var k = decodeKey(key);
                    m.set(k, k);
                  });
                  set['[[SetData]]'] = m;
                }
                set._storage = null; // free old backing storage
              };

              Value.getter(SetShim.prototype, 'size', function () {
                requireSetSlot(this, 'size');
                if (this._storage) {
                  return keys(this._storage).length;
                }
                ensureMap(this);
                return this['[[SetData]]'].size;
              });

              defineProperties(SetShim.prototype, {
                has: function has(key) {
                  requireSetSlot(this, 'has');
                  var fkey;
                  if (this._storage && (fkey = fastkey(key)) !== null) {
                    return !!this._storage[fkey];
                  }
                  ensureMap(this);
                  return this['[[SetData]]'].has(key);
                },

                add: function add(key) {
                  requireSetSlot(this, 'add');
                  var fkey;
                  if (this._storage && (fkey = fastkey(key)) !== null) {
                    this._storage[fkey] = true;
                    return this;
                  }
                  ensureMap(this);
                  this['[[SetData]]'].set(key, key);
                  return this;
                },

                'delete': function (key) {
                  requireSetSlot(this, 'delete');
                  var fkey;
                  if (this._storage && (fkey = fastkey(key)) !== null) {
                    var hasFKey = _hasOwnProperty(this._storage, fkey);
                    return delete this._storage[fkey] && hasFKey;
                  }
                  ensureMap(this);
                  return this['[[SetData]]']['delete'](key);
                },

                clear: function clear() {
                  requireSetSlot(this, 'clear');
                  if (this._storage) {
                    this._storage = emptyObject();
                  }
                  if (this['[[SetData]]']) {
                    this['[[SetData]]'].clear();
                  }
                },

                values: function values() {
                  requireSetSlot(this, 'values');
                  ensureMap(this);
                  return this['[[SetData]]'].values();
                },

                entries: function entries() {
                  requireSetSlot(this, 'entries');
                  ensureMap(this);
                  return this['[[SetData]]'].entries();
                },

                forEach: function forEach(callback) {
                  requireSetSlot(this, 'forEach');
                  var context = arguments.length > 1 ? arguments[1] : null;
                  var entireSet = this;
                  ensureMap(entireSet);
                  this['[[SetData]]'].forEach(function (value, key) {
                    if (context) {
                      _call(callback, context, key, key, entireSet);
                    } else {
                      callback(key, key, entireSet);
                    }
                  });
                }
              });
              defineProperty(SetShim.prototype, 'keys', SetShim.prototype.values, true);
              addIterator(SetShim.prototype, SetShim.prototype.values);

              return SetShim;
            }()
          };

          if (globals.Map || globals.Set) {
            // Safari 8, for example, doesn't accept an iterable.
            var mapAcceptsArguments = valueOrFalseIfThrows(function () {
              return new Map([[1, 2]]).get(1) === 2;
            });
            if (!mapAcceptsArguments) {
              globals.Map = function Map() {
                if (!(this instanceof Map)) {
                  throw new TypeError('Constructor Map requires "new"');
                }
                var m = new OrigMap();
                if (arguments.length > 0) {
                  addIterableToMap(Map, m, arguments[0]);
                }
                delete m.constructor;
                Object.setPrototypeOf(m, globals.Map.prototype);
                return m;
              };
              globals.Map.prototype = create(OrigMap.prototype);
              defineProperty(globals.Map.prototype, 'constructor', globals.Map, true);
              Value.preserveToString(globals.Map, OrigMap);
            }
            var testMap = new Map();
            var mapUsesSameValueZero = function () {
              // Chrome 38-42, node 0.11/0.12, iojs 1/2 also have a bug when the Map has a size > 4
              var m = new Map([[1, 0], [2, 0], [3, 0], [4, 0]]);
              m.set(-0, m);
              return m.get(0) === m && m.get(-0) === m && m.has(0) && m.has(-0);
            }();
            var mapSupportsChaining = testMap.set(1, 2) === testMap;
            if (!mapUsesSameValueZero || !mapSupportsChaining) {
              overrideNative(Map.prototype, 'set', function set(k, v) {
                _call(origMapSet, this, k === 0 ? 0 : k, v);
                return this;
              });
            }
            if (!mapUsesSameValueZero) {
              defineProperties(Map.prototype, {
                get: function get(k) {
                  return _call(origMapGet, this, k === 0 ? 0 : k);
                },
                has: function has(k) {
                  return _call(origMapHas, this, k === 0 ? 0 : k);
                }
              }, true);
              Value.preserveToString(Map.prototype.get, origMapGet);
              Value.preserveToString(Map.prototype.has, origMapHas);
            }
            var testSet = new Set();
            var setUsesSameValueZero = function (s) {
              s['delete'](0);
              s.add(-0);
              return !s.has(0);
            }(testSet);
            var setSupportsChaining = testSet.add(1) === testSet;
            if (!setUsesSameValueZero || !setSupportsChaining) {
              var origSetAdd = Set.prototype.add;
              Set.prototype.add = function add(v) {
                _call(origSetAdd, this, v === 0 ? 0 : v);
                return this;
              };
              Value.preserveToString(Set.prototype.add, origSetAdd);
            }
            if (!setUsesSameValueZero) {
              var origSetHas = Set.prototype.has;
              Set.prototype.has = function has(v) {
                return _call(origSetHas, this, v === 0 ? 0 : v);
              };
              Value.preserveToString(Set.prototype.has, origSetHas);
              var origSetDel = Set.prototype['delete'];
              Set.prototype['delete'] = function SetDelete(v) {
                return _call(origSetDel, this, v === 0 ? 0 : v);
              };
              Value.preserveToString(Set.prototype['delete'], origSetDel);
            }
            var mapSupportsSubclassing = supportsSubclassing(globals.Map, function (M) {
              var m = new M([]);
              // Firefox 32 is ok with the instantiating the subclass but will
              // throw when the map is used.
              m.set(42, 42);
              return m instanceof M;
            });
            // without Object.setPrototypeOf, subclassing is not possible
            var mapFailsToSupportSubclassing = Object.setPrototypeOf && !mapSupportsSubclassing;
            var mapRequiresNew = function () {
              try {
                return !(globals.Map() instanceof globals.Map);
              } catch (e) {
                return e instanceof TypeError;
              }
            }();
            if (globals.Map.length !== 0 || mapFailsToSupportSubclassing || !mapRequiresNew) {
              globals.Map = function Map() {
                if (!(this instanceof Map)) {
                  throw new TypeError('Constructor Map requires "new"');
                }
                var m = new OrigMap();
                if (arguments.length > 0) {
                  addIterableToMap(Map, m, arguments[0]);
                }
                delete m.constructor;
                Object.setPrototypeOf(m, Map.prototype);
                return m;
              };
              globals.Map.prototype = OrigMap.prototype;
              defineProperty(globals.Map.prototype, 'constructor', globals.Map, true);
              Value.preserveToString(globals.Map, OrigMap);
            }
            var setSupportsSubclassing = supportsSubclassing(globals.Set, function (S) {
              var s = new S([]);
              s.add(42, 42);
              return s instanceof S;
            });
            // without Object.setPrototypeOf, subclassing is not possible
            var setFailsToSupportSubclassing = Object.setPrototypeOf && !setSupportsSubclassing;
            var setRequiresNew = function () {
              try {
                return !(globals.Set() instanceof globals.Set);
              } catch (e) {
                return e instanceof TypeError;
              }
            }();
            if (globals.Set.length !== 0 || setFailsToSupportSubclassing || !setRequiresNew) {
              var OrigSet = globals.Set;
              globals.Set = function Set() {
                if (!(this instanceof Set)) {
                  throw new TypeError('Constructor Set requires "new"');
                }
                var s = new OrigSet();
                if (arguments.length > 0) {
                  addIterableToSet(Set, s, arguments[0]);
                }
                delete s.constructor;
                Object.setPrototypeOf(s, Set.prototype);
                return s;
              };
              globals.Set.prototype = OrigSet.prototype;
              defineProperty(globals.Set.prototype, 'constructor', globals.Set, true);
              Value.preserveToString(globals.Set, OrigSet);
            }
            var newMap = new globals.Map();
            var mapIterationThrowsStopIterator = !valueOrFalseIfThrows(function () {
              return newMap.keys().next().done;
            });
            /*
              - In Firefox < 23, Map#size is a function.
              - In all current Firefox, Set#entries/keys/values & Map#clear do not exist
              - https://bugzilla.mozilla.org/show_bug.cgi?id=869996
              - In Firefox 24, Map and Set do not implement forEach
              - In Firefox 25 at least, Map and Set are callable without "new"
            */
            if (typeof globals.Map.prototype.clear !== 'function' || new globals.Set().size !== 0 || newMap.size !== 0 || typeof globals.Map.prototype.keys !== 'function' || typeof globals.Set.prototype.keys !== 'function' || typeof globals.Map.prototype.forEach !== 'function' || typeof globals.Set.prototype.forEach !== 'function' || isCallableWithoutNew(globals.Map) || isCallableWithoutNew(globals.Set) || typeof newMap.keys().next !== 'function' || // Safari 8
            mapIterationThrowsStopIterator || // Firefox 25
            !mapSupportsSubclassing) {
              defineProperties(globals, {
                Map: collectionShims.Map,
                Set: collectionShims.Set
              }, true);
            }

            if (globals.Set.prototype.keys !== globals.Set.prototype.values) {
              // Fixed in WebKit with https://bugs.webkit.org/show_bug.cgi?id=144190
              defineProperty(globals.Set.prototype, 'keys', globals.Set.prototype.values, true);
            }

            // Shim incomplete iterator implementations.
            addIterator(Object.getPrototypeOf(new globals.Map().keys()));
            addIterator(Object.getPrototypeOf(new globals.Set().keys()));

            if (functionsHaveNames && globals.Set.prototype.has.name !== 'has') {
              // Microsoft Edge v0.11.10074.0 is missing a name on Set#has
              var anonymousSetHas = globals.Set.prototype.has;
              overrideNative(globals.Set.prototype, 'has', function has(key) {
                return _call(anonymousSetHas, this, key);
              });
            }
          }
          defineProperties(globals, collectionShims);
          addDefaultSpecies(globals.Map);
          addDefaultSpecies(globals.Set);
        }

        var throwUnlessTargetIsObject = function throwUnlessTargetIsObject(target) {
          if (!ES.TypeIsObject(target)) {
            throw new TypeError('target must be an object');
          }
        };

        // Some Reflect methods are basically the same as
        // those on the Object global, except that a TypeError is thrown if
        // target isn't an object. As well as returning a boolean indicating
        // the success of the operation.
        var ReflectShims = {
          // Apply method in a functional form.
          apply: function apply() {
            return ES.Call(ES.Call, null, arguments);
          },

          // New operator in a functional form.
          construct: function construct(constructor, args) {
            if (!ES.IsConstructor(constructor)) {
              throw new TypeError('First argument must be a constructor.');
            }
            var newTarget = arguments.length > 2 ? arguments[2] : constructor;
            if (!ES.IsConstructor(newTarget)) {
              throw new TypeError('new.target must be a constructor.');
            }
            return ES.Construct(constructor, args, newTarget, 'internal');
          },

          // When deleting a non-existent or configurable property,
          // true is returned.
          // When attempting to delete a non-configurable property,
          // it will return false.
          deleteProperty: function deleteProperty(target, key) {
            throwUnlessTargetIsObject(target);
            if (supportsDescriptors) {
              var desc = Object.getOwnPropertyDescriptor(target, key);

              if (desc && !desc.configurable) {
                return false;
              }
            }

            // Will return true.
            return delete target[key];
          },

          has: function has(target, key) {
            throwUnlessTargetIsObject(target);
            return key in target;
          }
        };

        if (Object.getOwnPropertyNames) {
          Object.assign(ReflectShims, {
            // Basically the result of calling the internal [[OwnPropertyKeys]].
            // Concatenating propertyNames and propertySymbols should do the trick.
            // This should continue to work together with a Symbol shim
            // which overrides Object.getOwnPropertyNames and implements
            // Object.getOwnPropertySymbols.
            ownKeys: function ownKeys(target) {
              throwUnlessTargetIsObject(target);
              var keys = Object.getOwnPropertyNames(target);

              if (ES.IsCallable(Object.getOwnPropertySymbols)) {
                _pushApply(keys, Object.getOwnPropertySymbols(target));
              }

              return keys;
            }
          });
        }

        var callAndCatchException = function ConvertExceptionToBoolean(func) {
          return !throwsError(func);
        };

        if (Object.preventExtensions) {
          Object.assign(ReflectShims, {
            isExtensible: function isExtensible(target) {
              throwUnlessTargetIsObject(target);
              return Object.isExtensible(target);
            },
            preventExtensions: function preventExtensions(target) {
              throwUnlessTargetIsObject(target);
              return callAndCatchException(function () {
                Object.preventExtensions(target);
              });
            }
          });
        }

        if (supportsDescriptors) {
          var internalGet = function get(target, key, receiver) {
            var desc = Object.getOwnPropertyDescriptor(target, key);

            if (!desc) {
              var parent = Object.getPrototypeOf(target);

              if (parent === null) {
                return void 0;
              }

              return internalGet(parent, key, receiver);
            }

            if ('value' in desc) {
              return desc.value;
            }

            if (desc.get) {
              return ES.Call(desc.get, receiver);
            }

            return void 0;
          };

          var internalSet = function set(target, key, value, receiver) {
            var desc = Object.getOwnPropertyDescriptor(target, key);

            if (!desc) {
              var parent = Object.getPrototypeOf(target);

              if (parent !== null) {
                return internalSet(parent, key, value, receiver);
              }

              desc = {
                value: void 0,
                writable: true,
                enumerable: true,
                configurable: true
              };
            }

            if ('value' in desc) {
              if (!desc.writable) {
                return false;
              }

              if (!ES.TypeIsObject(receiver)) {
                return false;
              }

              var existingDesc = Object.getOwnPropertyDescriptor(receiver, key);

              if (existingDesc) {
                return Reflect.defineProperty(receiver, key, {
                  value: value
                });
              } else {
                return Reflect.defineProperty(receiver, key, {
                  value: value,
                  writable: true,
                  enumerable: true,
                  configurable: true
                });
              }
            }

            if (desc.set) {
              _call(desc.set, receiver, value);
              return true;
            }

            return false;
          };

          Object.assign(ReflectShims, {
            defineProperty: function defineProperty(target, propertyKey, attributes) {
              throwUnlessTargetIsObject(target);
              return callAndCatchException(function () {
                Object.defineProperty(target, propertyKey, attributes);
              });
            },

            getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
              throwUnlessTargetIsObject(target);
              return Object.getOwnPropertyDescriptor(target, propertyKey);
            },

            // Syntax in a functional form.
            get: function get(target, key) {
              throwUnlessTargetIsObject(target);
              var receiver = arguments.length > 2 ? arguments[2] : target;

              return internalGet(target, key, receiver);
            },

            set: function set(target, key, value) {
              throwUnlessTargetIsObject(target);
              var receiver = arguments.length > 3 ? arguments[3] : target;

              return internalSet(target, key, value, receiver);
            }
          });
        }

        if (Object.getPrototypeOf) {
          var objectDotGetPrototypeOf = Object.getPrototypeOf;
          ReflectShims.getPrototypeOf = function getPrototypeOf(target) {
            throwUnlessTargetIsObject(target);
            return objectDotGetPrototypeOf(target);
          };
        }

        if (Object.setPrototypeOf && ReflectShims.getPrototypeOf) {
          var willCreateCircularPrototype = function (object, lastProto) {
            var proto = lastProto;
            while (proto) {
              if (object === proto) {
                return true;
              }
              proto = ReflectShims.getPrototypeOf(proto);
            }
            return false;
          };

          Object.assign(ReflectShims, {
            // Sets the prototype of the given object.
            // Returns true on success, otherwise false.
            setPrototypeOf: function setPrototypeOf(object, proto) {
              throwUnlessTargetIsObject(object);
              if (proto !== null && !ES.TypeIsObject(proto)) {
                throw new TypeError('proto must be an object or null');
              }

              // If they already are the same, we're done.
              if (proto === Reflect.getPrototypeOf(object)) {
                return true;
              }

              // Cannot alter prototype if object not extensible.
              if (Reflect.isExtensible && !Reflect.isExtensible(object)) {
                return false;
              }

              // Ensure that we do not create a circular prototype chain.
              if (willCreateCircularPrototype(object, proto)) {
                return false;
              }

              Object.setPrototypeOf(object, proto);

              return true;
            }
          });
        }
        var defineOrOverrideReflectProperty = function (key, shim) {
          if (!ES.IsCallable(globals.Reflect[key])) {
            defineProperty(globals.Reflect, key, shim);
          } else {
            var acceptsPrimitives = valueOrFalseIfThrows(function () {
              globals.Reflect[key](1);
              globals.Reflect[key](NaN);
              globals.Reflect[key](true);
              return true;
            });
            if (acceptsPrimitives) {
              overrideNative(globals.Reflect, key, shim);
            }
          }
        };
        Object.keys(ReflectShims).forEach(function (key) {
          defineOrOverrideReflectProperty(key, ReflectShims[key]);
        });
        var originalReflectGetProto = globals.Reflect.getPrototypeOf;
        if (functionsHaveNames && originalReflectGetProto && originalReflectGetProto.name !== 'getPrototypeOf') {
          overrideNative(globals.Reflect, 'getPrototypeOf', function getPrototypeOf(target) {
            return _call(originalReflectGetProto, globals.Reflect, target);
          });
        }
        if (globals.Reflect.setPrototypeOf) {
          if (valueOrFalseIfThrows(function () {
            globals.Reflect.setPrototypeOf(1, {});
            return true;
          })) {
            overrideNative(globals.Reflect, 'setPrototypeOf', ReflectShims.setPrototypeOf);
          }
        }
        if (globals.Reflect.defineProperty) {
          if (!valueOrFalseIfThrows(function () {
            var basic = !globals.Reflect.defineProperty(1, 'test', { value: 1 });
            // "extensible" fails on Edge 0.12
            var extensible = typeof Object.preventExtensions !== 'function' || !globals.Reflect.defineProperty(Object.preventExtensions({}), 'test', {});
            return basic && extensible;
          })) {
            overrideNative(globals.Reflect, 'defineProperty', ReflectShims.defineProperty);
          }
        }
        if (globals.Reflect.construct) {
          if (!valueOrFalseIfThrows(function () {
            var F = function F() {};
            return globals.Reflect.construct(function () {}, [], F) instanceof F;
          })) {
            overrideNative(globals.Reflect, 'construct', ReflectShims.construct);
          }
        }

        if (String(new Date(NaN)) !== 'Invalid Date') {
          var dateToString = Date.prototype.toString;
          var shimmedDateToString = function toString() {
            var valueOf = +this;
            if (valueOf !== valueOf) {
              return 'Invalid Date';
            }
            return ES.Call(dateToString, this);
          };
          overrideNative(Date.prototype, 'toString', shimmedDateToString);
        }

        // Annex B HTML methods
        // http://www.ecma-international.org/ecma-262/6.0/#sec-additional-properties-of-the-string.prototype-object
        var stringHTMLshims = {
          anchor: function anchor(name) {
            return ES.CreateHTML(this, 'a', 'name', name);
          },
          big: function big() {
            return ES.CreateHTML(this, 'big', '', '');
          },
          blink: function blink() {
            return ES.CreateHTML(this, 'blink', '', '');
          },
          bold: function bold() {
            return ES.CreateHTML(this, 'b', '', '');
          },
          fixed: function fixed() {
            return ES.CreateHTML(this, 'tt', '', '');
          },
          fontcolor: function fontcolor(color) {
            return ES.CreateHTML(this, 'font', 'color', color);
          },
          fontsize: function fontsize(size) {
            return ES.CreateHTML(this, 'font', 'size', size);
          },
          italics: function italics() {
            return ES.CreateHTML(this, 'i', '', '');
          },
          link: function link(url) {
            return ES.CreateHTML(this, 'a', 'href', url);
          },
          small: function small() {
            return ES.CreateHTML(this, 'small', '', '');
          },
          strike: function strike() {
            return ES.CreateHTML(this, 'strike', '', '');
          },
          sub: function sub() {
            return ES.CreateHTML(this, 'sub', '', '');
          },
          sup: function sub() {
            return ES.CreateHTML(this, 'sup', '', '');
          }
        };
        _forEach(Object.keys(stringHTMLshims), function (key) {
          var method = String.prototype[key];
          var shouldOverwrite = false;
          if (ES.IsCallable(method)) {
            var output = _call(method, '', ' " ');
            var quotesCount = _concat([], output.match(/"/g)).length;
            shouldOverwrite = output !== output.toLowerCase() || quotesCount > 2;
          } else {
            shouldOverwrite = true;
          }
          if (shouldOverwrite) {
            overrideNative(String.prototype, key, stringHTMLshims[key]);
          }
        });

        var JSONstringifiesSymbols = function () {
          // Microsoft Edge v0.12 stringifies Symbols incorrectly
          if (!hasSymbols) {
            return false;
          } // Symbols are not supported
          var stringify = typeof JSON === 'object' && typeof JSON.stringify === 'function' ? JSON.stringify : null;
          if (!stringify) {
            return false;
          } // JSON.stringify is not supported
          if (typeof stringify(Symbol()) !== 'undefined') {
            return true;
          } // Symbols should become `undefined`
          if (stringify([Symbol()]) !== '[null]') {
            return true;
          } // Symbols in arrays should become `null`
          var obj = { a: Symbol() };
          obj[Symbol()] = true;
          if (stringify(obj) !== '{}') {
            return true;
          } // Symbol-valued keys *and* Symbol-valued properties should be omitted
          return false;
        }();
        var JSONstringifyAcceptsObjectSymbol = valueOrFalseIfThrows(function () {
          // Chrome 45 throws on stringifying object symbols
          if (!hasSymbols) {
            return true;
          } // Symbols are not supported
          return JSON.stringify(Object(Symbol())) === '{}' && JSON.stringify([Object(Symbol())]) === '[{}]';
        });
        if (JSONstringifiesSymbols || !JSONstringifyAcceptsObjectSymbol) {
          var origStringify = JSON.stringify;
          overrideNative(JSON, 'stringify', function stringify(value) {
            if (typeof value === 'symbol') {
              return;
            }
            var replacer;
            if (arguments.length > 1) {
              replacer = arguments[1];
            }
            var args = [value];
            if (!isArray(replacer)) {
              var replaceFn = ES.IsCallable(replacer) ? replacer : null;
              var wrappedReplacer = function (key, val) {
                var parsedValue = replaceFn ? _call(replaceFn, this, key, val) : val;
                if (typeof parsedValue !== 'symbol') {
                  if (Type.symbol(parsedValue)) {
                    return assignTo({})(parsedValue);
                  } else {
                    return parsedValue;
                  }
                }
              };
              args.push(wrappedReplacer);
            } else {
              // create wrapped replacer that handles an array replacer?
              args.push(replacer);
            }
            if (arguments.length > 2) {
              args.push(arguments[2]);
            }
            return origStringify.apply(this, args);
          });
        }

        return globals;
      });
    }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, { "_process": 19 }], 10: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || undefined;
    }
    module.exports = EventEmitter;

    // Backwards-compat with node 0.10.x
    EventEmitter.EventEmitter = EventEmitter;

    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._maxListeners = undefined;

    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    EventEmitter.defaultMaxListeners = 10;

    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function (n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
      this._maxListeners = n;
      return this;
    };

    EventEmitter.prototype.emit = function (type) {
      var er, handler, len, args, i, listeners;

      if (!this._events) this._events = {};

      // If there is no 'error' event listener then throw.
      if (type === 'error') {
        if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
          er = arguments[1];
          if (er instanceof Error) {
            throw er; // Unhandled 'error' event
          } else {
            // At least give some kind of context to the user
            var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
            err.context = er;
            throw err;
          }
        }
      }

      handler = this._events[type];

      if (isUndefined(handler)) return false;

      if (isFunction(handler)) {
        switch (arguments.length) {
          // fast cases
          case 1:
            handler.call(this);
            break;
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            args = Array.prototype.slice.call(arguments, 1);
            handler.apply(this, args);
        }
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }

      return true;
    };

    EventEmitter.prototype.addListener = function (type, listener) {
      var m;

      if (!isFunction(listener)) throw TypeError('listener must be a function');

      if (!this._events) this._events = {};

      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

      if (!this._events[type])
        // Optimize the case of one listener. Don't need the extra array object.
        this._events[type] = listener;else if (isObject(this._events[type]))
        // If we've already got an array, just append.
        this._events[type].push(listener);else
        // Adding the second element, need to change to array.
        this._events[type] = [this._events[type], listener];

      // Check for listener leak
      if (isObject(this._events[type]) && !this._events[type].warned) {
        if (!isUndefined(this._maxListeners)) {
          m = this._maxListeners;
        } else {
          m = EventEmitter.defaultMaxListeners;
        }

        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
          if (typeof console.trace === 'function') {
            // not supported in IE 10
            console.trace();
          }
        }
      }

      return this;
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.once = function (type, listener) {
      if (!isFunction(listener)) throw TypeError('listener must be a function');

      var fired = false;

      function g() {
        this.removeListener(type, g);

        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }

      g.listener = listener;
      this.on(type, g);

      return this;
    };

    // emits a 'removeListener' event iff the listener was removed
    EventEmitter.prototype.removeListener = function (type, listener) {
      var list, position, length, i;

      if (!isFunction(listener)) throw TypeError('listener must be a function');

      if (!this._events || !this._events[type]) return this;

      list = this._events[type];
      length = list.length;
      position = -1;

      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        if (this._events.removeListener) this.emit('removeListener', type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0;) {
          if (list[i] === listener || list[i].listener && list[i].listener === listener) {
            position = i;
            break;
          }
        }

        if (position < 0) return this;

        if (list.length === 1) {
          list.length = 0;
          delete this._events[type];
        } else {
          list.splice(position, 1);
        }

        if (this._events.removeListener) this.emit('removeListener', type, listener);
      }

      return this;
    };

    EventEmitter.prototype.removeAllListeners = function (type) {
      var key, listeners;

      if (!this._events) return this;

      // not listening for removeListener, no need to emit
      if (!this._events.removeListener) {
        if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        for (key in this._events) {
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = {};
        return this;
      }

      listeners = this._events[type];

      if (isFunction(listeners)) {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      }
      delete this._events[type];

      return this;
    };

    EventEmitter.prototype.listeners = function (type) {
      var ret;
      if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
      return ret;
    };

    EventEmitter.prototype.listenerCount = function (type) {
      if (this._events) {
        var evlistener = this._events[type];

        if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
      }
      return 0;
    };

    EventEmitter.listenerCount = function (emitter, type) {
      return emitter.listenerCount(type);
    };

    function isFunction(arg) {
      return typeof arg === 'function';
    }

    function isNumber(arg) {
      return typeof arg === 'number';
    }

    function isObject(arg) {
      return typeof arg === 'object' && arg !== null;
    }

    function isUndefined(arg) {
      return arg === void 0;
    }
  }, {}], 11: [function (require, module, exports) {
    var http = require('http');

    var https = module.exports;

    for (var key in http) {
      if (http.hasOwnProperty(key)) https[key] = http[key];
    };

    https.request = function (params, cb) {
      if (!params) params = {};
      params.scheme = 'https';
      params.protocol = 'https:';
      return http.request.call(this, params, cb);
    };
  }, { "http": 43 }], 12: [function (require, module, exports) {
    exports.read = function (buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];

      i += d;

      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };

    exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

      value = Math.abs(value);

      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }

        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }

      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

      buffer[offset + i - d] |= s * 128;
    };
  }, {}], 13: [function (require, module, exports) {
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      };
    } else {
      // old school shim for old browsers
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function () {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      };
    }
  }, {}], 14: [function (require, module, exports) {
    /*!
     * Determine if an object is a Buffer
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */

    // The _isBuffer check is for Safari 5-7 support, because it's missing
    // Object.prototype.constructor. Remove this eventually
    module.exports = function (obj) {
      return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
    };

    function isBuffer(obj) {
      return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
    }

    // For Node v0.10 support. Remove this eventually.
    function isSlowBuffer(obj) {
      return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));
    }
  }, {}], 15: [function (require, module, exports) {
    var toString = {}.toString;

    module.exports = Array.isArray || function (arr) {
      return toString.call(arr) == '[object Array]';
    };
  }, {}], 16: [function (require, module, exports) {
    (function (Buffer) {
      'use strict';

      var STREAM = require('stream'),
          UTIL = require('util'),
          StringDecoder = require('string_decoder').StringDecoder;

      function MemoryReadableStream(data, options) {
        if (!(this instanceof MemoryReadableStream)) return new MemoryReadableStream(data, options);
        MemoryReadableStream.super_.call(this, options);
        this.init(data, options);
      }
      UTIL.inherits(MemoryReadableStream, STREAM.Readable);

      function MemoryWritableStream(data, options) {
        if (!(this instanceof MemoryWritableStream)) return new MemoryWritableStream(data, options);
        MemoryWritableStream.super_.call(this, options);
        this.init(data, options);
      }
      UTIL.inherits(MemoryWritableStream, STREAM.Writable);

      function MemoryDuplexStream(data, options) {
        if (!(this instanceof MemoryDuplexStream)) return new MemoryDuplexStream(data, options);
        MemoryDuplexStream.super_.call(this, options);
        this.init(data, options);
      }
      UTIL.inherits(MemoryDuplexStream, STREAM.Duplex);

      MemoryReadableStream.prototype.init = MemoryWritableStream.prototype.init = MemoryDuplexStream.prototype.init = function init(data, options) {
        var self = this;
        this.queue = [];

        if (data) {
          if (!Array.isArray(data)) {
            data = [data];
          }

          data.forEach(function (chunk) {
            if (!(chunk instanceof Buffer)) {
              chunk = new Buffer(chunk);
            }
            self.queue.push(chunk);
          });
        }

        options = options || {};

        this.maxbufsize = options.hasOwnProperty('maxbufsize') ? options.maxbufsize : null;
        this.bufoverflow = options.hasOwnProperty('bufoverflow') ? options.bufoverflow : null;
        this.frequence = options.hasOwnProperty('frequence') ? options.frequence : null;
      };

      function MemoryStream(data, options) {
        if (!(this instanceof MemoryStream)) return new MemoryStream(data, options);

        options = options || {};

        var readable = options.hasOwnProperty('readable') ? options.readable : true,
            writable = options.hasOwnProperty('writable') ? options.writable : true;

        if (readable && writable) {
          return new MemoryDuplexStream(data, options);
        } else if (readable) {
          return new MemoryReadableStream(data, options);
        } else if (writable) {
          return new MemoryWritableStream(data, options);
        } else {
          throw new Error("Unknown stream type  Readable, Writable or Duplex ");
        }
      }

      MemoryStream.createReadStream = function (data, options) {
        options = options || {};
        options.readable = true;
        options.writable = false;

        return new MemoryStream(data, options);
      };

      MemoryStream.createWriteStream = function (data, options) {
        options = options || {};
        options.readable = false;
        options.writable = true;

        return new MemoryStream(data, options);
      };

      MemoryReadableStream.prototype._read = MemoryDuplexStream.prototype._read = function _read(n) {
        var self = this,
            frequence = self.frequence || 0,
            wait_data = this instanceof STREAM.Duplex && !this._writableState.finished ? true : false;
        if (!this.queue.length && !wait_data) {
          this.push(null); // finish stream
        } else if (this.queue.length) {
          setTimeout(function () {
            if (self.queue.length) {
              var chunk = self.queue.shift();
              if (chunk && !self._readableState.ended) {
                if (!self.push(chunk)) {
                  self.queue.unshift(chunk);
                }
              }
            }
          }, frequence);
        }
      };

      MemoryWritableStream.prototype._write = MemoryDuplexStream.prototype._write = function _write(chunk, encoding, cb) {
        var decoder = null;
        try {
          decoder = this.decodeStrings && encoding ? new StringDecoder(encoding) : null;
        } catch (err) {
          return cb(err);
        }

        var decoded_chunk = decoder ? decoder.write(chunk) : chunk,
            queue_size = this._getQueueSize(),
            chunk_size = decoded_chunk.length;

        if (this.maxbufsize && queue_size + chunk_size > this.maxbufsize) {
          if (this.bufoverflow) {
            return cb("Buffer overflowed (" + this.bufoverflow + "/" + queue_size + ")");
          } else {
            return cb();
          }
        }

        if (this instanceof STREAM.Duplex) {
          while (this.queue.length) {
            this.push(this.queue.shift());
          }
          this.push(decoded_chunk);
        } else {
          this.queue.push(decoded_chunk);
        }
        cb();
      };

      MemoryDuplexStream.prototype.end = function (chunk, encoding, cb) {
        var self = this;
        return MemoryDuplexStream.super_.prototype.end.call(this, chunk, encoding, function () {
          self.push(null); //finish readble stream too
          if (cb) cb();
        });
      };

      MemoryReadableStream.prototype._getQueueSize = MemoryWritableStream.prototype._getQueueSize = MemoryDuplexStream.prototype._getQueueSize = function () {
        var queuesize = 0,
            i;
        for (i = 0; i < this.queue.length; i++) {
          queuesize += Array.isArray(this.queue[i]) ? this.queue[i][0].length : this.queue[i].length;
        }
        return queuesize;
      };

      MemoryWritableStream.prototype.toString = MemoryDuplexStream.prototype.toString = MemoryReadableStream.prototype.toString = MemoryWritableStream.prototype.getAll = MemoryDuplexStream.prototype.getAll = MemoryReadableStream.prototype.getAll = function () {
        var self = this,
            ret = '';
        this.queue.forEach(function (data) {
          ret += data;
        });
        return ret;
      };

      MemoryWritableStream.prototype.toBuffer = MemoryDuplexStream.prototype.toBuffer = MemoryReadableStream.prototype.toBuffer = function () {
        var buffer = new Buffer(this._getQueueSize()),
            currentOffset = 0;

        this.queue.forEach(function (data) {
          var data_buffer = data instanceof Buffer ? data : new Buffer(data);
          data_buffer.copy(buffer, currentOffset);
          currentOffset += data.length;
        });
        return buffer;
      };

      module.exports = MemoryStream;
    }).call(this, require("buffer").Buffer);
  }, { "buffer": 6, "stream": 42, "string_decoder": 5, "util": 54 }], 17: [function (require, module, exports) {
    (function (process) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      // resolves . and .. elements in a path array with directory names there
      // must be no slashes, empty elements, or device names (c:\) in the array
      // (so also no leading and trailing slashes - it does not distinguish
      // relative and absolute paths)
      function normalizeArray(parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }

        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }

        return parts;
      }

      // Split a filename into [root, dir, basename, ext], unix version
      // 'root' is just a slash, or nothing.
      var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      var splitPath = function (filename) {
        return splitPathRe.exec(filename).slice(1);
      };

      // path.resolve([from ...], to)
      // posix version
      exports.resolve = function () {
        var resolvedPath = '',
            resolvedAbsolute = false;

        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = i >= 0 ? arguments[i] : process.cwd();

          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }

          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }

        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)

        // Normalize the path
        resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
          return !!p;
        }), !resolvedAbsolute).join('/');

        return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
      };

      // path.normalize(path)
      // posix version
      exports.normalize = function (path) {
        var isAbsolute = exports.isAbsolute(path),
            trailingSlash = substr(path, -1) === '/';

        // Normalize the path
        path = normalizeArray(filter(path.split('/'), function (p) {
          return !!p;
        }), !isAbsolute).join('/');

        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }

        return (isAbsolute ? '/' : '') + path;
      };

      // posix version
      exports.isAbsolute = function (path) {
        return path.charAt(0) === '/';
      };

      // posix version
      exports.join = function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return exports.normalize(filter(paths, function (p, index) {
          if (typeof p !== 'string') {
            throw new TypeError('Arguments to path.join must be strings');
          }
          return p;
        }).join('/'));
      };

      // path.relative(from, to)
      // posix version
      exports.relative = function (from, to) {
        from = exports.resolve(from).substr(1);
        to = exports.resolve(to).substr(1);

        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }

          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }

          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }

        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));

        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }

        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }

        outputParts = outputParts.concat(toParts.slice(samePartsLength));

        return outputParts.join('/');
      };

      exports.sep = '/';
      exports.delimiter = ':';

      exports.dirname = function (path) {
        var result = splitPath(path),
            root = result[0],
            dir = result[1];

        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }

        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }

        return root + dir;
      };

      exports.basename = function (path, ext) {
        var f = splitPath(path)[2];
        // TODO: make this comparison case-insensitive on windows?
        if (ext && f.substr(-1 * ext.length) === ext) {
          f = f.substr(0, f.length - ext.length);
        }
        return f;
      };

      exports.extname = function (path) {
        return splitPath(path)[3];
      };

      function filter(xs, f) {
        if (xs.filter) return xs.filter(f);
        var res = [];
        for (var i = 0; i < xs.length; i++) {
          if (f(xs[i], i, xs)) res.push(xs[i]);
        }
        return res;
      }

      // String.prototype.substr - negative index don't work in IE8
      var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
        return str.substr(start, len);
      } : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
      };
    }).call(this, require('_process'));
  }, { "_process": 19 }], 18: [function (require, module, exports) {
    (function (process) {
      'use strict';

      if (!process.version || process.version.indexOf('v0.') === 0 || process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
        module.exports = { nextTick: nextTick };
      } else {
        module.exports = process;
      }

      function nextTick(fn, arg1, arg2, arg3) {
        if (typeof fn !== 'function') {
          throw new TypeError('"callback" argument must be a function');
        }
        var len = arguments.length;
        var args, i;
        switch (len) {
          case 0:
          case 1:
            return process.nextTick(fn);
          case 2:
            return process.nextTick(function afterTickOne() {
              fn.call(null, arg1);
            });
          case 3:
            return process.nextTick(function afterTickTwo() {
              fn.call(null, arg1, arg2);
            });
          case 4:
            return process.nextTick(function afterTickThree() {
              fn.call(null, arg1, arg2, arg3);
            });
          default:
            args = new Array(len - 1);
            i = 0;
            while (i < args.length) {
              args[i++] = arguments[i];
            }
            return process.nextTick(function afterTick() {
              fn.apply(null, args);
            });
        }
      }
    }).call(this, require('_process'));
  }, { "_process": 19 }], 19: [function (require, module, exports) {
    // shim for using process in browser
    var process = module.exports = {};

    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    var cachedSetTimeout;
    var cachedClearTimeout;

    function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout() {
      throw new Error('clearTimeout has not been defined');
    }
    (function () {
      try {
        if (typeof setTimeout === 'function') {
          cachedSetTimeout = setTimeout;
        } else {
          cachedSetTimeout = defaultSetTimout;
        }
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        if (typeof clearTimeout === 'function') {
          cachedClearTimeout = clearTimeout;
        } else {
          cachedClearTimeout = defaultClearTimeout;
        }
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();
    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }
    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
          // Some versions of I.E. have different rules for clearTimeout vs setTimeout
          return cachedClearTimeout.call(this, marker);
        }
      }
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
      if (!draining || !currentQueue) {
        return;
      }
      draining = false;
      if (currentQueue.length) {
        queue = currentQueue.concat(queue);
      } else {
        queueIndex = -1;
      }
      if (queue.length) {
        drainQueue();
      }
    }

    function drainQueue() {
      if (draining) {
        return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
          if (currentQueue) {
            currentQueue[queueIndex].run();
          }
        }
        queueIndex = -1;
        len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }

    process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
      }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function () {
      this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;

    process.listeners = function (name) {
      return [];
    };

    process.binding = function (name) {
      throw new Error('process.binding is not supported');
    };

    process.cwd = function () {
      return '/';
    };
    process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
    };
    process.umask = function () {
      return 0;
    };
  }, {}], 20: [function (require, module, exports) {
    (function (global) {
      /*! https://mths.be/punycode v1.4.1 by @mathias */
      ;(function (root) {

        /** Detect free variables */
        var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
        var freeModule = typeof module == 'object' && module && !module.nodeType && module;
        var freeGlobal = typeof global == 'object' && global;
        if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
          root = freeGlobal;
        }

        /**
         * The `punycode` object.
         * @name punycode
         * @type Object
         */
        var punycode,


        /** Highest positive signed 32-bit float value */
        maxInt = 2147483647,
            // aka. 0x7FFFFFFF or 2^31-1

        /** Bootstring parameters */
        base = 36,
            tMin = 1,
            tMax = 26,
            skew = 38,
            damp = 700,
            initialBias = 72,
            initialN = 128,
            // 0x80
        delimiter = '-',
            // '\x2D'

        /** Regular expressions */
        regexPunycode = /^xn--/,
            regexNonASCII = /[^\x20-\x7E]/,
            // unprintable ASCII chars + non-ASCII chars
        regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
            // RFC 3490 separators

        /** Error messages */
        errors = {
          'overflow': 'Overflow: input needs wider integers to process',
          'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
          'invalid-input': 'Invalid input'
        },


        /** Convenience shortcuts */
        baseMinusTMin = base - tMin,
            floor = Math.floor,
            stringFromCharCode = String.fromCharCode,


        /** Temporary variable */
        key;

        /*--------------------------------------------------------------------------*/

        /**
         * A generic error utility function.
         * @private
         * @param {String} type The error type.
         * @returns {Error} Throws a `RangeError` with the applicable error message.
         */
        function error(type) {
          throw new RangeError(errors[type]);
        }

        /**
         * A generic `Array#map` utility function.
         * @private
         * @param {Array} array The array to iterate over.
         * @param {Function} callback The function that gets called for every array
         * item.
         * @returns {Array} A new array of values returned by the callback function.
         */
        function map(array, fn) {
          var length = array.length;
          var result = [];
          while (length--) {
            result[length] = fn(array[length]);
          }
          return result;
        }

        /**
         * A simple `Array#map`-like wrapper to work with domain name strings or email
         * addresses.
         * @private
         * @param {String} domain The domain name or email address.
         * @param {Function} callback The function that gets called for every
         * character.
         * @returns {Array} A new string of characters returned by the callback
         * function.
         */
        function mapDomain(string, fn) {
          var parts = string.split('@');
          var result = '';
          if (parts.length > 1) {
            // In email addresses, only the domain name should be punycoded. Leave
            // the local part (i.e. everything up to `@`) intact.
            result = parts[0] + '@';
            string = parts[1];
          }
          // Avoid `split(regex)` for IE8 compatibility. See #17.
          string = string.replace(regexSeparators, '\x2E');
          var labels = string.split('.');
          var encoded = map(labels, fn).join('.');
          return result + encoded;
        }

        /**
         * Creates an array containing the numeric code points of each Unicode
         * character in the string. While JavaScript uses UCS-2 internally,
         * this function will convert a pair of surrogate halves (each of which
         * UCS-2 exposes as separate characters) into a single code point,
         * matching UTF-16.
         * @see `punycode.ucs2.encode`
         * @see <https://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode.ucs2
         * @name decode
         * @param {String} string The Unicode input string (UCS-2).
         * @returns {Array} The new array of code points.
         */
        function ucs2decode(string) {
          var output = [],
              counter = 0,
              length = string.length,
              value,
              extra;
          while (counter < length) {
            value = string.charCodeAt(counter++);
            if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
              // high surrogate, and there is a next character
              extra = string.charCodeAt(counter++);
              if ((extra & 0xFC00) == 0xDC00) {
                // low surrogate
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
              } else {
                // unmatched surrogate; only append this code unit, in case the next
                // code unit is the high surrogate of a surrogate pair
                output.push(value);
                counter--;
              }
            } else {
              output.push(value);
            }
          }
          return output;
        }

        /**
         * Creates a string based on an array of numeric code points.
         * @see `punycode.ucs2.decode`
         * @memberOf punycode.ucs2
         * @name encode
         * @param {Array} codePoints The array of numeric code points.
         * @returns {String} The new Unicode string (UCS-2).
         */
        function ucs2encode(array) {
          return map(array, function (value) {
            var output = '';
            if (value > 0xFFFF) {
              value -= 0x10000;
              output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
              value = 0xDC00 | value & 0x3FF;
            }
            output += stringFromCharCode(value);
            return output;
          }).join('');
        }

        /**
         * Converts a basic code point into a digit/integer.
         * @see `digitToBasic()`
         * @private
         * @param {Number} codePoint The basic numeric code point value.
         * @returns {Number} The numeric value of a basic code point (for use in
         * representing integers) in the range `0` to `base - 1`, or `base` if
         * the code point does not represent a value.
         */
        function basicToDigit(codePoint) {
          if (codePoint - 48 < 10) {
            return codePoint - 22;
          }
          if (codePoint - 65 < 26) {
            return codePoint - 65;
          }
          if (codePoint - 97 < 26) {
            return codePoint - 97;
          }
          return base;
        }

        /**
         * Converts a digit/integer into a basic code point.
         * @see `basicToDigit()`
         * @private
         * @param {Number} digit The numeric value of a basic code point.
         * @returns {Number} The basic code point whose value (when used for
         * representing integers) is `digit`, which needs to be in the range
         * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
         * used; else, the lowercase form is used. The behavior is undefined
         * if `flag` is non-zero and `digit` has no uppercase form.
         */
        function digitToBasic(digit, flag) {
          //  0..25 map to ASCII a..z or A..Z
          // 26..35 map to ASCII 0..9
          return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
        }

        /**
         * Bias adaptation function as per section 3.4 of RFC 3492.
         * https://tools.ietf.org/html/rfc3492#section-3.4
         * @private
         */
        function adapt(delta, numPoints, firstTime) {
          var k = 0;
          delta = firstTime ? floor(delta / damp) : delta >> 1;
          delta += floor(delta / numPoints);
          for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
            delta = floor(delta / baseMinusTMin);
          }
          return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
        }

        /**
         * Converts a Punycode string of ASCII-only symbols to a string of Unicode
         * symbols.
         * @memberOf punycode
         * @param {String} input The Punycode string of ASCII-only symbols.
         * @returns {String} The resulting string of Unicode symbols.
         */
        function decode(input) {
          // Don't use UCS-2
          var output = [],
              inputLength = input.length,
              out,
              i = 0,
              n = initialN,
              bias = initialBias,
              basic,
              j,
              index,
              oldi,
              w,
              k,
              digit,
              t,

          /** Cached calculation results */
          baseMinusT;

          // Handle the basic code points: let `basic` be the number of input code
          // points before the last delimiter, or `0` if there is none, then copy
          // the first basic code points to the output.

          basic = input.lastIndexOf(delimiter);
          if (basic < 0) {
            basic = 0;
          }

          for (j = 0; j < basic; ++j) {
            // if it's not a basic code point
            if (input.charCodeAt(j) >= 0x80) {
              error('not-basic');
            }
            output.push(input.charCodeAt(j));
          }

          // Main decoding loop: start just after the last delimiter if any basic code
          // points were copied; start at the beginning otherwise.

          for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{

            // `index` is the index of the next character to be consumed.
            // Decode a generalized variable-length integer into `delta`,
            // which gets added to `i`. The overflow checking is easier
            // if we increase `i` as we go, then subtract off its starting
            // value at the end to obtain `delta`.
            for (oldi = i, w = 1, k = base;; /* no condition */k += base) {

              if (index >= inputLength) {
                error('invalid-input');
              }

              digit = basicToDigit(input.charCodeAt(index++));

              if (digit >= base || digit > floor((maxInt - i) / w)) {
                error('overflow');
              }

              i += digit * w;
              t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

              if (digit < t) {
                break;
              }

              baseMinusT = base - t;
              if (w > floor(maxInt / baseMinusT)) {
                error('overflow');
              }

              w *= baseMinusT;
            }

            out = output.length + 1;
            bias = adapt(i - oldi, out, oldi == 0);

            // `i` was supposed to wrap around from `out` to `0`,
            // incrementing `n` each time, so we'll fix that now:
            if (floor(i / out) > maxInt - n) {
              error('overflow');
            }

            n += floor(i / out);
            i %= out;

            // Insert `n` at position `i` of the output
            output.splice(i++, 0, n);
          }

          return ucs2encode(output);
        }

        /**
         * Converts a string of Unicode symbols (e.g. a domain name label) to a
         * Punycode string of ASCII-only symbols.
         * @memberOf punycode
         * @param {String} input The string of Unicode symbols.
         * @returns {String} The resulting Punycode string of ASCII-only symbols.
         */
        function encode(input) {
          var n,
              delta,
              handledCPCount,
              basicLength,
              bias,
              j,
              m,
              q,
              k,
              t,
              currentValue,
              output = [],

          /** `inputLength` will hold the number of code points in `input`. */
          inputLength,

          /** Cached calculation results */
          handledCPCountPlusOne,
              baseMinusT,
              qMinusT;

          // Convert the input in UCS-2 to Unicode
          input = ucs2decode(input);

          // Cache the length
          inputLength = input.length;

          // Initialize the state
          n = initialN;
          delta = 0;
          bias = initialBias;

          // Handle the basic code points
          for (j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue < 0x80) {
              output.push(stringFromCharCode(currentValue));
            }
          }

          handledCPCount = basicLength = output.length;

          // `handledCPCount` is the number of code points that have been handled;
          // `basicLength` is the number of basic code points.

          // Finish the basic string - if it is not empty - with a delimiter
          if (basicLength) {
            output.push(delimiter);
          }

          // Main encoding loop:
          while (handledCPCount < inputLength) {

            // All non-basic code points < n have been handled already. Find the next
            // larger one:
            for (m = maxInt, j = 0; j < inputLength; ++j) {
              currentValue = input[j];
              if (currentValue >= n && currentValue < m) {
                m = currentValue;
              }
            }

            // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
            // but guard against overflow
            handledCPCountPlusOne = handledCPCount + 1;
            if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
              error('overflow');
            }

            delta += (m - n) * handledCPCountPlusOne;
            n = m;

            for (j = 0; j < inputLength; ++j) {
              currentValue = input[j];

              if (currentValue < n && ++delta > maxInt) {
                error('overflow');
              }

              if (currentValue == n) {
                // Represent delta as a generalized variable-length integer
                for (q = delta, k = base;; /* no condition */k += base) {
                  t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                  if (q < t) {
                    break;
                  }
                  qMinusT = q - t;
                  baseMinusT = base - t;
                  output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
                  q = floor(qMinusT / baseMinusT);
                }

                output.push(stringFromCharCode(digitToBasic(q, 0)));
                bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                delta = 0;
                ++handledCPCount;
              }
            }

            ++delta;
            ++n;
          }
          return output.join('');
        }

        /**
         * Converts a Punycode string representing a domain name or an email address
         * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
         * it doesn't matter if you call it on a string that has already been
         * converted to Unicode.
         * @memberOf punycode
         * @param {String} input The Punycoded domain name or email address to
         * convert to Unicode.
         * @returns {String} The Unicode representation of the given Punycode
         * string.
         */
        function toUnicode(input) {
          return mapDomain(input, function (string) {
            return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
          });
        }

        /**
         * Converts a Unicode string representing a domain name or an email address to
         * Punycode. Only the non-ASCII parts of the domain name will be converted,
         * i.e. it doesn't matter if you call it with a domain that's already in
         * ASCII.
         * @memberOf punycode
         * @param {String} input The domain name or email address to convert, as a
         * Unicode string.
         * @returns {String} The Punycode representation of the given domain name or
         * email address.
         */
        function toASCII(input) {
          return mapDomain(input, function (string) {
            return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
          });
        }

        /*--------------------------------------------------------------------------*/

        /** Define the public API */
        punycode = {
          /**
           * A string representing the current Punycode.js version number.
           * @memberOf punycode
           * @type String
           */
          'version': '1.4.1',
          /**
           * An object of methods to convert from JavaScript's internal character
           * representation (UCS-2) to Unicode code points, and back.
           * @see <https://mathiasbynens.be/notes/javascript-encoding>
           * @memberOf punycode
           * @type Object
           */
          'ucs2': {
            'decode': ucs2decode,
            'encode': ucs2encode
          },
          'decode': decode,
          'encode': encode,
          'toASCII': toASCII,
          'toUnicode': toUnicode
        };

        /** Expose `punycode` */
        // Some AMD build optimizers, like r.js, check for specific condition patterns
        // like the following:
        if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
          define('punycode', function () {
            return punycode;
          });
        } else if (freeExports && freeModule) {
          if (module.exports == freeExports) {
            // in Node.js, io.js, or RingoJS v0.8.0+
            freeModule.exports = punycode;
          } else {
            // in Narwhal or RingoJS v0.7.0-
            for (key in punycode) {
              punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
            }
          }
        } else {
          // in Rhino or a web browser
          root.punycode = punycode;
        }
      })(this);
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {}], 21: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    'use strict';

    // If obj.hasOwnProperty has been overridden, then calling
    // obj.hasOwnProperty(prop) will break.
    // See: https://github.com/joyent/node/issues/1707

    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    module.exports = function (qs, sep, eq, options) {
      sep = sep || '&';
      eq = eq || '=';
      var obj = {};

      if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
      }

      var regexp = /\+/g;
      qs = qs.split(sep);

      var maxKeys = 1000;
      if (options && typeof options.maxKeys === 'number') {
        maxKeys = options.maxKeys;
      }

      var len = qs.length;
      // maxKeys <= 0 means that we should not limit keys count
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }

      for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, '%20'),
            idx = x.indexOf(eq),
            kstr,
            vstr,
            k,
            v;

        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = '';
        }

        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);

        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }

      return obj;
    };

    var isArray = Array.isArray || function (xs) {
      return Object.prototype.toString.call(xs) === '[object Array]';
    };
  }, {}], 22: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    'use strict';

    var stringifyPrimitive = function (v) {
      switch (typeof v) {
        case 'string':
          return v;

        case 'boolean':
          return v ? 'true' : 'false';

        case 'number':
          return isFinite(v) ? v : '';

        default:
          return '';
      }
    };

    module.exports = function (obj, sep, eq, name) {
      sep = sep || '&';
      eq = eq || '=';
      if (obj === null) {
        obj = undefined;
      }

      if (typeof obj === 'object') {
        return map(objectKeys(obj), function (k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (isArray(obj[k])) {
            return map(obj[k], function (v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);
      }

      if (!name) return '';
      return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
    };

    var isArray = Array.isArray || function (xs) {
      return Object.prototype.toString.call(xs) === '[object Array]';
    };

    function map(xs, f) {
      if (xs.map) return xs.map(f);
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i));
      }
      return res;
    }

    var objectKeys = Object.keys || function (obj) {
      var res = [];
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
      }
      return res;
    };
  }, {}], 23: [function (require, module, exports) {
    'use strict';

    exports.decode = exports.parse = require('./decode');
    exports.encode = exports.stringify = require('./encode');
  }, { "./decode": 21, "./encode": 22 }], 24: [function (require, module, exports) {
    module.exports = require('./lib/_stream_duplex.js');
  }, { "./lib/_stream_duplex.js": 25 }], 25: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    // a duplex stream is just a stream that is both readable and writable.
    // Since JS doesn't have multiple prototypal inheritance, this class
    // prototypally inherits from Readable, and then parasitically from
    // Writable.

    'use strict';

    /*<replacement>*/

    var pna = require('process-nextick-args');
    /*</replacement>*/

    /*<replacement>*/
    var objectKeys = Object.keys || function (obj) {
      var keys = [];
      for (var key in obj) {
        keys.push(key);
      }return keys;
    };
    /*</replacement>*/

    module.exports = Duplex;

    /*<replacement>*/
    var util = require('core-util-is');
    util.inherits = require('inherits');
    /*</replacement>*/

    var Readable = require('./_stream_readable');
    var Writable = require('./_stream_writable');

    util.inherits(Duplex, Readable);

    {
      // avoid scope creep, the keys array can then be collected
      var keys = objectKeys(Writable.prototype);
      for (var v = 0; v < keys.length; v++) {
        var method = keys[v];
        if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
      }
    }

    function Duplex(options) {
      if (!(this instanceof Duplex)) return new Duplex(options);

      Readable.call(this, options);
      Writable.call(this, options);

      if (options && options.readable === false) this.readable = false;

      if (options && options.writable === false) this.writable = false;

      this.allowHalfOpen = true;
      if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

      this.once('end', onend);
    }

    Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function () {
        return this._writableState.highWaterMark;
      }
    });

    // the no-half-open enforcer
    function onend() {
      // if we allow half-open state, or if the writable side ended,
      // then we're ok.
      if (this.allowHalfOpen || this._writableState.ended) return;

      // no more data can be written.
      // But allow more writes to happen in this tick.
      pna.nextTick(onEndNT, this);
    }

    function onEndNT(self) {
      self.end();
    }

    Object.defineProperty(Duplex.prototype, 'destroyed', {
      get: function () {
        if (this._readableState === undefined || this._writableState === undefined) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function (value) {
        // we ignore the value if the stream
        // has not been initialized yet
        if (this._readableState === undefined || this._writableState === undefined) {
          return;
        }

        // backward compatibility, the user is explicitly
        // managing destroyed
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });

    Duplex.prototype._destroy = function (err, cb) {
      this.push(null);
      this.end();

      pna.nextTick(cb, err);
    };
  }, { "./_stream_readable": 27, "./_stream_writable": 29, "core-util-is": 8, "inherits": 13, "process-nextick-args": 18 }], 26: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    // a passthrough stream.
    // basically just the most minimal sort of Transform stream.
    // Every written chunk gets output as-is.

    'use strict';

    module.exports = PassThrough;

    var Transform = require('./_stream_transform');

    /*<replacement>*/
    var util = require('core-util-is');
    util.inherits = require('inherits');
    /*</replacement>*/

    util.inherits(PassThrough, Transform);

    function PassThrough(options) {
      if (!(this instanceof PassThrough)) return new PassThrough(options);

      Transform.call(this, options);
    }

    PassThrough.prototype._transform = function (chunk, encoding, cb) {
      cb(null, chunk);
    };
  }, { "./_stream_transform": 28, "core-util-is": 8, "inherits": 13 }], 27: [function (require, module, exports) {
    (function (process, global) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      'use strict';

      /*<replacement>*/

      var pna = require('process-nextick-args');
      /*</replacement>*/

      module.exports = Readable;

      /*<replacement>*/
      var isArray = require('isarray');
      /*</replacement>*/

      /*<replacement>*/
      var Duplex;
      /*</replacement>*/

      Readable.ReadableState = ReadableState;

      /*<replacement>*/
      var EE = require('events').EventEmitter;

      var EElistenerCount = function (emitter, type) {
        return emitter.listeners(type).length;
      };
      /*</replacement>*/

      /*<replacement>*/
      var Stream = require('./internal/streams/stream');
      /*</replacement>*/

      /*<replacement>*/

      var Buffer = require('safe-buffer').Buffer;
      var OurUint8Array = global.Uint8Array || function () {};
      function _uint8ArrayToBuffer(chunk) {
        return Buffer.from(chunk);
      }
      function _isUint8Array(obj) {
        return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
      }

      /*</replacement>*/

      /*<replacement>*/
      var util = require('core-util-is');
      util.inherits = require('inherits');
      /*</replacement>*/

      /*<replacement>*/
      var debugUtil = require('util');
      var debug = void 0;
      if (debugUtil && debugUtil.debuglog) {
        debug = debugUtil.debuglog('stream');
      } else {
        debug = function () {};
      }
      /*</replacement>*/

      var BufferList = require('./internal/streams/BufferList');
      var destroyImpl = require('./internal/streams/destroy');
      var StringDecoder;

      util.inherits(Readable, Stream);

      var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

      function prependListener(emitter, event, fn) {
        // Sadly this is not cacheable as some libraries bundle their own
        // event emitter implementation with them.
        if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

        // This is a hack to make sure that our error handler is attached before any
        // userland ones.  NEVER DO THIS. This is here only because this code needs
        // to continue to work with older versions of Node.js that do not include
        // the prependListener() method. The goal is to eventually remove this hack.
        if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
      }

      function ReadableState(options, stream) {
        Duplex = Duplex || require('./_stream_duplex');

        options = options || {};

        // Duplex streams are both readable and writable, but share
        // the same options object.
        // However, some cases require setting options to different
        // values for the readable and the writable sides of the duplex stream.
        // These options can be provided separately as readableXXX and writableXXX.
        var isDuplex = stream instanceof Duplex;

        // object stream flag. Used to make read(n) ignore n and to
        // make all the buffer merging and length checks go away
        this.objectMode = !!options.objectMode;

        if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

        // the point at which it stops calling _read() to fill the buffer
        // Note: 0 is a valid value, means "don't call _read preemptively ever"
        var hwm = options.highWaterMark;
        var readableHwm = options.readableHighWaterMark;
        var defaultHwm = this.objectMode ? 16 : 16 * 1024;

        if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;

        // cast to ints.
        this.highWaterMark = Math.floor(this.highWaterMark);

        // A linked list is used to store data chunks instead of an array because the
        // linked list can remove elements from the beginning faster than
        // array.shift()
        this.buffer = new BufferList();
        this.length = 0;
        this.pipes = null;
        this.pipesCount = 0;
        this.flowing = null;
        this.ended = false;
        this.endEmitted = false;
        this.reading = false;

        // a flag to be able to tell if the event 'readable'/'data' is emitted
        // immediately, or on a later tick.  We set this to true at first, because
        // any actions that shouldn't happen until "later" should generally also
        // not happen before the first read call.
        this.sync = true;

        // whenever we return null, then we set a flag to say
        // that we're awaiting a 'readable' event emission.
        this.needReadable = false;
        this.emittedReadable = false;
        this.readableListening = false;
        this.resumeScheduled = false;

        // has it been destroyed
        this.destroyed = false;

        // Crypto is kind of old and crusty.  Historically, its default string
        // encoding is 'binary' so we have to make this configurable.
        // Everything else in the universe uses 'utf8', though.
        this.defaultEncoding = options.defaultEncoding || 'utf8';

        // the number of writers that are awaiting a drain event in .pipe()s
        this.awaitDrain = 0;

        // if true, a maybeReadMore has been scheduled
        this.readingMore = false;

        this.decoder = null;
        this.encoding = null;
        if (options.encoding) {
          if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
          this.decoder = new StringDecoder(options.encoding);
          this.encoding = options.encoding;
        }
      }

      function Readable(options) {
        Duplex = Duplex || require('./_stream_duplex');

        if (!(this instanceof Readable)) return new Readable(options);

        this._readableState = new ReadableState(options, this);

        // legacy
        this.readable = true;

        if (options) {
          if (typeof options.read === 'function') this._read = options.read;

          if (typeof options.destroy === 'function') this._destroy = options.destroy;
        }

        Stream.call(this);
      }

      Object.defineProperty(Readable.prototype, 'destroyed', {
        get: function () {
          if (this._readableState === undefined) {
            return false;
          }
          return this._readableState.destroyed;
        },
        set: function (value) {
          // we ignore the value if the stream
          // has not been initialized yet
          if (!this._readableState) {
            return;
          }

          // backward compatibility, the user is explicitly
          // managing destroyed
          this._readableState.destroyed = value;
        }
      });

      Readable.prototype.destroy = destroyImpl.destroy;
      Readable.prototype._undestroy = destroyImpl.undestroy;
      Readable.prototype._destroy = function (err, cb) {
        this.push(null);
        cb(err);
      };

      // Manually shove something into the read() buffer.
      // This returns true if the highWaterMark has not been hit yet,
      // similar to how Writable.write() returns true if you should
      // write() some more.
      Readable.prototype.push = function (chunk, encoding) {
        var state = this._readableState;
        var skipChunkCheck;

        if (!state.objectMode) {
          if (typeof chunk === 'string') {
            encoding = encoding || state.defaultEncoding;
            if (encoding !== state.encoding) {
              chunk = Buffer.from(chunk, encoding);
              encoding = '';
            }
            skipChunkCheck = true;
          }
        } else {
          skipChunkCheck = true;
        }

        return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
      };

      // Unshift should *always* be something directly out of read()
      Readable.prototype.unshift = function (chunk) {
        return readableAddChunk(this, chunk, null, true, false);
      };

      function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
        var state = stream._readableState;
        if (chunk === null) {
          state.reading = false;
          onEofChunk(stream, state);
        } else {
          var er;
          if (!skipChunkCheck) er = chunkInvalid(state, chunk);
          if (er) {
            stream.emit('error', er);
          } else if (state.objectMode || chunk && chunk.length > 0) {
            if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
              chunk = _uint8ArrayToBuffer(chunk);
            }

            if (addToFront) {
              if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
            } else if (state.ended) {
              stream.emit('error', new Error('stream.push() after EOF'));
            } else {
              state.reading = false;
              if (state.decoder && !encoding) {
                chunk = state.decoder.write(chunk);
                if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
              } else {
                addChunk(stream, state, chunk, false);
              }
            }
          } else if (!addToFront) {
            state.reading = false;
          }
        }

        return needMoreData(state);
      }

      function addChunk(stream, state, chunk, addToFront) {
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
        maybeReadMore(stream, state);
      }

      function chunkInvalid(state, chunk) {
        var er;
        if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
          er = new TypeError('Invalid non-string/buffer chunk');
        }
        return er;
      }

      // if it's past the high water mark, we can push in some more.
      // Also, if we have no data yet, we can stand some
      // more bytes.  This is to work around cases where hwm=0,
      // such as the repl.  Also, if the push() triggered a
      // readable event, and the user called read(largeNumber) such that
      // needReadable was set, then we ought to push more, so that another
      // 'readable' event will be triggered.
      function needMoreData(state) {
        return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
      }

      Readable.prototype.isPaused = function () {
        return this._readableState.flowing === false;
      };

      // backwards compatibility.
      Readable.prototype.setEncoding = function (enc) {
        if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
        this._readableState.decoder = new StringDecoder(enc);
        this._readableState.encoding = enc;
        return this;
      };

      // Don't raise the hwm > 8MB
      var MAX_HWM = 0x800000;
      function computeNewHighWaterMark(n) {
        if (n >= MAX_HWM) {
          n = MAX_HWM;
        } else {
          // Get the next highest power of 2 to prevent increasing hwm excessively in
          // tiny amounts
          n--;
          n |= n >>> 1;
          n |= n >>> 2;
          n |= n >>> 4;
          n |= n >>> 8;
          n |= n >>> 16;
          n++;
        }
        return n;
      }

      // This function is designed to be inlinable, so please take care when making
      // changes to the function body.
      function howMuchToRead(n, state) {
        if (n <= 0 || state.length === 0 && state.ended) return 0;
        if (state.objectMode) return 1;
        if (n !== n) {
          // Only flow one buffer at a time
          if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
        }
        // If we're asking for more than the current hwm, then raise the hwm.
        if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
        if (n <= state.length) return n;
        // Don't have enough
        if (!state.ended) {
          state.needReadable = true;
          return 0;
        }
        return state.length;
      }

      // you can override either this method, or the async _read(n) below.
      Readable.prototype.read = function (n) {
        debug('read', n);
        n = parseInt(n, 10);
        var state = this._readableState;
        var nOrig = n;

        if (n !== 0) state.emittedReadable = false;

        // if we're doing read(0) to trigger a readable event, but we
        // already have a bunch of data in the buffer, then just trigger
        // the 'readable' event and move on.
        if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
          debug('read: emitReadable', state.length, state.ended);
          if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
          return null;
        }

        n = howMuchToRead(n, state);

        // if we've ended, and we're now clear, then finish it up.
        if (n === 0 && state.ended) {
          if (state.length === 0) endReadable(this);
          return null;
        }

        // All the actual chunk generation logic needs to be
        // *below* the call to _read.  The reason is that in certain
        // synthetic stream cases, such as passthrough streams, _read
        // may be a completely synchronous operation which may change
        // the state of the read buffer, providing enough data when
        // before there was *not* enough.
        //
        // So, the steps are:
        // 1. Figure out what the state of things will be after we do
        // a read from the buffer.
        //
        // 2. If that resulting state will trigger a _read, then call _read.
        // Note that this may be asynchronous, or synchronous.  Yes, it is
        // deeply ugly to write APIs this way, but that still doesn't mean
        // that the Readable class should behave improperly, as streams are
        // designed to be sync/async agnostic.
        // Take note if the _read call is sync or async (ie, if the read call
        // has returned yet), so that we know whether or not it's safe to emit
        // 'readable' etc.
        //
        // 3. Actually pull the requested chunks out of the buffer and return.

        // if we need a readable event, then we need to do some reading.
        var doRead = state.needReadable;
        debug('need readable', doRead);

        // if we currently have less than the highWaterMark, then also read some
        if (state.length === 0 || state.length - n < state.highWaterMark) {
          doRead = true;
          debug('length less than watermark', doRead);
        }

        // however, if we've ended, then there's no point, and if we're already
        // reading, then it's unnecessary.
        if (state.ended || state.reading) {
          doRead = false;
          debug('reading or ended', doRead);
        } else if (doRead) {
          debug('do read');
          state.reading = true;
          state.sync = true;
          // if the length is currently zero, then we *need* a readable event.
          if (state.length === 0) state.needReadable = true;
          // call internal read method
          this._read(state.highWaterMark);
          state.sync = false;
          // If _read pushed data synchronously, then `reading` will be false,
          // and we need to re-evaluate how much data we can return to the user.
          if (!state.reading) n = howMuchToRead(nOrig, state);
        }

        var ret;
        if (n > 0) ret = fromList(n, state);else ret = null;

        if (ret === null) {
          state.needReadable = true;
          n = 0;
        } else {
          state.length -= n;
        }

        if (state.length === 0) {
          // If we have nothing in the buffer, then we want to know
          // as soon as we *do* get something into the buffer.
          if (!state.ended) state.needReadable = true;

          // If we tried to read() past the EOF, then emit end on the next tick.
          if (nOrig !== n && state.ended) endReadable(this);
        }

        if (ret !== null) this.emit('data', ret);

        return ret;
      };

      function onEofChunk(stream, state) {
        if (state.ended) return;
        if (state.decoder) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length) {
            state.buffer.push(chunk);
            state.length += state.objectMode ? 1 : chunk.length;
          }
        }
        state.ended = true;

        // emit 'readable' now to make sure it gets picked up.
        emitReadable(stream);
      }

      // Don't emit readable right away in sync mode, because this can trigger
      // another read() call => stack overflow.  This way, it might trigger
      // a nextTick recursion warning, but that's not so bad.
      function emitReadable(stream) {
        var state = stream._readableState;
        state.needReadable = false;
        if (!state.emittedReadable) {
          debug('emitReadable', state.flowing);
          state.emittedReadable = true;
          if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
        }
      }

      function emitReadable_(stream) {
        debug('emit readable');
        stream.emit('readable');
        flow(stream);
      }

      // at this point, the user has presumably seen the 'readable' event,
      // and called read() to consume some data.  that may have triggered
      // in turn another _read(n) call, in which case reading = true if
      // it's in progress.
      // However, if we're not ended, or reading, and the length < hwm,
      // then go ahead and try to read some more preemptively.
      function maybeReadMore(stream, state) {
        if (!state.readingMore) {
          state.readingMore = true;
          pna.nextTick(maybeReadMore_, stream, state);
        }
      }

      function maybeReadMore_(stream, state) {
        var len = state.length;
        while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
          debug('maybeReadMore read 0');
          stream.read(0);
          if (len === state.length)
            // didn't get any data, stop spinning.
            break;else len = state.length;
        }
        state.readingMore = false;
      }

      // abstract method.  to be overridden in specific implementation classes.
      // call cb(er, data) where data is <= n in length.
      // for virtual (non-string, non-buffer) streams, "length" is somewhat
      // arbitrary, and perhaps not very meaningful.
      Readable.prototype._read = function (n) {
        this.emit('error', new Error('_read() is not implemented'));
      };

      Readable.prototype.pipe = function (dest, pipeOpts) {
        var src = this;
        var state = this._readableState;

        switch (state.pipesCount) {
          case 0:
            state.pipes = dest;
            break;
          case 1:
            state.pipes = [state.pipes, dest];
            break;
          default:
            state.pipes.push(dest);
            break;
        }
        state.pipesCount += 1;
        debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

        var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

        var endFn = doEnd ? onend : unpipe;
        if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);

        dest.on('unpipe', onunpipe);
        function onunpipe(readable, unpipeInfo) {
          debug('onunpipe');
          if (readable === src) {
            if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
              unpipeInfo.hasUnpiped = true;
              cleanup();
            }
          }
        }

        function onend() {
          debug('onend');
          dest.end();
        }

        // when the dest drains, it reduces the awaitDrain counter
        // on the source.  This would be more elegant with a .once()
        // handler in flow(), but adding and removing repeatedly is
        // too slow.
        var ondrain = pipeOnDrain(src);
        dest.on('drain', ondrain);

        var cleanedUp = false;
        function cleanup() {
          debug('cleanup');
          // cleanup event handlers once the pipe is broken
          dest.removeListener('close', onclose);
          dest.removeListener('finish', onfinish);
          dest.removeListener('drain', ondrain);
          dest.removeListener('error', onerror);
          dest.removeListener('unpipe', onunpipe);
          src.removeListener('end', onend);
          src.removeListener('end', unpipe);
          src.removeListener('data', ondata);

          cleanedUp = true;

          // if the reader is waiting for a drain event from this
          // specific writer, then it would cause it to never start
          // flowing again.
          // So, if this is awaiting a drain, then we just call it now.
          // If we don't know, then assume that we are waiting for one.
          if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
        }

        // If the user pushes more data while we're writing to dest then we'll end up
        // in ondata again. However, we only want to increase awaitDrain once because
        // dest will only emit one 'drain' event for the multiple writes.
        // => Introduce a guard on increasing awaitDrain.
        var increasedAwaitDrain = false;
        src.on('data', ondata);
        function ondata(chunk) {
          debug('ondata');
          increasedAwaitDrain = false;
          var ret = dest.write(chunk);
          if (false === ret && !increasedAwaitDrain) {
            // If the user unpiped during `dest.write()`, it is possible
            // to get stuck in a permanently paused state if that write
            // also returned false.
            // => Check whether `dest` is still a piping destination.
            if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
              debug('false write response, pause', src._readableState.awaitDrain);
              src._readableState.awaitDrain++;
              increasedAwaitDrain = true;
            }
            src.pause();
          }
        }

        // if the dest has an error, then stop piping into it.
        // however, don't suppress the throwing behavior for this.
        function onerror(er) {
          debug('onerror', er);
          unpipe();
          dest.removeListener('error', onerror);
          if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
        }

        // Make sure our error handler is attached before userland ones.
        prependListener(dest, 'error', onerror);

        // Both close and finish should trigger unpipe, but only once.
        function onclose() {
          dest.removeListener('finish', onfinish);
          unpipe();
        }
        dest.once('close', onclose);
        function onfinish() {
          debug('onfinish');
          dest.removeListener('close', onclose);
          unpipe();
        }
        dest.once('finish', onfinish);

        function unpipe() {
          debug('unpipe');
          src.unpipe(dest);
        }

        // tell the dest that it's being piped to
        dest.emit('pipe', src);

        // start the flow if it hasn't been started already.
        if (!state.flowing) {
          debug('pipe resume');
          src.resume();
        }

        return dest;
      };

      function pipeOnDrain(src) {
        return function () {
          var state = src._readableState;
          debug('pipeOnDrain', state.awaitDrain);
          if (state.awaitDrain) state.awaitDrain--;
          if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
            state.flowing = true;
            flow(src);
          }
        };
      }

      Readable.prototype.unpipe = function (dest) {
        var state = this._readableState;
        var unpipeInfo = { hasUnpiped: false };

        // if we're not piping anywhere, then do nothing.
        if (state.pipesCount === 0) return this;

        // just one destination.  most common case.
        if (state.pipesCount === 1) {
          // passed in one, but it's not the right one.
          if (dest && dest !== state.pipes) return this;

          if (!dest) dest = state.pipes;

          // got a match.
          state.pipes = null;
          state.pipesCount = 0;
          state.flowing = false;
          if (dest) dest.emit('unpipe', this, unpipeInfo);
          return this;
        }

        // slow case. multiple pipe destinations.

        if (!dest) {
          // remove all.
          var dests = state.pipes;
          var len = state.pipesCount;
          state.pipes = null;
          state.pipesCount = 0;
          state.flowing = false;

          for (var i = 0; i < len; i++) {
            dests[i].emit('unpipe', this, unpipeInfo);
          }return this;
        }

        // try to find the right one.
        var index = indexOf(state.pipes, dest);
        if (index === -1) return this;

        state.pipes.splice(index, 1);
        state.pipesCount -= 1;
        if (state.pipesCount === 1) state.pipes = state.pipes[0];

        dest.emit('unpipe', this, unpipeInfo);

        return this;
      };

      // set up data events if they are asked for
      // Ensure readable listeners eventually get something
      Readable.prototype.on = function (ev, fn) {
        var res = Stream.prototype.on.call(this, ev, fn);

        if (ev === 'data') {
          // Start flowing on next tick if stream isn't explicitly paused
          if (this._readableState.flowing !== false) this.resume();
        } else if (ev === 'readable') {
          var state = this._readableState;
          if (!state.endEmitted && !state.readableListening) {
            state.readableListening = state.needReadable = true;
            state.emittedReadable = false;
            if (!state.reading) {
              pna.nextTick(nReadingNextTick, this);
            } else if (state.length) {
              emitReadable(this);
            }
          }
        }

        return res;
      };
      Readable.prototype.addListener = Readable.prototype.on;

      function nReadingNextTick(self) {
        debug('readable nexttick read 0');
        self.read(0);
      }

      // pause() and resume() are remnants of the legacy readable stream API
      // If the user uses them, then switch into old mode.
      Readable.prototype.resume = function () {
        var state = this._readableState;
        if (!state.flowing) {
          debug('resume');
          state.flowing = true;
          resume(this, state);
        }
        return this;
      };

      function resume(stream, state) {
        if (!state.resumeScheduled) {
          state.resumeScheduled = true;
          pna.nextTick(resume_, stream, state);
        }
      }

      function resume_(stream, state) {
        if (!state.reading) {
          debug('resume read 0');
          stream.read(0);
        }

        state.resumeScheduled = false;
        state.awaitDrain = 0;
        stream.emit('resume');
        flow(stream);
        if (state.flowing && !state.reading) stream.read(0);
      }

      Readable.prototype.pause = function () {
        debug('call pause flowing=%j', this._readableState.flowing);
        if (false !== this._readableState.flowing) {
          debug('pause');
          this._readableState.flowing = false;
          this.emit('pause');
        }
        return this;
      };

      function flow(stream) {
        var state = stream._readableState;
        debug('flow', state.flowing);
        while (state.flowing && stream.read() !== null) {}
      }

      // wrap an old-style stream as the async data source.
      // This is *not* part of the readable stream interface.
      // It is an ugly unfortunate mess of history.
      Readable.prototype.wrap = function (stream) {
        var _this = this;

        var state = this._readableState;
        var paused = false;

        stream.on('end', function () {
          debug('wrapped end');
          if (state.decoder && !state.ended) {
            var chunk = state.decoder.end();
            if (chunk && chunk.length) _this.push(chunk);
          }

          _this.push(null);
        });

        stream.on('data', function (chunk) {
          debug('wrapped data');
          if (state.decoder) chunk = state.decoder.write(chunk);

          // don't skip over falsy values in objectMode
          if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

          var ret = _this.push(chunk);
          if (!ret) {
            paused = true;
            stream.pause();
          }
        });

        // proxy all the other methods.
        // important when wrapping filters and duplexes.
        for (var i in stream) {
          if (this[i] === undefined && typeof stream[i] === 'function') {
            this[i] = function (method) {
              return function () {
                return stream[method].apply(stream, arguments);
              };
            }(i);
          }
        }

        // proxy certain important events.
        for (var n = 0; n < kProxyEvents.length; n++) {
          stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
        }

        // when we try to consume some more bytes, simply unpause the
        // underlying stream.
        this._read = function (n) {
          debug('wrapped _read', n);
          if (paused) {
            paused = false;
            stream.resume();
          }
        };

        return this;
      };

      Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function () {
          return this._readableState.highWaterMark;
        }
      });

      // exposed for testing purposes only.
      Readable._fromList = fromList;

      // Pluck off n bytes from an array of buffers.
      // Length is the combined lengths of all the buffers in the list.
      // This function is designed to be inlinable, so please take care when making
      // changes to the function body.
      function fromList(n, state) {
        // nothing buffered
        if (state.length === 0) return null;

        var ret;
        if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
          // read it all, truncate the list
          if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
          state.buffer.clear();
        } else {
          // read part of list
          ret = fromListPartial(n, state.buffer, state.decoder);
        }

        return ret;
      }

      // Extracts only enough buffered data to satisfy the amount requested.
      // This function is designed to be inlinable, so please take care when making
      // changes to the function body.
      function fromListPartial(n, list, hasStrings) {
        var ret;
        if (n < list.head.data.length) {
          // slice is the same for buffers and strings
          ret = list.head.data.slice(0, n);
          list.head.data = list.head.data.slice(n);
        } else if (n === list.head.data.length) {
          // first chunk is a perfect match
          ret = list.shift();
        } else {
          // result spans more than one buffer
          ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
        }
        return ret;
      }

      // Copies a specified amount of characters from the list of buffered data
      // chunks.
      // This function is designed to be inlinable, so please take care when making
      // changes to the function body.
      function copyFromBufferString(n, list) {
        var p = list.head;
        var c = 1;
        var ret = p.data;
        n -= ret.length;
        while (p = p.next) {
          var str = p.data;
          var nb = n > str.length ? str.length : n;
          if (nb === str.length) ret += str;else ret += str.slice(0, n);
          n -= nb;
          if (n === 0) {
            if (nb === str.length) {
              ++c;
              if (p.next) list.head = p.next;else list.head = list.tail = null;
            } else {
              list.head = p;
              p.data = str.slice(nb);
            }
            break;
          }
          ++c;
        }
        list.length -= c;
        return ret;
      }

      // Copies a specified amount of bytes from the list of buffered data chunks.
      // This function is designed to be inlinable, so please take care when making
      // changes to the function body.
      function copyFromBuffer(n, list) {
        var ret = Buffer.allocUnsafe(n);
        var p = list.head;
        var c = 1;
        p.data.copy(ret);
        n -= p.data.length;
        while (p = p.next) {
          var buf = p.data;
          var nb = n > buf.length ? buf.length : n;
          buf.copy(ret, ret.length - n, 0, nb);
          n -= nb;
          if (n === 0) {
            if (nb === buf.length) {
              ++c;
              if (p.next) list.head = p.next;else list.head = list.tail = null;
            } else {
              list.head = p;
              p.data = buf.slice(nb);
            }
            break;
          }
          ++c;
        }
        list.length -= c;
        return ret;
      }

      function endReadable(stream) {
        var state = stream._readableState;

        // If we get here before consuming all the bytes, then that is a
        // bug in node.  Should never happen.
        if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

        if (!state.endEmitted) {
          state.ended = true;
          pna.nextTick(endReadableNT, state, stream);
        }
      }

      function endReadableNT(state, stream) {
        // Check that we didn't get one last unshift.
        if (!state.endEmitted && state.length === 0) {
          state.endEmitted = true;
          stream.readable = false;
          stream.emit('end');
        }
      }

      function indexOf(xs, x) {
        for (var i = 0, l = xs.length; i < l; i++) {
          if (xs[i] === x) return i;
        }
        return -1;
      }
    }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, { "./_stream_duplex": 25, "./internal/streams/BufferList": 30, "./internal/streams/destroy": 31, "./internal/streams/stream": 32, "_process": 19, "core-util-is": 8, "events": 10, "inherits": 13, "isarray": 15, "process-nextick-args": 18, "safe-buffer": 38, "string_decoder/": 47, "util": 3 }], 28: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    // a transform stream is a readable/writable stream where you do
    // something with the data.  Sometimes it's called a "filter",
    // but that's not a great name for it, since that implies a thing where
    // some bits pass through, and others are simply ignored.  (That would
    // be a valid example of a transform, of course.)
    //
    // While the output is causally related to the input, it's not a
    // necessarily symmetric or synchronous transformation.  For example,
    // a zlib stream might take multiple plain-text writes(), and then
    // emit a single compressed chunk some time in the future.
    //
    // Here's how this works:
    //
    // The Transform stream has all the aspects of the readable and writable
    // stream classes.  When you write(chunk), that calls _write(chunk,cb)
    // internally, and returns false if there's a lot of pending writes
    // buffered up.  When you call read(), that calls _read(n) until
    // there's enough pending readable data buffered up.
    //
    // In a transform stream, the written data is placed in a buffer.  When
    // _read(n) is called, it transforms the queued up data, calling the
    // buffered _write cb's as it consumes chunks.  If consuming a single
    // written chunk would result in multiple output chunks, then the first
    // outputted bit calls the readcb, and subsequent chunks just go into
    // the read buffer, and will cause it to emit 'readable' if necessary.
    //
    // This way, back-pressure is actually determined by the reading side,
    // since _read has to be called to start processing a new chunk.  However,
    // a pathological inflate type of transform can cause excessive buffering
    // here.  For example, imagine a stream where every byte of input is
    // interpreted as an integer from 0-255, and then results in that many
    // bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
    // 1kb of data being output.  In this case, you could write a very small
    // amount of input, and end up with a very large amount of output.  In
    // such a pathological inflating mechanism, there'd be no way to tell
    // the system to stop doing the transform.  A single 4MB write could
    // cause the system to run out of memory.
    //
    // However, even in such a pathological case, only a single written chunk
    // would be consumed, and then the rest would wait (un-transformed) until
    // the results of the previous transformed chunk were consumed.

    'use strict';

    module.exports = Transform;

    var Duplex = require('./_stream_duplex');

    /*<replacement>*/
    var util = require('core-util-is');
    util.inherits = require('inherits');
    /*</replacement>*/

    util.inherits(Transform, Duplex);

    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;

      var cb = ts.writecb;

      if (!cb) {
        return this.emit('error', new Error('write callback called multiple times'));
      }

      ts.writechunk = null;
      ts.writecb = null;

      if (data != null) // single equals check for both `null` and `undefined`
        this.push(data);

      cb(er);

      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }

    function Transform(options) {
      if (!(this instanceof Transform)) return new Transform(options);

      Duplex.call(this, options);

      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };

      // start out asking for a readable event once data is transformed.
      this._readableState.needReadable = true;

      // we have implemented the _read method, and done the other things
      // that Readable wants before the first _read call, so unset the
      // sync guard flag.
      this._readableState.sync = false;

      if (options) {
        if (typeof options.transform === 'function') this._transform = options.transform;

        if (typeof options.flush === 'function') this._flush = options.flush;
      }

      // When the writable side finishes, then flush out anything remaining.
      this.on('prefinish', prefinish);
    }

    function prefinish() {
      var _this = this;

      if (typeof this._flush === 'function') {
        this._flush(function (er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }

    Transform.prototype.push = function (chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };

    // This is the part where you do stuff!
    // override this function in implementation classes.
    // 'chunk' is an input chunk.
    //
    // Call `push(newChunk)` to pass along transformed output
    // to the readable side.  You may call 'push' zero or more times.
    //
    // Call `cb(err)` when you are done with this chunk.  If you pass
    // an error, then that'll put the hurt on the whole operation.  If you
    // never call cb(), then you'll never get another chunk.
    Transform.prototype._transform = function (chunk, encoding, cb) {
      throw new Error('_transform() is not implemented');
    };

    Transform.prototype._write = function (chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
      }
    };

    // Doesn't matter what the args are here.
    // _transform does all the work.
    // That we got here means that the readable side wants more data.
    Transform.prototype._read = function (n) {
      var ts = this._transformState;

      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        // mark that we need a transform, so that any data that comes in
        // will get processed, now that we've asked for it.
        ts.needTransform = true;
      }
    };

    Transform.prototype._destroy = function (err, cb) {
      var _this2 = this;

      Duplex.prototype._destroy.call(this, err, function (err2) {
        cb(err2);
        _this2.emit('close');
      });
    };

    function done(stream, er, data) {
      if (er) return stream.emit('error', er);

      if (data != null) // single equals check for both `null` and `undefined`
        stream.push(data);

      // if there's nothing in the write buffer, then that means
      // that nothing more will ever be provided
      if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

      if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');

      return stream.push(null);
    }
  }, { "./_stream_duplex": 25, "core-util-is": 8, "inherits": 13 }], 29: [function (require, module, exports) {
    (function (process, global) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      // A bit simpler than readable streams.
      // Implement an async ._write(chunk, encoding, cb), and it'll handle all
      // the drain event emission and buffering.

      'use strict';

      /*<replacement>*/

      var pna = require('process-nextick-args');
      /*</replacement>*/

      module.exports = Writable;

      /* <replacement> */
      function WriteReq(chunk, encoding, cb) {
        this.chunk = chunk;
        this.encoding = encoding;
        this.callback = cb;
        this.next = null;
      }

      // It seems a linked list but it is not
      // there will be only 2 of these for each stream
      function CorkedRequest(state) {
        var _this = this;

        this.next = null;
        this.entry = null;
        this.finish = function () {
          onCorkedFinish(_this, state);
        };
      }
      /* </replacement> */

      /*<replacement>*/
      var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
      /*</replacement>*/

      /*<replacement>*/
      var Duplex;
      /*</replacement>*/

      Writable.WritableState = WritableState;

      /*<replacement>*/
      var util = require('core-util-is');
      util.inherits = require('inherits');
      /*</replacement>*/

      /*<replacement>*/
      var internalUtil = {
        deprecate: require('util-deprecate')
      };
      /*</replacement>*/

      /*<replacement>*/
      var Stream = require('./internal/streams/stream');
      /*</replacement>*/

      /*<replacement>*/

      var Buffer = require('safe-buffer').Buffer;
      var OurUint8Array = global.Uint8Array || function () {};
      function _uint8ArrayToBuffer(chunk) {
        return Buffer.from(chunk);
      }
      function _isUint8Array(obj) {
        return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
      }

      /*</replacement>*/

      var destroyImpl = require('./internal/streams/destroy');

      util.inherits(Writable, Stream);

      function nop() {}

      function WritableState(options, stream) {
        Duplex = Duplex || require('./_stream_duplex');

        options = options || {};

        // Duplex streams are both readable and writable, but share
        // the same options object.
        // However, some cases require setting options to different
        // values for the readable and the writable sides of the duplex stream.
        // These options can be provided separately as readableXXX and writableXXX.
        var isDuplex = stream instanceof Duplex;

        // object stream flag to indicate whether or not this stream
        // contains buffers or objects.
        this.objectMode = !!options.objectMode;

        if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

        // the point at which write() starts returning false
        // Note: 0 is a valid value, means that we always return false if
        // the entire buffer is not flushed immediately on write()
        var hwm = options.highWaterMark;
        var writableHwm = options.writableHighWaterMark;
        var defaultHwm = this.objectMode ? 16 : 16 * 1024;

        if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm;

        // cast to ints.
        this.highWaterMark = Math.floor(this.highWaterMark);

        // if _final has been called
        this.finalCalled = false;

        // drain event flag.
        this.needDrain = false;
        // at the start of calling end()
        this.ending = false;
        // when end() has been called, and returned
        this.ended = false;
        // when 'finish' is emitted
        this.finished = false;

        // has it been destroyed
        this.destroyed = false;

        // should we decode strings into buffers before passing to _write?
        // this is here so that some node-core streams can optimize string
        // handling at a lower level.
        var noDecode = options.decodeStrings === false;
        this.decodeStrings = !noDecode;

        // Crypto is kind of old and crusty.  Historically, its default string
        // encoding is 'binary' so we have to make this configurable.
        // Everything else in the universe uses 'utf8', though.
        this.defaultEncoding = options.defaultEncoding || 'utf8';

        // not an actual buffer we keep track of, but a measurement
        // of how much we're waiting to get pushed to some underlying
        // socket or file.
        this.length = 0;

        // a flag to see when we're in the middle of a write.
        this.writing = false;

        // when true all writes will be buffered until .uncork() call
        this.corked = 0;

        // a flag to be able to tell if the onwrite cb is called immediately,
        // or on a later tick.  We set this to true at first, because any
        // actions that shouldn't happen until "later" should generally also
        // not happen before the first write call.
        this.sync = true;

        // a flag to know if we're processing previously buffered items, which
        // may call the _write() callback in the same tick, so that we don't
        // end up in an overlapped onwrite situation.
        this.bufferProcessing = false;

        // the callback that's passed to _write(chunk,cb)
        this.onwrite = function (er) {
          onwrite(stream, er);
        };

        // the callback that the user supplies to write(chunk,encoding,cb)
        this.writecb = null;

        // the amount that is being written when _write is called.
        this.writelen = 0;

        this.bufferedRequest = null;
        this.lastBufferedRequest = null;

        // number of pending user-supplied write callbacks
        // this must be 0 before 'finish' can be emitted
        this.pendingcb = 0;

        // emit prefinish if the only thing we're waiting for is _write cbs
        // This is relevant for synchronous Transform streams
        this.prefinished = false;

        // True if the error was already emitted and should not be thrown again
        this.errorEmitted = false;

        // count buffered requests
        this.bufferedRequestCount = 0;

        // allocate the first CorkedRequest, there is always
        // one allocated and free to use, and we maintain at most two
        this.corkedRequestsFree = new CorkedRequest(this);
      }

      WritableState.prototype.getBuffer = function getBuffer() {
        var current = this.bufferedRequest;
        var out = [];
        while (current) {
          out.push(current);
          current = current.next;
        }
        return out;
      };

      (function () {
        try {
          Object.defineProperty(WritableState.prototype, 'buffer', {
            get: internalUtil.deprecate(function () {
              return this.getBuffer();
            }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
          });
        } catch (_) {}
      })();

      // Test _writableState for inheritance to account for Duplex streams,
      // whose prototype chain only points to Readable.
      var realHasInstance;
      if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
        realHasInstance = Function.prototype[Symbol.hasInstance];
        Object.defineProperty(Writable, Symbol.hasInstance, {
          value: function (object) {
            if (realHasInstance.call(this, object)) return true;
            if (this !== Writable) return false;

            return object && object._writableState instanceof WritableState;
          }
        });
      } else {
        realHasInstance = function (object) {
          return object instanceof this;
        };
      }

      function Writable(options) {
        Duplex = Duplex || require('./_stream_duplex');

        // Writable ctor is applied to Duplexes, too.
        // `realHasInstance` is necessary because using plain `instanceof`
        // would return false, as no `_writableState` property is attached.

        // Trying to use the custom `instanceof` for Writable here will also break the
        // Node.js LazyTransform implementation, which has a non-trivial getter for
        // `_writableState` that would lead to infinite recursion.
        if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
          return new Writable(options);
        }

        this._writableState = new WritableState(options, this);

        // legacy.
        this.writable = true;

        if (options) {
          if (typeof options.write === 'function') this._write = options.write;

          if (typeof options.writev === 'function') this._writev = options.writev;

          if (typeof options.destroy === 'function') this._destroy = options.destroy;

          if (typeof options.final === 'function') this._final = options.final;
        }

        Stream.call(this);
      }

      // Otherwise people can pipe Writable streams, which is just wrong.
      Writable.prototype.pipe = function () {
        this.emit('error', new Error('Cannot pipe, not readable'));
      };

      function writeAfterEnd(stream, cb) {
        var er = new Error('write after end');
        // TODO: defer error events consistently everywhere, not just the cb
        stream.emit('error', er);
        pna.nextTick(cb, er);
      }

      // Checks that a user-supplied chunk is valid, especially for the particular
      // mode the stream is in. Currently this means that `null` is never accepted
      // and undefined/non-string values are only allowed in object mode.
      function validChunk(stream, state, chunk, cb) {
        var valid = true;
        var er = false;

        if (chunk === null) {
          er = new TypeError('May not write null values to stream');
        } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
          er = new TypeError('Invalid non-string/buffer chunk');
        }
        if (er) {
          stream.emit('error', er);
          pna.nextTick(cb, er);
          valid = false;
        }
        return valid;
      }

      Writable.prototype.write = function (chunk, encoding, cb) {
        var state = this._writableState;
        var ret = false;
        var isBuf = !state.objectMode && _isUint8Array(chunk);

        if (isBuf && !Buffer.isBuffer(chunk)) {
          chunk = _uint8ArrayToBuffer(chunk);
        }

        if (typeof encoding === 'function') {
          cb = encoding;
          encoding = null;
        }

        if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

        if (typeof cb !== 'function') cb = nop;

        if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
          state.pendingcb++;
          ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
        }

        return ret;
      };

      Writable.prototype.cork = function () {
        var state = this._writableState;

        state.corked++;
      };

      Writable.prototype.uncork = function () {
        var state = this._writableState;

        if (state.corked) {
          state.corked--;

          if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
        }
      };

      Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
        // node::ParseEncoding() requires lower case.
        if (typeof encoding === 'string') encoding = encoding.toLowerCase();
        if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
        this._writableState.defaultEncoding = encoding;
        return this;
      };

      function decodeChunk(state, chunk, encoding) {
        if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
          chunk = Buffer.from(chunk, encoding);
        }
        return chunk;
      }

      Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function () {
          return this._writableState.highWaterMark;
        }
      });

      // if we're already writing something, then just put this
      // in the queue, and wait our turn.  Otherwise, call _write
      // If we return false, then we need a drain event, so set that flag.
      function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
        if (!isBuf) {
          var newChunk = decodeChunk(state, chunk, encoding);
          if (chunk !== newChunk) {
            isBuf = true;
            encoding = 'buffer';
            chunk = newChunk;
          }
        }
        var len = state.objectMode ? 1 : chunk.length;

        state.length += len;

        var ret = state.length < state.highWaterMark;
        // we must ensure that previous needDrain will not be reset to false.
        if (!ret) state.needDrain = true;

        if (state.writing || state.corked) {
          var last = state.lastBufferedRequest;
          state.lastBufferedRequest = {
            chunk: chunk,
            encoding: encoding,
            isBuf: isBuf,
            callback: cb,
            next: null
          };
          if (last) {
            last.next = state.lastBufferedRequest;
          } else {
            state.bufferedRequest = state.lastBufferedRequest;
          }
          state.bufferedRequestCount += 1;
        } else {
          doWrite(stream, state, false, len, chunk, encoding, cb);
        }

        return ret;
      }

      function doWrite(stream, state, writev, len, chunk, encoding, cb) {
        state.writelen = len;
        state.writecb = cb;
        state.writing = true;
        state.sync = true;
        if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
        state.sync = false;
      }

      function onwriteError(stream, state, sync, er, cb) {
        --state.pendingcb;

        if (sync) {
          // defer the callback if we are being called synchronously
          // to avoid piling up things on the stack
          pna.nextTick(cb, er);
          // this can emit finish, and it will always happen
          // after error
          pna.nextTick(finishMaybe, stream, state);
          stream._writableState.errorEmitted = true;
          stream.emit('error', er);
        } else {
          // the caller expect this to happen before if
          // it is async
          cb(er);
          stream._writableState.errorEmitted = true;
          stream.emit('error', er);
          // this can emit finish, but finish must
          // always follow error
          finishMaybe(stream, state);
        }
      }

      function onwriteStateUpdate(state) {
        state.writing = false;
        state.writecb = null;
        state.length -= state.writelen;
        state.writelen = 0;
      }

      function onwrite(stream, er) {
        var state = stream._writableState;
        var sync = state.sync;
        var cb = state.writecb;

        onwriteStateUpdate(state);

        if (er) onwriteError(stream, state, sync, er, cb);else {
          // Check if we're actually ready to finish, but don't emit yet
          var finished = needFinish(state);

          if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
            clearBuffer(stream, state);
          }

          if (sync) {
            /*<replacement>*/
            asyncWrite(afterWrite, stream, state, finished, cb);
            /*</replacement>*/
          } else {
            afterWrite(stream, state, finished, cb);
          }
        }
      }

      function afterWrite(stream, state, finished, cb) {
        if (!finished) onwriteDrain(stream, state);
        state.pendingcb--;
        cb();
        finishMaybe(stream, state);
      }

      // Must force callback to be called on nextTick, so that we don't
      // emit 'drain' before the write() consumer gets the 'false' return
      // value, and has a chance to attach a 'drain' listener.
      function onwriteDrain(stream, state) {
        if (state.length === 0 && state.needDrain) {
          state.needDrain = false;
          stream.emit('drain');
        }
      }

      // if there's something in the buffer waiting, then process it
      function clearBuffer(stream, state) {
        state.bufferProcessing = true;
        var entry = state.bufferedRequest;

        if (stream._writev && entry && entry.next) {
          // Fast case, write everything using _writev()
          var l = state.bufferedRequestCount;
          var buffer = new Array(l);
          var holder = state.corkedRequestsFree;
          holder.entry = entry;

          var count = 0;
          var allBuffers = true;
          while (entry) {
            buffer[count] = entry;
            if (!entry.isBuf) allBuffers = false;
            entry = entry.next;
            count += 1;
          }
          buffer.allBuffers = allBuffers;

          doWrite(stream, state, true, state.length, buffer, '', holder.finish);

          // doWrite is almost always async, defer these to save a bit of time
          // as the hot path ends with doWrite
          state.pendingcb++;
          state.lastBufferedRequest = null;
          if (holder.next) {
            state.corkedRequestsFree = holder.next;
            holder.next = null;
          } else {
            state.corkedRequestsFree = new CorkedRequest(state);
          }
          state.bufferedRequestCount = 0;
        } else {
          // Slow case, write chunks one-by-one
          while (entry) {
            var chunk = entry.chunk;
            var encoding = entry.encoding;
            var cb = entry.callback;
            var len = state.objectMode ? 1 : chunk.length;

            doWrite(stream, state, false, len, chunk, encoding, cb);
            entry = entry.next;
            state.bufferedRequestCount--;
            // if we didn't call the onwrite immediately, then
            // it means that we need to wait until it does.
            // also, that means that the chunk and cb are currently
            // being processed, so move the buffer counter past them.
            if (state.writing) {
              break;
            }
          }

          if (entry === null) state.lastBufferedRequest = null;
        }

        state.bufferedRequest = entry;
        state.bufferProcessing = false;
      }

      Writable.prototype._write = function (chunk, encoding, cb) {
        cb(new Error('_write() is not implemented'));
      };

      Writable.prototype._writev = null;

      Writable.prototype.end = function (chunk, encoding, cb) {
        var state = this._writableState;

        if (typeof chunk === 'function') {
          cb = chunk;
          chunk = null;
          encoding = null;
        } else if (typeof encoding === 'function') {
          cb = encoding;
          encoding = null;
        }

        if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

        // .end() fully uncorks
        if (state.corked) {
          state.corked = 1;
          this.uncork();
        }

        // ignore unnecessary end() calls.
        if (!state.ending && !state.finished) endWritable(this, state, cb);
      };

      function needFinish(state) {
        return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
      }
      function callFinal(stream, state) {
        stream._final(function (err) {
          state.pendingcb--;
          if (err) {
            stream.emit('error', err);
          }
          state.prefinished = true;
          stream.emit('prefinish');
          finishMaybe(stream, state);
        });
      }
      function prefinish(stream, state) {
        if (!state.prefinished && !state.finalCalled) {
          if (typeof stream._final === 'function') {
            state.pendingcb++;
            state.finalCalled = true;
            pna.nextTick(callFinal, stream, state);
          } else {
            state.prefinished = true;
            stream.emit('prefinish');
          }
        }
      }

      function finishMaybe(stream, state) {
        var need = needFinish(state);
        if (need) {
          prefinish(stream, state);
          if (state.pendingcb === 0) {
            state.finished = true;
            stream.emit('finish');
          }
        }
        return need;
      }

      function endWritable(stream, state, cb) {
        state.ending = true;
        finishMaybe(stream, state);
        if (cb) {
          if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
        }
        state.ended = true;
        stream.writable = false;
      }

      function onCorkedFinish(corkReq, state, err) {
        var entry = corkReq.entry;
        corkReq.entry = null;
        while (entry) {
          var cb = entry.callback;
          state.pendingcb--;
          cb(err);
          entry = entry.next;
        }
        if (state.corkedRequestsFree) {
          state.corkedRequestsFree.next = corkReq;
        } else {
          state.corkedRequestsFree = corkReq;
        }
      }

      Object.defineProperty(Writable.prototype, 'destroyed', {
        get: function () {
          if (this._writableState === undefined) {
            return false;
          }
          return this._writableState.destroyed;
        },
        set: function (value) {
          // we ignore the value if the stream
          // has not been initialized yet
          if (!this._writableState) {
            return;
          }

          // backward compatibility, the user is explicitly
          // managing destroyed
          this._writableState.destroyed = value;
        }
      });

      Writable.prototype.destroy = destroyImpl.destroy;
      Writable.prototype._undestroy = destroyImpl.undestroy;
      Writable.prototype._destroy = function (err, cb) {
        this.end();
        cb(err);
      };
    }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, { "./_stream_duplex": 25, "./internal/streams/destroy": 31, "./internal/streams/stream": 32, "_process": 19, "core-util-is": 8, "inherits": 13, "process-nextick-args": 18, "safe-buffer": 38, "util-deprecate": 51 }], 30: [function (require, module, exports) {
    'use strict';

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var Buffer = require('safe-buffer').Buffer;
    var util = require('util');

    function copyBuffer(src, target, offset) {
      src.copy(target, offset);
    }

    module.exports = function () {
      function BufferList() {
        _classCallCheck(this, BufferList);

        this.head = null;
        this.tail = null;
        this.length = 0;
      }

      BufferList.prototype.push = function push(v) {
        var entry = { data: v, next: null };
        if (this.length > 0) this.tail.next = entry;else this.head = entry;
        this.tail = entry;
        ++this.length;
      };

      BufferList.prototype.unshift = function unshift(v) {
        var entry = { data: v, next: this.head };
        if (this.length === 0) this.tail = entry;
        this.head = entry;
        ++this.length;
      };

      BufferList.prototype.shift = function shift() {
        if (this.length === 0) return;
        var ret = this.head.data;
        if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
        --this.length;
        return ret;
      };

      BufferList.prototype.clear = function clear() {
        this.head = this.tail = null;
        this.length = 0;
      };

      BufferList.prototype.join = function join(s) {
        if (this.length === 0) return '';
        var p = this.head;
        var ret = '' + p.data;
        while (p = p.next) {
          ret += s + p.data;
        }return ret;
      };

      BufferList.prototype.concat = function concat(n) {
        if (this.length === 0) return Buffer.alloc(0);
        if (this.length === 1) return this.head.data;
        var ret = Buffer.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
        while (p) {
          copyBuffer(p.data, ret, i);
          i += p.data.length;
          p = p.next;
        }
        return ret;
      };

      return BufferList;
    }();

    if (util && util.inspect && util.inspect.custom) {
      module.exports.prototype[util.inspect.custom] = function () {
        var obj = util.inspect({ length: this.length });
        return this.constructor.name + ' ' + obj;
      };
    }
  }, { "safe-buffer": 38, "util": 3 }], 31: [function (require, module, exports) {
    'use strict';

    /*<replacement>*/

    var pna = require('process-nextick-args');
    /*</replacement>*/

    // undocumented cb() API, needed for core, not for public API
    function destroy(err, cb) {
      var _this = this;

      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;

      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
          pna.nextTick(emitErrorNT, this, err);
        }
        return this;
      }

      // we set destroyed to true before firing error callbacks in order
      // to make it re-entrance safe in case destroy() is called within callbacks

      if (this._readableState) {
        this._readableState.destroyed = true;
      }

      // if this is a duplex stream mark the writable part as destroyed as well
      if (this._writableState) {
        this._writableState.destroyed = true;
      }

      this._destroy(err || null, function (err) {
        if (!cb && err) {
          pna.nextTick(emitErrorNT, _this, err);
          if (_this._writableState) {
            _this._writableState.errorEmitted = true;
          }
        } else if (cb) {
          cb(err);
        }
      });

      return this;
    }

    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }

      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }

    function emitErrorNT(self, err) {
      self.emit('error', err);
    }

    module.exports = {
      destroy: destroy,
      undestroy: undestroy
    };
  }, { "process-nextick-args": 18 }], 32: [function (require, module, exports) {
    module.exports = require('events').EventEmitter;
  }, { "events": 10 }], 33: [function (require, module, exports) {
    module.exports = require('./readable').PassThrough;
  }, { "./readable": 34 }], 34: [function (require, module, exports) {
    exports = module.exports = require('./lib/_stream_readable.js');
    exports.Stream = exports;
    exports.Readable = exports;
    exports.Writable = require('./lib/_stream_writable.js');
    exports.Duplex = require('./lib/_stream_duplex.js');
    exports.Transform = require('./lib/_stream_transform.js');
    exports.PassThrough = require('./lib/_stream_passthrough.js');
  }, { "./lib/_stream_duplex.js": 25, "./lib/_stream_passthrough.js": 26, "./lib/_stream_readable.js": 27, "./lib/_stream_transform.js": 28, "./lib/_stream_writable.js": 29 }], 35: [function (require, module, exports) {
    module.exports = require('./readable').Transform;
  }, { "./readable": 34 }], 36: [function (require, module, exports) {
    module.exports = require('./lib/_stream_writable.js');
  }, { "./lib/_stream_writable.js": 29 }], 37: [function (require, module, exports) {
    'use strict';

    var Module = require('module');
    var path = require('path');

    module.exports = function requireFromString(code, filename, opts) {
      if (typeof filename === 'object') {
        opts = filename;
        filename = undefined;
      }

      opts = opts || {};
      filename = filename || '';

      opts.appendPaths = opts.appendPaths || [];
      opts.prependPaths = opts.prependPaths || [];

      if (typeof code !== 'string') {
        throw new Error('code must be a string, not ' + typeof code);
      }

      var paths = Module._nodeModulePaths(path.dirname(filename));

      var m = new Module(filename, module.parent);
      m.filename = filename;
      m.paths = [].concat(opts.prependPaths).concat(paths).concat(opts.appendPaths);
      m._compile(code, filename);

      return m.exports;
    };
  }, { "module": 4, "path": 17 }], 38: [function (require, module, exports) {
    /* eslint-disable node/no-deprecated-api */
    var buffer = require('buffer');
    var Buffer = buffer.Buffer;

    // alternative to using Object.keys for old browsers
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
      module.exports = buffer;
    } else {
      // Copy properties from require('buffer')
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }

    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer(arg, encodingOrOffset, length);
    }

    // Copy static methods from Buffer
    copyProps(Buffer, SafeBuffer);

    SafeBuffer.from = function (arg, encodingOrOffset, length) {
      if (typeof arg === 'number') {
        throw new TypeError('Argument must not be a number');
      }
      return Buffer(arg, encodingOrOffset, length);
    };

    SafeBuffer.alloc = function (size, fill, encoding) {
      if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
      }
      var buf = Buffer(size);
      if (fill !== undefined) {
        if (typeof encoding === 'string') {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };

    SafeBuffer.allocUnsafe = function (size) {
      if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
      }
      return Buffer(size);
    };

    SafeBuffer.allocUnsafeSlow = function (size) {
      if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
      }
      return buffer.SlowBuffer(size);
    };
  }, { "buffer": 6 }], 39: [function (require, module, exports) {
    var linkBytecode = function (bytecode, libraries) {
      // NOTE: for backwards compatibility support old compiler which didn't use file names
      var librariesComplete = {};
      for (var libraryName in libraries) {
        if (typeof libraryName === 'object') {
          // API compatible with the standard JSON i/o
          for (var lib in libraries[libraryName]) {
            librariesComplete[lib] = libraries[libraryName][lib];
            librariesComplete[libraryName + ':' + lib] = libraries[libraryName][lib];
          }
        } else {
          // backwards compatible API for early solc-js verisons
          var parsed = libraryName.match(/^([^:]*):?(.*)$/);
          if (parsed) {
            librariesComplete[parsed[2]] = libraries[libraryName];
          }
          librariesComplete[libraryName] = libraries[libraryName];
        }
      }

      for (libraryName in librariesComplete) {
        // truncate to 37 characters
        var internalName = libraryName.slice(0, 36);
        // prefix and suffix with __
        var libLabel = '__' + internalName + Array(37 - internalName.length).join('_') + '__';

        var hexAddress = librariesComplete[libraryName];
        if (hexAddress.slice(0, 2) !== '0x' || hexAddress.length > 42) {
          throw new Error('Invalid address specified for ' + libraryName);
        }
        // remove 0x prefix
        hexAddress = hexAddress.slice(2);
        hexAddress = Array(40 - hexAddress.length + 1).join('0') + hexAddress;

        while (bytecode.indexOf(libLabel) >= 0) {
          bytecode = bytecode.replace(libLabel, hexAddress);
        }
      }

      return bytecode;
    };

    var findLinkReferences = function (bytecode) {
      // find 40 bytes in the pattern of __...<36 digits>...__
      // e.g. __Lib.sol:L_____________________________
      var linkReferences = {};
      var offset = 0;
      while (true) {
        var found = bytecode.match(/__(.{36})__/);
        if (!found) {
          break;
        }

        var start = found.index;
        // trim trailing underscores
        // NOTE: this has no way of knowing if the trailing underscore was part of the name
        var libraryName = found[1].replace(/_+$/gm, '');

        if (!linkReferences[libraryName]) {
          linkReferences[libraryName] = [];
        }

        linkReferences[libraryName].push({
          // offsets are in bytes in binary representation (and not hex)
          start: (offset + start) / 2,
          length: 20
        });

        offset += start + 20;

        bytecode = bytecode.slice(start + 20);
      }
      return linkReferences;
    };

    module.exports = {
      linkBytecode: linkBytecode,
      findLinkReferences: findLinkReferences
    };
  }, {}], 40: [function (require, module, exports) {
    var linker = require('./linker.js');

    /// Translate old style version numbers to semver.
    /// Old style: 0.3.6-3fc68da5/Release-Emscripten/clang
    ///            0.3.5-371690f0/Release-Emscripten/clang/Interpreter
    ///            0.2.0-e7098958/.-Emscripten/clang/int linked to libethereum-1.1.1-bbb80ab0/.-Emscripten/clang/int
    ///            0.1.3-0/.-/clang/int linked to libethereum-0.9.92-0/.-/clang/int
    ///            0.1.2-5c3bfd4b*/.-/clang/int
    ///            0.1.1-6ff4cd6b/RelWithDebInfo-Emscripten/clang/int
    /// New style: 0.4.5+commit.b318366e.Emscripten.clang
    function versionToSemver(version) {
      // FIXME: parse more detail, but this is a good start
      var parsed = version.match(/^([0-9]+\.[0-9]+\.[0-9]+)-([0-9a-f]{8})[/*].*$/);
      if (parsed) {
        return parsed[1] + '+commit.' + parsed[2];
      }
      if (version.indexOf('0.1.3-0') !== -1) {
        return '0.1.3';
      }
      // assume it is already semver compatible
      return version;
    }

    function translateErrors(ret, errors) {
      for (var error in errors) {
        var type = 'error';
        var extractType = /^(.*):(\d+):(\d+):(.*):/;
        extractType = extractType.exec(errors[error]);
        if (extractType) {
          type = extractType[4].trim();
        } else if (errors[error].indexOf(': Warning:')) {
          type = 'Warning';
        } else if (errors[error].indexOf(': Error:')) {
          type = 'Error';
        }
        ret.push({
          type: type,
          component: 'general',
          severity: type === 'Warning' ? 'warning' : 'error',
          message: errors[error],
          formattedMessage: errors[error]
        });
      }
    }

    function translateGasEstimates(gasEstimates) {
      if (gasEstimates === null) {
        return 'infinite';
      }

      if (typeof gasEstimates === 'number') {
        return gasEstimates.toString();
      }

      var gasEstimatesTranslated = {};
      for (var func in gasEstimates) {
        gasEstimatesTranslated[func] = translateGasEstimates(gasEstimates[func]);
      }
      return gasEstimatesTranslated;
    }

    function translateJsonCompilerOutput(output, libraries) {
      var ret = {};

      ret['errors'] = [];
      var errors;
      if (output['error']) {
        errors = [output['error']];
      } else {
        errors = output['errors'];
      }
      translateErrors(ret['errors'], errors);

      ret['contracts'] = {};
      for (var contract in output['contracts']) {
        // Split name first, can be `contract`, `:contract` or `filename:contract`
        var tmp = contract.match(/^(([^:]*):)?([^:]+)$/);
        if (tmp.length !== 4) {
          // Force abort
          return null;
        }
        var fileName = tmp[2];
        if (fileName === undefined) {
          // this is the case of `contract`
          fileName = '';
        }
        var contractName = tmp[3];

        var contractInput = output['contracts'][contract];

        var gasEstimates = contractInput['gasEstimates'];
        var translatedGasEstimates = {};

        if (gasEstimates['creation']) {
          translatedGasEstimates['creation'] = {
            'codeDepositCost': translateGasEstimates(gasEstimates['creation'][1]),
            'executionCost': translateGasEstimates(gasEstimates['creation'][0])
          };
        }
        if (gasEstimates['internal']) {
          translatedGasEstimates['internal'] = translateGasEstimates(gasEstimates['internal']);
        }
        if (gasEstimates['external']) {
          translatedGasEstimates['external'] = translateGasEstimates(gasEstimates['external']);
        }

        var contractOutput = {
          'abi': JSON.parse(contractInput['interface']),
          'metadata': contractInput['metadata'],
          'evm': {
            'legacyAssembly': contractInput['assembly'],
            'bytecode': {
              'object': linker.linkBytecode(contractInput['bytecode'], libraries),
              'opcodes': contractInput['opcodes'],
              'sourceMap': contractInput['srcmap'],
              'linkReferences': linker.findLinkReferences(contractInput['bytecode'])
            },
            'deployedBytecode': {
              'object': linker.linkBytecode(contractInput['runtimeBytecode'], libraries),
              'sourceMap': contractInput['srcmapRuntime'],
              'linkReferences': linker.findLinkReferences(contractInput['runtimeBytecode'])
            },
            'methodIdentifiers': contractInput['functionHashes'],
            'gasEstimates': translatedGasEstimates
          }
        };

        if (!ret['contracts'][fileName]) {
          ret['contracts'][fileName] = {};
        }

        ret['contracts'][fileName][contractName] = contractOutput;
      }

      var sourceMap = {};
      for (var sourceId in output['sourceList']) {
        sourceMap[output['sourceList'][sourceId]] = sourceId;
      }

      ret['sources'] = {};
      for (var source in output['sources']) {
        ret['sources'][source] = {
          id: sourceMap[source],
          legacyAST: output['sources'][source].AST
        };
      }

      return ret;
    }

    function escapeString(text) {
      return text.replace('\n', '\\n', 'g').replace('\r', '\\r', 'g').replace('\t', '\\t', 'g');
    }

    function formatAssemblyText(asm, prefix, source) {
      if (typeof asm === typeof '' || asm === null || asm === undefined) {
        return prefix + (asm || '') + '\n';
      }
      var text = prefix + '.code\n';
      asm['.code'].forEach(function (item, i) {
        var v = item.value === undefined ? '' : item.value;
        var src = '';
        if (source !== undefined && item.begin !== undefined && item.end !== undefined) {
          src = escapeString(source.slice(item.begin, item.end));
        }
        if (src.length > 30) {
          src = src.slice(0, 30) + '...';
        }
        if (item.name !== 'tag') {
          text += '  ';
        }
        text += prefix + item.name + ' ' + v + '\t\t\t' + src + '\n';
      });
      text += prefix + '.data\n';
      var asmData = asm['.data'] || [];
      for (var i in asmData) {
        var item = asmData[i];
        text += '  ' + prefix + '' + i + ':\n';
        text += formatAssemblyText(item, prefix + '    ', source);
      }
      return text;
    }

    function prettyPrintLegacyAssemblyJSON(assembly, source) {
      return formatAssemblyText(assembly, '', source);
    }

    module.exports = {
      versionToSemver: versionToSemver,
      translateJsonCompilerOutput: translateJsonCompilerOutput,
      prettyPrintLegacyAssemblyJSON: prettyPrintLegacyAssemblyJSON
    };
  }, { "./linker.js": 39 }], 41: [function (require, module, exports) {
    var assert = require('assert');
    var translate = require('./translate.js');
    var linker = require('./linker.js');
    var requireFromString = require('require-from-string');
    var https = require('https');
    var MemoryStream = require('memorystream');

    function setupMethods(soljson) {
      var compileJSON = soljson.cwrap('compileJSON', 'string', ['string', 'number']);
      var compileJSONMulti = null;
      if ('_compileJSONMulti' in soljson) {
        compileJSONMulti = soljson.cwrap('compileJSONMulti', 'string', ['string', 'number']);
      }
      var compileJSONCallback = null;
      var compileStandard = null;
      if ('_compileJSONCallback' in soljson || '_compileStandard' in soljson) {
        var copyString = function (str, ptr) {
          var length = soljson.lengthBytesUTF8(str);
          var buffer = soljson._malloc(length + 1);
          soljson.stringToUTF8(str, buffer, length + 1);
          soljson.setValue(ptr, buffer, '*');
        };
        var wrapCallback = function (callback) {
          assert(typeof callback === 'function', 'Invalid callback specified.');
          return function (path, contents, error) {
            var result = callback(soljson.Pointer_stringify(path));
            if (typeof result.contents === 'string') {
              copyString(result.contents, contents);
            }
            if (typeof result.error === 'string') {
              copyString(result.error, error);
            }
          };
        };

        // This calls compile() with args || cb
        var runWithReadCallback = function (readCallback, compile, args) {
          if (readCallback === undefined) {
            readCallback = function (path) {
              return {
                error: 'File import callback not supported'
              };
            };
          }
          var cb = soljson.Runtime.addFunction(wrapCallback(readCallback));
          var output;
          try {
            args.push(cb);
            output = compile.apply(undefined, args);
          } catch (e) {
            soljson.Runtime.removeFunction(cb);
            throw e;
          }
          soljson.Runtime.removeFunction(cb);
          return output;
        };

        var compileInternal = soljson.cwrap('compileJSONCallback', 'string', ['string', 'number', 'number']);
        compileJSONCallback = function (input, optimize, readCallback) {
          return runWithReadCallback(readCallback, compileInternal, [input, optimize]);
        };
        if ('_compileStandard' in soljson) {
          var compileStandardInternal = soljson.cwrap('compileStandard', 'string', ['string', 'number']);
          compileStandard = function (input, readCallback) {
            return runWithReadCallback(readCallback, compileStandardInternal, [input]);
          };
        }
      }

      var compile = function (input, optimise, readCallback) {
        var result = '';
        if (readCallback !== undefined && compileJSONCallback !== null) {
          result = compileJSONCallback(JSON.stringify(input), optimise, readCallback);
        } else if (typeof input !== 'string' && compileJSONMulti !== null) {
          result = compileJSONMulti(JSON.stringify(input), optimise);
        } else {
          result = compileJSON(input, optimise);
        }
        return JSON.parse(result);
      };

      // Expects a Standard JSON I/O but supports old compilers
      var compileStandardWrapper = function (input, readCallback) {
        if (compileStandard !== null) {
          return compileStandard(input, readCallback);
        }

        function formatFatalError(message) {
          return JSON.stringify({
            errors: [{
              'type': 'SOLCError',
              'component': 'solcjs',
              'severity': 'error',
              'message': message,
              'formattedMessage': 'Error: ' + message
            }]
          });
        }

        if (readCallback !== undefined && typeof readCallback !== 'function') {
          return formatFatalError('Invalid import callback supplied');
        }

        input = JSON.parse(input);

        if (input['language'] !== 'Solidity') {
          return formatFatalError('Only Solidity sources are supported');
        }

        if (input['sources'] == null) {
          return formatFatalError('No input specified');
        }

        // Bail out early
        if (input['sources'].length > 1 && compileJSONMulti === null) {
          return formatFatalError('Multiple sources provided, but compiler only supports single input');
        }

        function isOptimizerEnabled(input) {
          return input['settings'] && input['settings']['optimizer'] && input['settings']['optimizer']['enabled'];
        }

        function translateSources(input) {
          var sources = {};
          for (var source in input['sources']) {
            if (input['sources'][source]['content'] !== null) {
              sources[source] = input['sources'][source]['content'];
            } else {
              // force failure
              return null;
            }
          }
          return sources;
        }

        function librariesSupplied(input) {
          if (input['settings'] !== null) {
            return input['settings']['libraries'];
          }
        }

        function translateOutput(output) {
          output = translate.translateJsonCompilerOutput(JSON.parse(output));
          if (output == null) {
            return formatFatalError('Failed to process output');
          }
          return JSON.stringify(output);
        }

        var sources = translateSources(input);
        if (sources === null || Object.keys(sources).length === 0) {
          return formatFatalError('Failed to process sources');
        }

        // Try linking if libraries were supplied
        var libraries = librariesSupplied(input);

        // Try to wrap around old versions
        if (compileJSONCallback !== null) {
          return translateOutput(compileJSONCallback(JSON.stringify({ 'sources': sources }), isOptimizerEnabled(input), readCallback), libraries);
        }

        if (compileJSONMulti !== null) {
          return translateOutput(compileJSONMulti(JSON.stringify({ 'sources': sources }), isOptimizerEnabled(input)), libraries);
        }

        // Try our luck with an ancient compiler
        return translateOutput(compileJSON(sources[Object.keys(sources)[0]], isOptimizerEnabled(input)), libraries);
      };

      var version = soljson.cwrap('version', 'string', []);

      var versionToSemver = function () {
        return translate.versionToSemver(version());
      };

      var license = function () {
        // return undefined
      };

      if ('_license' in soljson) {
        license = soljson.cwrap('license', 'string', []);
      }

      return {
        version: version,
        semver: versionToSemver,
        license: license,
        compile: compile,
        compileStandard: compileStandard,
        compileStandardWrapper: compileStandardWrapper,
        linkBytecode: linker.linkBytecode,
        supportsMulti: compileJSONMulti !== null,
        supportsImportCallback: compileJSONCallback !== null,
        supportsStandard: compileStandard !== null,
        // Loads the compiler of the given version from the github repository
        // instead of from the local filesystem.
        loadRemoteVersion: function (versionString, cb) {
          var mem = new MemoryStream(null, { readable: false });
          var url = 'https://ethereum.github.io/solc-bin/bin/soljson-' + versionString + '.js';
          https.get(url, function (response) {
            if (response.statusCode !== 200) {
              cb(new Error('Error retrieving binary: ' + response.statusMessage));
            } else {
              response.pipe(mem);
              response.on('end', function () {
                cb(null, setupMethods(requireFromString(mem.toString(), 'soljson-' + versionString + '.js')));
              });
            }
          }).on('error', function (error) {
            cb(error);
          });
        },
        // Use this if you want to add wrapper functions around the pure module.
        setupMethods: setupMethods
      };
    }

    module.exports = setupMethods;
  }, { "./linker.js": 39, "./translate.js": 40, "assert": 1, "https": 11, "memorystream": 16, "require-from-string": 37 }], 42: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    module.exports = Stream;

    var EE = require('events').EventEmitter;
    var inherits = require('inherits');

    inherits(Stream, EE);
    Stream.Readable = require('readable-stream/readable.js');
    Stream.Writable = require('readable-stream/writable.js');
    Stream.Duplex = require('readable-stream/duplex.js');
    Stream.Transform = require('readable-stream/transform.js');
    Stream.PassThrough = require('readable-stream/passthrough.js');

    // Backwards-compat with node 0.4.x
    Stream.Stream = Stream;

    // old-style streams.  Note that the pipe method (the only relevant
    // part of this class) is overridden in the Readable class.

    function Stream() {
      EE.call(this);
    }

    Stream.prototype.pipe = function (dest, options) {
      var source = this;

      function ondata(chunk) {
        if (dest.writable) {
          if (false === dest.write(chunk) && source.pause) {
            source.pause();
          }
        }
      }

      source.on('data', ondata);

      function ondrain() {
        if (source.readable && source.resume) {
          source.resume();
        }
      }

      dest.on('drain', ondrain);

      // If the 'end' option is not supplied, dest.end() will be called when
      // source gets the 'end' or 'close' events.  Only dest.end() once.
      if (!dest._isStdio && (!options || options.end !== false)) {
        source.on('end', onend);
        source.on('close', onclose);
      }

      var didOnEnd = false;
      function onend() {
        if (didOnEnd) return;
        didOnEnd = true;

        dest.end();
      }

      function onclose() {
        if (didOnEnd) return;
        didOnEnd = true;

        if (typeof dest.destroy === 'function') dest.destroy();
      }

      // don't leave dangling pipes when there are errors.
      function onerror(er) {
        cleanup();
        if (EE.listenerCount(this, 'error') === 0) {
          throw er; // Unhandled stream error in pipe.
        }
      }

      source.on('error', onerror);
      dest.on('error', onerror);

      // remove all the event listeners that were added.
      function cleanup() {
        source.removeListener('data', ondata);
        dest.removeListener('drain', ondrain);

        source.removeListener('end', onend);
        source.removeListener('close', onclose);

        source.removeListener('error', onerror);
        dest.removeListener('error', onerror);

        source.removeListener('end', cleanup);
        source.removeListener('close', cleanup);

        dest.removeListener('close', cleanup);
      }

      source.on('end', cleanup);
      source.on('close', cleanup);

      dest.on('close', cleanup);

      dest.emit('pipe', source);

      // Allow for unix-like usage: A.pipe(B).pipe(C)
      return dest;
    };
  }, { "events": 10, "inherits": 13, "readable-stream/duplex.js": 24, "readable-stream/passthrough.js": 33, "readable-stream/readable.js": 34, "readable-stream/transform.js": 35, "readable-stream/writable.js": 36 }], 43: [function (require, module, exports) {
    (function (global) {
      var ClientRequest = require('./lib/request');
      var response = require('./lib/response');
      var extend = require('xtend');
      var statusCodes = require('builtin-status-codes');
      var url = require('url');

      var http = exports;

      http.request = function (opts, cb) {
        if (typeof opts === 'string') opts = url.parse(opts);else opts = extend(opts);

        // Normally, the page is loaded from http or https, so not specifying a protocol
        // will result in a (valid) protocol-relative url. However, this won't work if
        // the protocol is something else, like 'file:'
        var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : '';

        var protocol = opts.protocol || defaultProtocol;
        var host = opts.hostname || opts.host;
        var port = opts.port;
        var path = opts.path || '/';

        // Necessary for IPv6 addresses
        if (host && host.indexOf(':') !== -1) host = '[' + host + ']';

        // This may be a relative url. The browser should always be able to interpret it correctly.
        opts.url = (host ? protocol + '//' + host : '') + (port ? ':' + port : '') + path;
        opts.method = (opts.method || 'GET').toUpperCase();
        opts.headers = opts.headers || {};

        // Also valid opts.auth, opts.mode

        var req = new ClientRequest(opts);
        if (cb) req.on('response', cb);
        return req;
      };

      http.get = function get(opts, cb) {
        var req = http.request(opts, cb);
        req.end();
        return req;
      };

      http.ClientRequest = ClientRequest;
      http.IncomingMessage = response.IncomingMessage;

      http.Agent = function () {};
      http.Agent.defaultMaxSockets = 4;

      http.globalAgent = new http.Agent();

      http.STATUS_CODES = statusCodes;

      http.METHODS = ['CHECKOUT', 'CONNECT', 'COPY', 'DELETE', 'GET', 'HEAD', 'LOCK', 'M-SEARCH', 'MERGE', 'MKACTIVITY', 'MKCOL', 'MOVE', 'NOTIFY', 'OPTIONS', 'PATCH', 'POST', 'PROPFIND', 'PROPPATCH', 'PURGE', 'PUT', 'REPORT', 'SEARCH', 'SUBSCRIBE', 'TRACE', 'UNLOCK', 'UNSUBSCRIBE'];
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, { "./lib/request": 45, "./lib/response": 46, "builtin-status-codes": 7, "url": 49, "xtend": 55 }], 44: [function (require, module, exports) {
    (function (global) {
      exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream);

      exports.writableStream = isFunction(global.WritableStream);

      exports.abortController = isFunction(global.AbortController);

      exports.blobConstructor = false;
      try {
        new Blob([new ArrayBuffer(1)]);
        exports.blobConstructor = true;
      } catch (e) {}

      // The xhr request to example.com may violate some restrictive CSP configurations,
      // so if we're running in a browser that supports `fetch`, avoid calling getXHR()
      // and assume support for certain features below.
      var xhr;
      function getXHR() {
        // Cache the xhr value
        if (xhr !== undefined) return xhr;

        if (global.XMLHttpRequest) {
          xhr = new global.XMLHttpRequest();
          // If XDomainRequest is available (ie only, where xhr might not work
          // cross domain), use the page location. Otherwise use example.com
          // Note: this doesn't actually make an http request.
          try {
            xhr.open('GET', global.XDomainRequest ? '/' : 'https://example.com');
          } catch (e) {
            xhr = null;
          }
        } else {
          // Service workers don't have XHR
          xhr = null;
        }
        return xhr;
      }

      function checkTypeSupport(type) {
        var xhr = getXHR();
        if (!xhr) return false;
        try {
          xhr.responseType = type;
          return xhr.responseType === type;
        } catch (e) {}
        return false;
      }

      // For some strange reason, Safari 7.0 reports typeof global.ArrayBuffer === 'object'.
      // Safari 7.1 appears to have fixed this bug.
      var haveArrayBuffer = typeof global.ArrayBuffer !== 'undefined';
      var haveSlice = haveArrayBuffer && isFunction(global.ArrayBuffer.prototype.slice);

      // If fetch is supported, then arraybuffer will be supported too. Skip calling
      // checkTypeSupport(), since that calls getXHR().
      exports.arraybuffer = exports.fetch || haveArrayBuffer && checkTypeSupport('arraybuffer');

      // These next two tests unavoidably show warnings in Chrome. Since fetch will always
      // be used if it's available, just return false for these to avoid the warnings.
      exports.msstream = !exports.fetch && haveSlice && checkTypeSupport('ms-stream');
      exports.mozchunkedarraybuffer = !exports.fetch && haveArrayBuffer && checkTypeSupport('moz-chunked-arraybuffer');

      // If fetch is supported, then overrideMimeType will be supported too. Skip calling
      // getXHR().
      exports.overrideMimeType = exports.fetch || (getXHR() ? isFunction(getXHR().overrideMimeType) : false);

      exports.vbArray = isFunction(global.VBArray);

      function isFunction(value) {
        return typeof value === 'function';
      }

      xhr = null; // Help gc
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {}], 45: [function (require, module, exports) {
    (function (process, global, Buffer) {
      var capability = require('./capability');
      var inherits = require('inherits');
      var response = require('./response');
      var stream = require('readable-stream');
      var toArrayBuffer = require('to-arraybuffer');

      var IncomingMessage = response.IncomingMessage;
      var rStates = response.readyStates;

      function decideMode(preferBinary, useFetch) {
        if (capability.fetch && useFetch) {
          return 'fetch';
        } else if (capability.mozchunkedarraybuffer) {
          return 'moz-chunked-arraybuffer';
        } else if (capability.msstream) {
          return 'ms-stream';
        } else if (capability.arraybuffer && preferBinary) {
          return 'arraybuffer';
        } else if (capability.vbArray && preferBinary) {
          return 'text:vbarray';
        } else {
          return 'text';
        }
      }

      var ClientRequest = module.exports = function (opts) {
        var self = this;
        stream.Writable.call(self);

        self._opts = opts;
        self._body = [];
        self._headers = {};
        if (opts.auth) self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'));
        Object.keys(opts.headers).forEach(function (name) {
          self.setHeader(name, opts.headers[name]);
        });

        var preferBinary;
        var useFetch = true;
        if (opts.mode === 'disable-fetch' || 'requestTimeout' in opts && !capability.abortController) {
          // If the use of XHR should be preferred. Not typically needed.
          useFetch = false;
          preferBinary = true;
        } else if (opts.mode === 'prefer-streaming') {
          // If streaming is a high priority but binary compatibility and
          // the accuracy of the 'content-type' header aren't
          preferBinary = false;
        } else if (opts.mode === 'allow-wrong-content-type') {
          // If streaming is more important than preserving the 'content-type' header
          preferBinary = !capability.overrideMimeType;
        } else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
          // Use binary if text streaming may corrupt data or the content-type header, or for speed
          preferBinary = true;
        } else {
          throw new Error('Invalid value for opts.mode');
        }
        self._mode = decideMode(preferBinary, useFetch);

        self.on('finish', function () {
          self._onFinish();
        });
      };

      inherits(ClientRequest, stream.Writable);

      ClientRequest.prototype.setHeader = function (name, value) {
        var self = this;
        var lowerName = name.toLowerCase();
        // This check is not necessary, but it prevents warnings from browsers about setting unsafe
        // headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
        // http-browserify did it, so I will too.
        if (unsafeHeaders.indexOf(lowerName) !== -1) return;

        self._headers[lowerName] = {
          name: name,
          value: value
        };
      };

      ClientRequest.prototype.getHeader = function (name) {
        var header = this._headers[name.toLowerCase()];
        if (header) return header.value;
        return null;
      };

      ClientRequest.prototype.removeHeader = function (name) {
        var self = this;
        delete self._headers[name.toLowerCase()];
      };

      ClientRequest.prototype._onFinish = function () {
        var self = this;

        if (self._destroyed) return;
        var opts = self._opts;

        var headersObj = self._headers;
        var body = null;
        if (opts.method !== 'GET' && opts.method !== 'HEAD') {
          if (capability.arraybuffer) {
            body = toArrayBuffer(Buffer.concat(self._body));
          } else if (capability.blobConstructor) {
            body = new global.Blob(self._body.map(function (buffer) {
              return toArrayBuffer(buffer);
            }), {
              type: (headersObj['content-type'] || {}).value || ''
            });
          } else {
            // get utf8 string
            body = Buffer.concat(self._body).toString();
          }
        }

        // create flattened list of headers
        var headersList = [];
        Object.keys(headersObj).forEach(function (keyName) {
          var name = headersObj[keyName].name;
          var value = headersObj[keyName].value;
          if (Array.isArray(value)) {
            value.forEach(function (v) {
              headersList.push([name, v]);
            });
          } else {
            headersList.push([name, value]);
          }
        });

        if (self._mode === 'fetch') {
          var signal = null;
          if (capability.abortController) {
            var controller = new AbortController();
            signal = controller.signal;
            self._fetchAbortController = controller;

            if ('requestTimeout' in opts && opts.requestTimeout !== 0) {
              global.setTimeout(function () {
                self.emit('requestTimeout');
                if (self._fetchAbortController) self._fetchAbortController.abort();
              }, opts.requestTimeout);
            }
          }

          global.fetch(self._opts.url, {
            method: self._opts.method,
            headers: headersList,
            body: body || undefined,
            mode: 'cors',
            credentials: opts.withCredentials ? 'include' : 'same-origin',
            signal: signal
          }).then(function (response) {
            self._fetchResponse = response;
            self._connect();
          }, function (reason) {
            self.emit('error', reason);
          });
        } else {
          var xhr = self._xhr = new global.XMLHttpRequest();
          try {
            xhr.open(self._opts.method, self._opts.url, true);
          } catch (err) {
            process.nextTick(function () {
              self.emit('error', err);
            });
            return;
          }

          // Can't set responseType on really old browsers
          if ('responseType' in xhr) xhr.responseType = self._mode.split(':')[0];

          if ('withCredentials' in xhr) xhr.withCredentials = !!opts.withCredentials;

          if (self._mode === 'text' && 'overrideMimeType' in xhr) xhr.overrideMimeType('text/plain; charset=x-user-defined');

          if ('requestTimeout' in opts) {
            xhr.timeout = opts.requestTimeout;
            xhr.ontimeout = function () {
              self.emit('requestTimeout');
            };
          }

          headersList.forEach(function (header) {
            xhr.setRequestHeader(header[0], header[1]);
          });

          self._response = null;
          xhr.onreadystatechange = function () {
            switch (xhr.readyState) {
              case rStates.LOADING:
              case rStates.DONE:
                self._onXHRProgress();
                break;
            }
          };
          // Necessary for streaming in Firefox, since xhr.response is ONLY defined
          // in onprogress, not in onreadystatechange with xhr.readyState = 3
          if (self._mode === 'moz-chunked-arraybuffer') {
            xhr.onprogress = function () {
              self._onXHRProgress();
            };
          }

          xhr.onerror = function () {
            if (self._destroyed) return;
            self.emit('error', new Error('XHR error'));
          };

          try {
            xhr.send(body);
          } catch (err) {
            process.nextTick(function () {
              self.emit('error', err);
            });
            return;
          }
        }
      };

      /**
       * Checks if xhr.status is readable and non-zero, indicating no error.
       * Even though the spec says it should be available in readyState 3,
       * accessing it throws an exception in IE8
       */
      function statusValid(xhr) {
        try {
          var status = xhr.status;
          return status !== null && status !== 0;
        } catch (e) {
          return false;
        }
      }

      ClientRequest.prototype._onXHRProgress = function () {
        var self = this;

        if (!statusValid(self._xhr) || self._destroyed) return;

        if (!self._response) self._connect();

        self._response._onXHRProgress();
      };

      ClientRequest.prototype._connect = function () {
        var self = this;

        if (self._destroyed) return;

        self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode);
        self._response.on('error', function (err) {
          self.emit('error', err);
        });

        self.emit('response', self._response);
      };

      ClientRequest.prototype._write = function (chunk, encoding, cb) {
        var self = this;

        self._body.push(chunk);
        cb();
      };

      ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
        var self = this;
        self._destroyed = true;
        if (self._response) self._response._destroyed = true;
        if (self._xhr) self._xhr.abort();else if (self._fetchAbortController) self._fetchAbortController.abort();
      };

      ClientRequest.prototype.end = function (data, encoding, cb) {
        var self = this;
        if (typeof data === 'function') {
          cb = data;
          data = undefined;
        }

        stream.Writable.prototype.end.call(self, data, encoding, cb);
      };

      ClientRequest.prototype.flushHeaders = function () {};
      ClientRequest.prototype.setTimeout = function () {};
      ClientRequest.prototype.setNoDelay = function () {};
      ClientRequest.prototype.setSocketKeepAlive = function () {};

      // Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
      var unsafeHeaders = ['accept-charset', 'accept-encoding', 'access-control-request-headers', 'access-control-request-method', 'connection', 'content-length', 'cookie', 'cookie2', 'date', 'dnt', 'expect', 'host', 'keep-alive', 'origin', 'referer', 'te', 'trailer', 'transfer-encoding', 'upgrade', 'user-agent', 'via'];
    }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {}, require("buffer").Buffer);
  }, { "./capability": 44, "./response": 46, "_process": 19, "buffer": 6, "inherits": 13, "readable-stream": 34, "to-arraybuffer": 48 }], 46: [function (require, module, exports) {
    (function (process, global, Buffer) {
      var capability = require('./capability');
      var inherits = require('inherits');
      var stream = require('readable-stream');

      var rStates = exports.readyStates = {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4
      };

      var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode) {
        var self = this;
        stream.Readable.call(self);

        self._mode = mode;
        self.headers = {};
        self.rawHeaders = [];
        self.trailers = {};
        self.rawTrailers = [];

        // Fake the 'close' event, but only once 'end' fires
        self.on('end', function () {
          // The nextTick is necessary to prevent the 'request' module from causing an infinite loop
          process.nextTick(function () {
            self.emit('close');
          });
        });

        if (mode === 'fetch') {
          self._fetchResponse = response;

          self.url = response.url;
          self.statusCode = response.status;
          self.statusMessage = response.statusText;

          response.headers.forEach(function (header, key) {
            self.headers[key.toLowerCase()] = header;
            self.rawHeaders.push(key, header);
          });

          if (capability.writableStream) {
            var writable = new WritableStream({
              write: function (chunk) {
                return new Promise(function (resolve, reject) {
                  if (self._destroyed) {
                    return;
                  } else if (self.push(new Buffer(chunk))) {
                    resolve();
                  } else {
                    self._resumeFetch = resolve;
                  }
                });
              },
              close: function () {
                if (!self._destroyed) self.push(null);
              },
              abort: function (err) {
                if (!self._destroyed) self.emit('error', err);
              }
            });

            try {
              response.body.pipeTo(writable);
              return;
            } catch (e) {} // pipeTo method isn't defined. Can't find a better way to feature test this
          }
          // fallback for when writableStream or pipeTo aren't available
          var reader = response.body.getReader();
          function read() {
            reader.read().then(function (result) {
              if (self._destroyed) return;
              if (result.done) {
                self.push(null);
                return;
              }
              self.push(new Buffer(result.value));
              read();
            }).catch(function (err) {
              if (!self._destroyed) self.emit('error', err);
            });
          }
          read();
        } else {
          self._xhr = xhr;
          self._pos = 0;

          self.url = xhr.responseURL;
          self.statusCode = xhr.status;
          self.statusMessage = xhr.statusText;
          var headers = xhr.getAllResponseHeaders().split(/\r?\n/);
          headers.forEach(function (header) {
            var matches = header.match(/^([^:]+):\s*(.*)/);
            if (matches) {
              var key = matches[1].toLowerCase();
              if (key === 'set-cookie') {
                if (self.headers[key] === undefined) {
                  self.headers[key] = [];
                }
                self.headers[key].push(matches[2]);
              } else if (self.headers[key] !== undefined) {
                self.headers[key] += ', ' + matches[2];
              } else {
                self.headers[key] = matches[2];
              }
              self.rawHeaders.push(matches[1], matches[2]);
            }
          });

          self._charset = 'x-user-defined';
          if (!capability.overrideMimeType) {
            var mimeType = self.rawHeaders['mime-type'];
            if (mimeType) {
              var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/);
              if (charsetMatch) {
                self._charset = charsetMatch[1].toLowerCase();
              }
            }
            if (!self._charset) self._charset = 'utf-8'; // best guess
          }
        }
      };

      inherits(IncomingMessage, stream.Readable);

      IncomingMessage.prototype._read = function () {
        var self = this;

        var resolve = self._resumeFetch;
        if (resolve) {
          self._resumeFetch = null;
          resolve();
        }
      };

      IncomingMessage.prototype._onXHRProgress = function () {
        var self = this;

        var xhr = self._xhr;

        var response = null;
        switch (self._mode) {
          case 'text:vbarray':
            // For IE9
            if (xhr.readyState !== rStates.DONE) break;
            try {
              // This fails in IE8
              response = new global.VBArray(xhr.responseBody).toArray();
            } catch (e) {}
            if (response !== null) {
              self.push(new Buffer(response));
              break;
            }
          // Falls through in IE8	
          case 'text':
            try {
              // This will fail when readyState = 3 in IE9. Switch mode and wait for readyState = 4
              response = xhr.responseText;
            } catch (e) {
              self._mode = 'text:vbarray';
              break;
            }
            if (response.length > self._pos) {
              var newData = response.substr(self._pos);
              if (self._charset === 'x-user-defined') {
                var buffer = new Buffer(newData.length);
                for (var i = 0; i < newData.length; i++) buffer[i] = newData.charCodeAt(i) & 0xff;

                self.push(buffer);
              } else {
                self.push(newData, self._charset);
              }
              self._pos = response.length;
            }
            break;
          case 'arraybuffer':
            if (xhr.readyState !== rStates.DONE || !xhr.response) break;
            response = xhr.response;
            self.push(new Buffer(new Uint8Array(response)));
            break;
          case 'moz-chunked-arraybuffer':
            // take whole
            response = xhr.response;
            if (xhr.readyState !== rStates.LOADING || !response) break;
            self.push(new Buffer(new Uint8Array(response)));
            break;
          case 'ms-stream':
            response = xhr.response;
            if (xhr.readyState !== rStates.LOADING) break;
            var reader = new global.MSStreamReader();
            reader.onprogress = function () {
              if (reader.result.byteLength > self._pos) {
                self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))));
                self._pos = reader.result.byteLength;
              }
            };
            reader.onload = function () {
              self.push(null);
            };
            // reader.onerror = ??? // TODO: this
            reader.readAsArrayBuffer(response);
            break;
        }

        // The ms-stream case handles end separately in reader.onload()
        if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
          self.push(null);
        }
      };
    }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {}, require("buffer").Buffer);
  }, { "./capability": 44, "_process": 19, "buffer": 6, "inherits": 13, "readable-stream": 34 }], 47: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    'use strict';

    /*<replacement>*/

    var Buffer = require('safe-buffer').Buffer;
    /*</replacement>*/

    var isEncoding = Buffer.isEncoding || function (encoding) {
      encoding = '' + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
          return true;
        default:
          return false;
      }
    };

    function _normalizeEncoding(enc) {
      if (!enc) return 'utf8';
      var retried;
      while (true) {
        switch (enc) {
          case 'utf8':
          case 'utf-8':
            return 'utf8';
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return 'utf16le';
          case 'latin1':
          case 'binary':
            return 'latin1';
          case 'base64':
          case 'ascii':
          case 'hex':
            return enc;
          default:
            if (retried) return; // undefined
            enc = ('' + enc).toLowerCase();
            retried = true;
        }
      }
    };

    // Do not cache `Buffer.isEncoding` when checking encoding names as some
    // modules monkey-patch it to support additional encodings
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
      return nenc || enc;
    }

    // StringDecoder provides an interface for efficiently splitting a series of
    // buffers into a series of JS strings without breaking apart multi-byte
    // characters.
    exports.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case 'utf16le':
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case 'utf8':
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case 'base64':
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer.allocUnsafe(nb);
    }

    StringDecoder.prototype.write = function (buf) {
      if (buf.length === 0) return '';
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === undefined) return '';
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || '';
    };

    StringDecoder.prototype.end = utf8End;

    // Returns only complete characters in a Buffer
    StringDecoder.prototype.text = utf8Text;

    // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
    StringDecoder.prototype.fillLast = function (buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };

    // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
    // continuation byte. If an invalid byte is detected, -2 is returned.
    function utf8CheckByte(byte) {
      if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
      return byte >> 6 === 0x02 ? -1 : -2;
    }

    // Checks at most 3 bytes at the end of a Buffer in order to detect an
    // incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
    // needed to complete the UTF-8 character (if applicable) are returned.
    function utf8CheckIncomplete(self, buf, i) {
      var j = buf.length - 1;
      if (j < i) return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }

    // Validates as many continuation bytes for a multi-byte UTF-8 character as
    // needed or are available. If we see a non-continuation byte where we expect
    // one, we "replace" the validated continuation bytes we've seen so far with
    // a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
    // behavior. The continuation byte check is included three times in the case
    // where all of the continuation bytes for a character exist in the same buffer.
    // It is also done this way as a slight performance increase instead of using a
    // loop.
    function utf8CheckExtraBytes(self, buf, p) {
      if ((buf[0] & 0xC0) !== 0x80) {
        self.lastNeed = 0;
        return '\ufffd';
      }
      if (self.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 0xC0) !== 0x80) {
          self.lastNeed = 1;
          return '\ufffd';
        }
        if (self.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 0xC0) !== 0x80) {
            self.lastNeed = 2;
            return '\ufffd';
          }
        }
      }
    }

    // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== undefined) return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }

    // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
    // partial character, the character's bytes are buffered until the required
    // number of bytes are available.
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed) return buf.toString('utf8', i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString('utf8', i, end);
    }

    // For UTF-8, a replacement character is added when ending on a partial
    // character.
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : '';
      if (this.lastNeed) return r + '\ufffd';
      return r;
    }

    // UTF-16LE typically needs two bytes per character, but even if we have an even
    // number of bytes available, we need to check if we end on a leading/high
    // surrogate. In that case, we need to wait for the next two bytes in order to
    // decode the last character properly.
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString('utf16le', i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 0xD800 && c <= 0xDBFF) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString('utf16le', i, buf.length - 1);
    }

    // For UTF-16LE we do not explicitly append special replacement characters if we
    // end on a partial character, we simply let v8 handle that.
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : '';
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString('utf16le', 0, end);
      }
      return r;
    }

    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0) return buf.toString('base64', i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString('base64', i, buf.length - n);
    }

    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : '';
      if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
      return r;
    }

    // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }

    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : '';
    }
  }, { "safe-buffer": 38 }], 48: [function (require, module, exports) {
    var Buffer = require('buffer').Buffer;

    module.exports = function (buf) {
      // If the buffer is backed by a Uint8Array, a faster version will work
      if (buf instanceof Uint8Array) {
        // If the buffer isn't a subarray, return the underlying ArrayBuffer
        if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
          return buf.buffer;
        } else if (typeof buf.buffer.slice === 'function') {
          // Otherwise we need to get a proper copy
          return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        }
      }

      if (Buffer.isBuffer(buf)) {
        // This is the slow version that will work with any Buffer
        // implementation (even in old browsers)
        var arrayCopy = new Uint8Array(buf.length);
        var len = buf.length;
        for (var i = 0; i < len; i++) {
          arrayCopy[i] = buf[i];
        }
        return arrayCopy.buffer;
      } else {
        throw new Error('Argument must be a Buffer');
      }
    };
  }, { "buffer": 6 }], 49: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    'use strict';

    var punycode = require('punycode');
    var util = require('./util');

    exports.parse = urlParse;
    exports.resolve = urlResolve;
    exports.resolveObject = urlResolveObject;
    exports.format = urlFormat;

    exports.Url = Url;

    function Url() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.host = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.query = null;
      this.pathname = null;
      this.path = null;
      this.href = null;
    }

    // Reference: RFC 3986, RFC 1808, RFC 2396

    // define these here so at least they only have to be
    // compiled once on the first module load.
    var protocolPattern = /^([a-z0-9.+-]+:)/i,
        portPattern = /:[0-9]*$/,


    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,


    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],


    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),


    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),

    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
        hostEndingChars = ['/', '?', '#'],
        hostnameMaxLen = 255,
        hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
        hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,

    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },

    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },

    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
        querystring = require('querystring');

    function urlParse(url, parseQueryString, slashesDenoteHost) {
      if (url && util.isObject(url) && url instanceof Url) return url;

      var u = new Url();
      u.parse(url, parseQueryString, slashesDenoteHost);
      return u;
    }

    Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
      if (!util.isString(url)) {
        throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
      }

      // Copy chrome, IE, opera backslash-handling behavior.
      // Back slashes before the query string get converted to forward slashes
      // See: https://code.google.com/p/chromium/issues/detail?id=25916
      var queryIndex = url.indexOf('?'),
          splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
          uSplit = url.split(splitter),
          slashRegex = /\\/g;
      uSplit[0] = uSplit[0].replace(slashRegex, '/');
      url = uSplit.join(splitter);

      var rest = url;

      // trim before proceeding.
      // This is to support parse stuff like "  http://foo.com  \n"
      rest = rest.trim();

      if (!slashesDenoteHost && url.split('#').length === 1) {
        // Try fast path regexp
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.path = rest;
          this.href = rest;
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
            if (parseQueryString) {
              this.query = querystring.parse(this.search.substr(1));
            } else {
              this.query = this.search.substr(1);
            }
          } else if (parseQueryString) {
            this.search = '';
            this.query = {};
          }
          return this;
        }
      }

      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        this.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }

      // figure out if it's got a host
      // user@server is *always* interpreted as a hostname, and url
      // resolution will treat //foo/bar as host=foo,path=bar because that's
      // how the browser resolves relative URLs.
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var slashes = rest.substr(0, 2) === '//';
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }

      if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {

        // there's a hostname.
        // the first instance of /, ?, ;, or # ends the host.
        //
        // If there is an @ in the hostname, then non-host chars *are* allowed
        // to the left of the last @ sign, unless some host-ending character
        // comes *before* the @-sign.
        // URLs are obnoxious.
        //
        // ex:
        // http://a@b@c/ => user:a@b host:c
        // http://a@b?@c => user:a host:c path:/?@c

        // v0.12 TODO(isaacs): This is not quite how Chrome does things.
        // Review our test case against browsers more comprehensively.

        // find the first instance of any hostEndingChars
        var hostEnd = -1;
        for (var i = 0; i < hostEndingChars.length; i++) {
          var hec = rest.indexOf(hostEndingChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
        }

        // at this point, either we have an explicit point where the
        // auth portion cannot go past, or the last @ char is the decider.
        var auth, atSign;
        if (hostEnd === -1) {
          // atSign can be anywhere.
          atSign = rest.lastIndexOf('@');
        } else {
          // atSign must be in auth portion.
          // http://a@b/c@d => host:b auth:a path:/c@d
          atSign = rest.lastIndexOf('@', hostEnd);
        }

        // Now we have a portion which is definitely the auth.
        // Pull that off.
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = decodeURIComponent(auth);
        }

        // the host is the remaining to the left of the first non-host char
        hostEnd = -1;
        for (var i = 0; i < nonHostChars.length; i++) {
          var hec = rest.indexOf(nonHostChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
        }
        // if we still have not hit it, then the entire thing is a host.
        if (hostEnd === -1) hostEnd = rest.length;

        this.host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);

        // pull out port.
        this.parseHost();

        // we've indicated that there is a hostname,
        // so even if it's empty, it has to be present.
        this.hostname = this.hostname || '';

        // if hostname begins with [ and ends with ]
        // assume that it's an IPv6 address.
        var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

        // validate a little.
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (var i = 0, l = hostparts.length; i < l; i++) {
            var part = hostparts[i];
            if (!part) continue;
            if (!part.match(hostnamePartPattern)) {
              var newpart = '';
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  // we replace non-ASCII char with a temporary placeholder
                  // we need this to make sure size of hostname is not
                  // broken by replacing non-ASCII by nothing
                  newpart += 'x';
                } else {
                  newpart += part[j];
                }
              }
              // we test again with ASCII char only
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i);
                var notHost = hostparts.slice(i + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = '/' + notHost.join('.') + rest;
                }
                this.hostname = validParts.join('.');
                break;
              }
            }
          }
        }

        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = '';
        } else {
          // hostnames are always lower case.
          this.hostname = this.hostname.toLowerCase();
        }

        if (!ipv6Hostname) {
          // IDNA Support: Returns a punycoded representation of "domain".
          // It only converts parts of the domain name that
          // have non-ASCII characters, i.e. it doesn't matter if
          // you call it with a domain that already is ASCII-only.
          this.hostname = punycode.toASCII(this.hostname);
        }

        var p = this.port ? ':' + this.port : '';
        var h = this.hostname || '';
        this.host = h + p;
        this.href += this.host;

        // strip [ and ] from the hostname
        // the host field still retains them, though
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          if (rest[0] !== '/') {
            rest = '/' + rest;
          }
        }
      }

      // now rest is set to the post-host stuff.
      // chop off any delim chars.
      if (!unsafeProtocol[lowerProto]) {

        // First, make 100% sure that any "autoEscape" chars get
        // escaped, even if encodeURIComponent doesn't think they
        // need to be.
        for (var i = 0, l = autoEscape.length; i < l; i++) {
          var ae = autoEscape[i];
          if (rest.indexOf(ae) === -1) continue;
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }
      }

      // chop off from the tail first.
      var hash = rest.indexOf('#');
      if (hash !== -1) {
        // got a fragment string.
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf('?');
      if (qm !== -1) {
        this.search = rest.substr(qm);
        this.query = rest.substr(qm + 1);
        if (parseQueryString) {
          this.query = querystring.parse(this.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        // no query string, but parseQueryString still requested
        this.search = '';
        this.query = {};
      }
      if (rest) this.pathname = rest;
      if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
        this.pathname = '/';
      }

      //to support http.request
      if (this.pathname || this.search) {
        var p = this.pathname || '';
        var s = this.search || '';
        this.path = p + s;
      }

      // finally, reconstruct the href based on what has been validated.
      this.href = this.format();
      return this;
    };

    // format a parsed object into a url string
    function urlFormat(obj) {
      // ensure it's an object, and not a string url.
      // If it's an obj, this is a no-op.
      // this way, you can call url_format() on strings
      // to clean up potentially wonky urls.
      if (util.isString(obj)) obj = urlParse(obj);
      if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
      return obj.format();
    }

    Url.prototype.format = function () {
      var auth = this.auth || '';
      if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ':');
        auth += '@';
      }

      var protocol = this.protocol || '',
          pathname = this.pathname || '',
          hash = this.hash || '',
          host = false,
          query = '';

      if (this.host) {
        host = auth + this.host;
      } else if (this.hostname) {
        host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
        if (this.port) {
          host += ':' + this.port;
        }
      }

      if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
        query = querystring.stringify(this.query);
      }

      var search = this.search || query && '?' + query || '';

      if (protocol && protocol.substr(-1) !== ':') protocol += ':';

      // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
      // unless they had them to begin with.
      if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
      } else if (!host) {
        host = '';
      }

      if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
      if (search && search.charAt(0) !== '?') search = '?' + search;

      pathname = pathname.replace(/[?#]/g, function (match) {
        return encodeURIComponent(match);
      });
      search = search.replace('#', '%23');

      return protocol + host + pathname + search + hash;
    };

    function urlResolve(source, relative) {
      return urlParse(source, false, true).resolve(relative);
    }

    Url.prototype.resolve = function (relative) {
      return this.resolveObject(urlParse(relative, false, true)).format();
    };

    function urlResolveObject(source, relative) {
      if (!source) return relative;
      return urlParse(source, false, true).resolveObject(relative);
    }

    Url.prototype.resolveObject = function (relative) {
      if (util.isString(relative)) {
        var rel = new Url();
        rel.parse(relative, false, true);
        relative = rel;
      }

      var result = new Url();
      var tkeys = Object.keys(this);
      for (var tk = 0; tk < tkeys.length; tk++) {
        var tkey = tkeys[tk];
        result[tkey] = this[tkey];
      }

      // hash is always overridden, no matter what.
      // even href="" will remove it.
      result.hash = relative.hash;

      // if the relative url is empty, then there's nothing left to do here.
      if (relative.href === '') {
        result.href = result.format();
        return result;
      }

      // hrefs like //foo/bar always cut to the protocol.
      if (relative.slashes && !relative.protocol) {
        // take everything except the protocol from relative
        var rkeys = Object.keys(relative);
        for (var rk = 0; rk < rkeys.length; rk++) {
          var rkey = rkeys[rk];
          if (rkey !== 'protocol') result[rkey] = relative[rkey];
        }

        //urlParse appends trailing / to urls like http://www.example.com
        if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
          result.path = result.pathname = '/';
        }

        result.href = result.format();
        return result;
      }

      if (relative.protocol && relative.protocol !== result.protocol) {
        // if it's a known url protocol, then changing
        // the protocol does weird things
        // first, if it's not file:, then we MUST have a host,
        // and if there was a path
        // to begin with, then we MUST have a path.
        // if it is file:, then the host is dropped,
        // because that's known to be hostless.
        // anything else is assumed to be absolute.
        if (!slashedProtocol[relative.protocol]) {
          var keys = Object.keys(relative);
          for (var v = 0; v < keys.length; v++) {
            var k = keys[v];
            result[k] = relative[k];
          }
          result.href = result.format();
          return result;
        }

        result.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          var relPath = (relative.pathname || '').split('/');
          while (relPath.length && !(relative.host = relPath.shift()));
          if (!relative.host) relative.host = '';
          if (!relative.hostname) relative.hostname = '';
          if (relPath[0] !== '') relPath.unshift('');
          if (relPath.length < 2) relPath.unshift('');
          result.pathname = relPath.join('/');
        } else {
          result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || '';
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        // to support http.request
        if (result.pathname || result.search) {
          var p = result.pathname || '';
          var s = result.search || '';
          result.path = p + s;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      }

      var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
          isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
          mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
          removeAllDots = mustEndAbs,
          srcPath = result.pathname && result.pathname.split('/') || [],
          relPath = relative.pathname && relative.pathname.split('/') || [],
          psychotic = result.protocol && !slashedProtocol[result.protocol];

      // if the url is a non-slashed url, then relative
      // links like ../.. should be able
      // to crawl up to the hostname, as well.  This is strange.
      // result.protocol has already been set by now.
      // Later on, put the first path part into the host field.
      if (psychotic) {
        result.hostname = '';
        result.port = null;
        if (result.host) {
          if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
        }
        result.host = '';
        if (relative.protocol) {
          relative.hostname = null;
          relative.port = null;
          if (relative.host) {
            if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
          }
          relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
      }

      if (isRelAbs) {
        // it's absolute.
        result.host = relative.host || relative.host === '' ? relative.host : result.host;
        result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
        // fall through to the dot-handling below.
      } else if (relPath.length) {
        // it's relative
        // throw away the existing file, and take the new path instead.
        if (!srcPath) srcPath = [];
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
      } else if (!util.isNullOrUndefined(relative.search)) {
        // just pull out the search.
        // like href='?foo'.
        // Put this after the other two cases because it simplifies the booleans
        if (psychotic) {
          result.hostname = result.host = srcPath.shift();
          //occationaly the auth can get stuck only in host
          //this especially happens in cases like
          //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
          var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.host = result.hostname = authInHost.shift();
          }
        }
        result.search = relative.search;
        result.query = relative.query;
        //to support http.request
        if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
          result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
        }
        result.href = result.format();
        return result;
      }

      if (!srcPath.length) {
        // no path at all.  easy.
        // we've already handled the other stuff above.
        result.pathname = null;
        //to support http.request
        if (result.search) {
          result.path = '/' + result.search;
        } else {
          result.path = null;
        }
        result.href = result.format();
        return result;
      }

      // if a url ENDs in . or .., then it must get a trailing slash.
      // however, if it ends in anything else non-slashy,
      // then it must NOT get a trailing slash.
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';

      // strip single dots, resolve double dots to parent dir
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = srcPath.length; i >= 0; i--) {
        last = srcPath[i];
        if (last === '.') {
          srcPath.splice(i, 1);
        } else if (last === '..') {
          srcPath.splice(i, 1);
          up++;
        } else if (up) {
          srcPath.splice(i, 1);
          up--;
        }
      }

      // if the path is allowed to go above the root, restore leading ..s
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift('..');
        }
      }

      if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
        srcPath.unshift('');
      }

      if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
        srcPath.push('');
      }

      var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/';

      // put the host back
      if (psychotic) {
        result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
        //occationaly the auth can get stuck only in host
        //this especially happens in cases like
        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
        var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }

      mustEndAbs = mustEndAbs || result.host && srcPath.length;

      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift('');
      }

      if (!srcPath.length) {
        result.pathname = null;
        result.path = null;
      } else {
        result.pathname = srcPath.join('/');
      }

      //to support request.http
      if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
      }
      result.auth = relative.auth || result.auth;
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    };

    Url.prototype.parseHost = function () {
      var host = this.host;
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ':') {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host) this.hostname = host;
    };
  }, { "./util": 50, "punycode": 20, "querystring": 23 }], 50: [function (require, module, exports) {
    'use strict';

    module.exports = {
      isString: function (arg) {
        return typeof arg === 'string';
      },
      isObject: function (arg) {
        return typeof arg === 'object' && arg !== null;
      },
      isNull: function (arg) {
        return arg === null;
      },
      isNullOrUndefined: function (arg) {
        return arg == null;
      }
    };
  }, {}], 51: [function (require, module, exports) {
    (function (global) {

      /**
       * Module exports.
       */

      module.exports = deprecate;

      /**
       * Mark that a method should not be used.
       * Returns a modified function which warns once by default.
       *
       * If `localStorage.noDeprecation = true` is set, then it is a no-op.
       *
       * If `localStorage.throwDeprecation = true` is set, then deprecated functions
       * will throw an Error when invoked.
       *
       * If `localStorage.traceDeprecation = true` is set, then deprecated functions
       * will invoke `console.trace()` instead of `console.error()`.
       *
       * @param {Function} fn - the function to deprecate
       * @param {String} msg - the string to print to the console when `fn` is invoked
       * @returns {Function} a new "deprecated" version of `fn`
       * @api public
       */

      function deprecate(fn, msg) {
        if (config('noDeprecation')) {
          return fn;
        }

        var warned = false;
        function deprecated() {
          if (!warned) {
            if (config('throwDeprecation')) {
              throw new Error(msg);
            } else if (config('traceDeprecation')) {
              console.trace(msg);
            } else {
              console.warn(msg);
            }
            warned = true;
          }
          return fn.apply(this, arguments);
        }

        return deprecated;
      }

      /**
       * Checks `localStorage` for boolean values for the given `name`.
       *
       * @param {String} name
       * @returns {Boolean}
       * @api private
       */

      function config(name) {
        // accessing global.localStorage can trigger a DOMException in sandboxed iframes
        try {
          if (!global.localStorage) return false;
        } catch (_) {
          return false;
        }
        var val = global.localStorage[name];
        if (null == val) return false;
        return String(val).toLowerCase() === 'true';
      }
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {}], 52: [function (require, module, exports) {
    arguments[4][13][0].apply(exports, arguments);
  }, { "dup": 13 }], 53: [function (require, module, exports) {
    module.exports = function isBuffer(arg) {
      return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
    };
  }, {}], 54: [function (require, module, exports) {
    (function (process, global) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      var formatRegExp = /%[sdj%]/g;
      exports.format = function (f) {
        if (!isString(f)) {
          var objects = [];
          for (var i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]));
          }
          return objects.join(' ');
        }

        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function (x) {
          if (x === '%%') return '%';
          if (i >= len) return x;
          switch (x) {
            case '%s':
              return String(args[i++]);
            case '%d':
              return Number(args[i++]);
            case '%j':
              try {
                return JSON.stringify(args[i++]);
              } catch (_) {
                return '[Circular]';
              }
            default:
              return x;
          }
        });
        for (var x = args[i]; i < len; x = args[++i]) {
          if (isNull(x) || !isObject(x)) {
            str += ' ' + x;
          } else {
            str += ' ' + inspect(x);
          }
        }
        return str;
      };

      // Mark that a method should not be used.
      // Returns a modified function which warns once by default.
      // If --no-deprecation is set, then it is a no-op.
      exports.deprecate = function (fn, msg) {
        // Allow for deprecating things in the process of starting up.
        if (isUndefined(global.process)) {
          return function () {
            return exports.deprecate(fn, msg).apply(this, arguments);
          };
        }

        if (process.noDeprecation === true) {
          return fn;
        }

        var warned = false;
        function deprecated() {
          if (!warned) {
            if (process.throwDeprecation) {
              throw new Error(msg);
            } else if (process.traceDeprecation) {
              console.trace(msg);
            } else {
              console.error(msg);
            }
            warned = true;
          }
          return fn.apply(this, arguments);
        }

        return deprecated;
      };

      var debugs = {};
      var debugEnviron;
      exports.debuglog = function (set) {
        if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
        set = set.toUpperCase();
        if (!debugs[set]) {
          if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
            var pid = process.pid;
            debugs[set] = function () {
              var msg = exports.format.apply(exports, arguments);
              console.error('%s %d: %s', set, pid, msg);
            };
          } else {
            debugs[set] = function () {};
          }
        }
        return debugs[set];
      };

      /**
       * Echos the value of a value. Trys to print the value out
       * in the best way possible given the different types.
       *
       * @param {Object} obj The object to print out.
       * @param {Object} opts Optional options object that alters the output.
       */
      /* legacy: obj, showHidden, depth, colors*/
      function inspect(obj, opts) {
        // default options
        var ctx = {
          seen: [],
          stylize: stylizeNoColor
        };
        // legacy...
        if (arguments.length >= 3) ctx.depth = arguments[2];
        if (arguments.length >= 4) ctx.colors = arguments[3];
        if (isBoolean(opts)) {
          // legacy...
          ctx.showHidden = opts;
        } else if (opts) {
          // got an "options" object
          exports._extend(ctx, opts);
        }
        // set default options
        if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
        if (isUndefined(ctx.depth)) ctx.depth = 2;
        if (isUndefined(ctx.colors)) ctx.colors = false;
        if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
        if (ctx.colors) ctx.stylize = stylizeWithColor;
        return formatValue(ctx, obj, ctx.depth);
      }
      exports.inspect = inspect;

      // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
      inspect.colors = {
        'bold': [1, 22],
        'italic': [3, 23],
        'underline': [4, 24],
        'inverse': [7, 27],
        'white': [37, 39],
        'grey': [90, 39],
        'black': [30, 39],
        'blue': [34, 39],
        'cyan': [36, 39],
        'green': [32, 39],
        'magenta': [35, 39],
        'red': [31, 39],
        'yellow': [33, 39]
      };

      // Don't use 'blue' not visible on cmd.exe
      inspect.styles = {
        'special': 'cyan',
        'number': 'yellow',
        'boolean': 'yellow',
        'undefined': 'grey',
        'null': 'bold',
        'string': 'green',
        'date': 'magenta',
        // "name": intentionally not styling
        'regexp': 'red'
      };

      function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType];

        if (style) {
          return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
        } else {
          return str;
        }
      }

      function stylizeNoColor(str, styleType) {
        return str;
      }

      function arrayToHash(array) {
        var hash = {};

        array.forEach(function (val, idx) {
          hash[val] = true;
        });

        return hash;
      }

      function formatValue(ctx, value, recurseTimes) {
        // Provide a hook for user-specified inspect functions.
        // Check that value is an object with an inspect function on it
        if (ctx.customInspect && value && isFunction(value.inspect) &&
        // Filter out the util module, it's inspect function is special
        value.inspect !== exports.inspect &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
          var ret = value.inspect(recurseTimes, ctx);
          if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes);
          }
          return ret;
        }

        // Primitive types cannot have properties
        var primitive = formatPrimitive(ctx, value);
        if (primitive) {
          return primitive;
        }

        // Look up the keys of the object.
        var keys = Object.keys(value);
        var visibleKeys = arrayToHash(keys);

        if (ctx.showHidden) {
          keys = Object.getOwnPropertyNames(value);
        }

        // IE doesn't make error fields non-enumerable
        // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
        if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
          return formatError(value);
        }

        // Some type of object without properties can be shortcutted.
        if (keys.length === 0) {
          if (isFunction(value)) {
            var name = value.name ? ': ' + value.name : '';
            return ctx.stylize('[Function' + name + ']', 'special');
          }
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
          }
          if (isDate(value)) {
            return ctx.stylize(Date.prototype.toString.call(value), 'date');
          }
          if (isError(value)) {
            return formatError(value);
          }
        }

        var base = '',
            array = false,
            braces = ['{', '}'];

        // Make Array say that they are Array
        if (isArray(value)) {
          array = true;
          braces = ['[', ']'];
        }

        // Make functions say that they are functions
        if (isFunction(value)) {
          var n = value.name ? ': ' + value.name : '';
          base = ' [Function' + n + ']';
        }

        // Make RegExps say that they are RegExps
        if (isRegExp(value)) {
          base = ' ' + RegExp.prototype.toString.call(value);
        }

        // Make dates with properties first say the date
        if (isDate(value)) {
          base = ' ' + Date.prototype.toUTCString.call(value);
        }

        // Make error with message first say the error
        if (isError(value)) {
          base = ' ' + formatError(value);
        }

        if (keys.length === 0 && (!array || value.length == 0)) {
          return braces[0] + base + braces[1];
        }

        if (recurseTimes < 0) {
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
          } else {
            return ctx.stylize('[Object]', 'special');
          }
        }

        ctx.seen.push(value);

        var output;
        if (array) {
          output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
        } else {
          output = keys.map(function (key) {
            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
          });
        }

        ctx.seen.pop();

        return reduceToSingleString(output, base, braces);
      }

      function formatPrimitive(ctx, value) {
        if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
        if (isString(value)) {
          var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
          return ctx.stylize(simple, 'string');
        }
        if (isNumber(value)) return ctx.stylize('' + value, 'number');
        if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
        // For some reason typeof null is "object", so special case here.
        if (isNull(value)) return ctx.stylize('null', 'null');
      }

      function formatError(value) {
        return '[' + Error.prototype.toString.call(value) + ']';
      }

      function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = [];
        for (var i = 0, l = value.length; i < l; ++i) {
          if (hasOwnProperty(value, String(i))) {
            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
          } else {
            output.push('');
          }
        }
        keys.forEach(function (key) {
          if (!key.match(/^\d+$/)) {
            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
          }
        });
        return output;
      }

      function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc;
        desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
        if (desc.get) {
          if (desc.set) {
            str = ctx.stylize('[Getter/Setter]', 'special');
          } else {
            str = ctx.stylize('[Getter]', 'special');
          }
        } else {
          if (desc.set) {
            str = ctx.stylize('[Setter]', 'special');
          }
        }
        if (!hasOwnProperty(visibleKeys, key)) {
          name = '[' + key + ']';
        }
        if (!str) {
          if (ctx.seen.indexOf(desc.value) < 0) {
            if (isNull(recurseTimes)) {
              str = formatValue(ctx, desc.value, null);
            } else {
              str = formatValue(ctx, desc.value, recurseTimes - 1);
            }
            if (str.indexOf('\n') > -1) {
              if (array) {
                str = str.split('\n').map(function (line) {
                  return '  ' + line;
                }).join('\n').substr(2);
              } else {
                str = '\n' + str.split('\n').map(function (line) {
                  return '   ' + line;
                }).join('\n');
              }
            }
          } else {
            str = ctx.stylize('[Circular]', 'special');
          }
        }
        if (isUndefined(name)) {
          if (array && key.match(/^\d+$/)) {
            return str;
          }
          name = JSON.stringify('' + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = ctx.stylize(name, 'name');
          } else {
            name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
            name = ctx.stylize(name, 'string');
          }
        }

        return name + ': ' + str;
      }

      function reduceToSingleString(output, base, braces) {
        var numLinesEst = 0;
        var length = output.reduce(function (prev, cur) {
          numLinesEst++;
          if (cur.indexOf('\n') >= 0) numLinesEst++;
          return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
        }, 0);

        if (length > 60) {
          return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
        }

        return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
      }

      // NOTE: These type checking functions intentionally don't use `instanceof`
      // because it is fragile and can be easily faked with `Object.create()`.
      function isArray(ar) {
        return Array.isArray(ar);
      }
      exports.isArray = isArray;

      function isBoolean(arg) {
        return typeof arg === 'boolean';
      }
      exports.isBoolean = isBoolean;

      function isNull(arg) {
        return arg === null;
      }
      exports.isNull = isNull;

      function isNullOrUndefined(arg) {
        return arg == null;
      }
      exports.isNullOrUndefined = isNullOrUndefined;

      function isNumber(arg) {
        return typeof arg === 'number';
      }
      exports.isNumber = isNumber;

      function isString(arg) {
        return typeof arg === 'string';
      }
      exports.isString = isString;

      function isSymbol(arg) {
        return typeof arg === 'symbol';
      }
      exports.isSymbol = isSymbol;

      function isUndefined(arg) {
        return arg === void 0;
      }
      exports.isUndefined = isUndefined;

      function isRegExp(re) {
        return isObject(re) && objectToString(re) === '[object RegExp]';
      }
      exports.isRegExp = isRegExp;

      function isObject(arg) {
        return typeof arg === 'object' && arg !== null;
      }
      exports.isObject = isObject;

      function isDate(d) {
        return isObject(d) && objectToString(d) === '[object Date]';
      }
      exports.isDate = isDate;

      function isError(e) {
        return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
      }
      exports.isError = isError;

      function isFunction(arg) {
        return typeof arg === 'function';
      }
      exports.isFunction = isFunction;

      function isPrimitive(arg) {
        return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
        typeof arg === 'undefined';
      }
      exports.isPrimitive = isPrimitive;

      exports.isBuffer = require('./support/isBuffer');

      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }

      function pad(n) {
        return n < 10 ? '0' + n.toString(10) : n.toString(10);
      }

      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // 26 Feb 16:19:34
      function timestamp() {
        var d = new Date();
        var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
        return [d.getDate(), months[d.getMonth()], time].join(' ');
      }

      // log is just a thin wrapper to console.log that prepends a timestamp
      exports.log = function () {
        console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
      };

      /**
       * Inherit the prototype methods from one constructor into another.
       *
       * The Function.prototype.inherits from lang.js rewritten as a standalone
       * function (not on Function.prototype). NOTE: If this file is to be loaded
       * during bootstrapping this function needs to be rewritten using some native
       * functions as prototype setup using normal JavaScript does not work as
       * expected during bootstrapping (see mirror.js in r114903).
       *
       * @param {function} ctor Constructor function which needs to inherit the
       *     prototype.
       * @param {function} superCtor Constructor function to inherit prototype from.
       */
      exports.inherits = require('inherits');

      exports._extend = function (origin, add) {
        // Don't do anything if add isn't an object
        if (!add || !isObject(add)) return origin;

        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
          origin[keys[i]] = add[keys[i]];
        }
        return origin;
      };

      function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }
    }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, { "./support/isBuffer": 53, "_process": 19, "inherits": 52 }], 55: [function (require, module, exports) {
    module.exports = extend;

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function extend() {
      var target = {};

      for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    }
  }, {}], 56: [function (require, module, exports) {
    require('es6-shim');
    var solc = require('solc/wrapper');

    function loadScript(name, url, callback) {
      var script = document.getElementById("script-" + name);
      if (script != null) {
        script.parentElement.removeChild(script);
      }

      script = document.createElement("script");
      script.type = "text/javascript";
      script.setAttribute("id", "script-" + name);

      if (script.readyState) {
        //IE
        script.onreadystatechange = function () {
          if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        //Others
        script.onload = function () {
          callback();
        };
      }

      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    }

    function loadSolcJson(url, callback) {
      delete window.Module;
      // NOTE: workaround some browsers
      window.Module = undefined;
      // var url = "https://ethereum.github.io/solc-bin/bin/" + version;
      loadScript("", url, function () {
        var compiler = solc(window.Module);
        callback(compiler);
      });
    }

    module.exports = {
      'loadSolcJson': loadSolcJson
    };
  }, { "es6-shim": 9, "solc/wrapper": 41 }], 57: [function (require, module, exports) {
    require('es6-shim');
    var solc = require('./browser-solc');

    /*
    var domIsReady = (function(domIsReady) {
       var isBrowserIeOrNot = function() {
          return (!document.attachEvent || typeof document.attachEvent === "undefined" ? 'not-ie' : 'ie');
       }
    
       domIsReady = function(callback) {
          if(callback && typeof callback === 'function'){
             if(isBrowserIeOrNot() !== 'ie') {
                document.addEventListener("DOMContentLoaded", function() {
                   return callback();
                });
             } else {
                document.attachEvent("onreadystatechange", function() {
                   if(document.readyState === "complete") {
                      return callback();
                   }
                });
             }
          } else {
             console.error('The callback is not a function!');
          }
       }
    
       return domIsReady;
    })(domIsReady || {});
    
    (function(document, window, domIsReady, undefined) {
       domIsReady(function() {
          window.BrowserSolc = solc;
       });
    })(document, window, domIsReady);*/

    module.exports = solc;
  }, { "./browser-solc": 56, "es6-shim": 9 }] }, {}, [57]);
