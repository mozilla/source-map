/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var util = require('./util');

  // Convert the given ASCII string into a Uint8Array with room for `reserved`
  // number of int32 slots at the start.
  function stringToArray(string, reserved) {
    var reservedSize = reserved * 4;
    var length = string.length + reservedSize;
    var array = new Uint8Array(length);

    for (var idx = reservedSize; idx < length; idx++) {
      var ch = string.charCodeAt(idx - reservedSize);
      if (ch > 0x80) {
        throw new Error("Unexpected non-ASCII character: '" + string.charAt(idx)
                        + "' at index " + idx + ". A source map's 'mappings' string "
                        + "should only contain ASCII characters.");
      }
      array[idx] = ch;
    }

    return array;
  }

  function AsmParse(stdlib, foreign, buffer) {
    "use asm";

    // Foreign functions.

    var eachMapping = foreign.eachMapping;
    var getBufferLength = foreign.getBufferLength;

    // Heap views.

    var HEAPU8 = new stdlib.Uint8Array(buffer);
    var HEAP32 = new stdlib.Int32Array(buffer);
    var HEAPU32 = new stdlib.Uint32Array(buffer);

    // Constants.

    var semicolon = 59; // ';'
    var comma = 44;     // ','

    var VLQ_BASE_SHIFT = 5;
    var VLQ_BASE = 32;             // 1 << VLQ_BASE_SHIFT
    var VLQ_BASE_MASK = 31;        // VLQ_BASE - 1
    var VLQ_CONTINUATION_BIT = 32; // VLQ_BASE

    // Reserved slots in the buffer. Access via `buffer[slotName]`.

    // The current index into the string. Uint32.
    var slotIdx = 0;
    // The value of the last parsed VLQ. Int32.
    var slotVlq = 1;
    // The end index of the string. Uint32.
    var slotEndIdx = 2;

    var NUMBER_OF_RESERVED_SLOTS = 3;
    var SIZE_OF_RESERVED_SLOTS = 12; // NUMBER_OF_RESERVED_SLOTS

    // Reserved slot methods and accessors.

    function getIdx() {
      return HEAPU32[slotIdx >> 2]|0;
    }

    function setIdx(val) {
      val = val|0;
      HEAPU32[slotIdx >> 2] = val;
      return;
    }

    function incIdx() {
      var idx = 0;
      var newIdx = 0;
      idx = getIdx()|0;
      newIdx = (idx + 1)|0;
      setIdx(newIdx);
      return;
    }

    function getEndIdx() {
      return HEAPU32[slotEndIdx >> 2]|0;
    }

    function setEndIdx(val) {
      val = val|0;
      HEAPU32[slotEndIdx >> 2] = val;
      return;
    }

    function getVlq() {
      return HEAP32[slotVlq >> 2]|0;
    }

    function setVlq(val) {
      val = val|0;
      HEAP32[slotVlq >> 2] = val;
      return;
    }

    // Decode a base 64 value. char -> int. Returns -1 on failure.
    function decodeBase64(ch) {
      ch = ch|0;

      var bigA = 65;     // 'A'
      var bigZ = 90;     // 'Z'

      var littleA = 97;  // 'a'
      var littleZ = 122; // 'z'

      var zero = 48;     // '0'
      var nine = 57;     // '9'

      var plus = 43;     // '+'
      var slash = 47;    // '/'

      // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
      if ((bigA|0) <= (ch|0)) if ((ch|0) <= (bigZ|0)) {
        return (ch - bigA)|0;
      }

      // 26 - 51: abcdefghijklmnopqrstuvwxyz
      if ((littleA|0) <= (ch|0)) if ((ch|0) <= (littleZ|0)) {
        return (ch - littleA + 26)|0;
      }

      // 52 - 61: 0123456789
      if ((zero|0) <= (ch|0)) if ((ch|0) <= (nine|0)) {
        return (ch - zero + 52)|0;
      }

      // 62: +
      if ((ch|0) == (plus|0)) {
        return 62;
      }

      // 63: /
      if ((ch|0) == (slash|0)) {
        return 63;
      }

      // Invalid base64 string.
      return -1;
    }

    function fromVLQSigned(value) {
      value = value|0;
      var isNegative = 0;
      var shifted = 0;

      isNegative = (value & 1) == 1;
      shifted = value >> 1;
      if ((isNegative|0) == 1) {
        return (-shifted)|0;
      }

      return shifted|0;
    }

    // Returns 1 on success, 0 on failure. On success, result is stored in the
    // vlq reserved slot.
    function decodeVLQ() {
      var result = 0;
      var shift = 0;
      var shifted = 0;
      var digit = 0;
      var continuation = 0;

      var idx = 0;
      var endIdx = 0;

      endIdx = getEndIdx()|0;

      do {
        idx = getIdx()|0;
        if ((idx|0) >= (endIdx|0)) {
          return 0;
        }

        digit = decodeBase64(getCharacterAtIdx()|0)|0;
        if ((digit|0) < 0) {
          return 0;
        }
        incIdx();

        continuation = digit & VLQ_CONTINUATION_BIT;
        digit = digit & VLQ_BASE_MASK;
        shifted = digit << shift;
        result = (result + shifted)|0;
      } while ((continuation|0) != 0);

      result = fromVLQSigned(result)|0;
      setVlq(result);
      return 1;
    }

    // Get the character at the current index.
    function getCharacterAtIdx() {
      var idx = 0;
      idx = getIdx()|0;
      return HEAPU8[idx >> 0]|0;
    }

    // Return 1 if there is a mapping separator character at the current index,
    // otherwise 0.
    function isSeperatorAtIdx() {
      var ch = 0;
      var idx = 0;
      var endIdx = 0;

      idx = getIdx()|0;
      endIdx = getEndIdx()|0;

      if ((idx|0) >= (endIdx|0)) {
        return 1;
      }

      ch = getCharacterAtIdx()|0;

      if ((ch|0) == (comma|0)) {
        return 1;
      }

      if ((ch|0) == (semicolon|0)) {
        return 1;
      }

      return 0;
    }

    // Returns 1 on success, 0 on failure.
    function parse() {
      var generatedLine = 1;
      var generatedColumn = 0;
      var originalLine = 0;
      var originalColumn = 0;
      var source = 0;
      var name = 0;

      var ch = 0;
      var idx = 0;
      var endIdx = 0;
      var result = 0;
      var vlq = 0;

      // Skip past the reserved slots to the data.
      setIdx(SIZE_OF_RESERVED_SLOTS|0);

      // Initialize the end index.
      endIdx = getBufferLength()|0;
      setEndIdx(endIdx|0);


      while ((getIdx()|0) < (endIdx|0)) {
        ch = getCharacterAtIdx()|0;

        if ((ch|0) == (semicolon|0)) {
          generatedLine = (generatedLine + 1)|0;
          incIdx();
          generatedColumn = 0;
          continue;
        }

        if ((ch|0) == (comma|0)) {
          incIdx();
          continue;
        }

        // Generated column.
        result = decodeVLQ()|0;
        if ((result|0) == 0) {
          return 0;
        }
        vlq = getVlq()|0;
        generatedColumn = (generatedColumn + vlq)|0;
        result = isSeperatorAtIdx()|0;
        if ((result|0) == 1) {
          eachMapping(2, generatedLine|0, generatedColumn|0, -1, -1, -1, -1);
          continue;
        }

        // Original source.
        result = decodeVLQ()|0;
        if ((result|0) == 0) {
          return 0;
        }
        vlq = getVlq()|0;
        source = (source + vlq)|0;
        result = isSeperatorAtIdx()|0;
        if ((result|0) == 1) {
          return 0;
        }

        // Original line.
        result = decodeVLQ()|0;
        if ((result|0) == 0) {
          return 0;
        }
        vlq = getVlq()|0;
        originalLine = (originalLine + vlq)|0;
        result = isSeperatorAtIdx()|0;
        if ((result|0) == 1) {
          return 0;
        }

        // Original column.
        result = decodeVLQ()|0;
        if ((result|0) == 0) {
          return 0;
        }
        vlq = getVlq()|0;
        originalColumn = (originalColumn + vlq)|0;
        result = isSeperatorAtIdx()|0;
        if ((result|0) == 1) {
          eachMapping(5, generatedLine|0, generatedColumn|0, source|0, originalLine|0,
                      originalColumn|0, -1);
          continue;
        }

        // Name.
        result = decodeVLQ()|0;
        if ((result|0) == 0) {
          return 0;
        }
        vlq = getVlq()|0;
        name = (name + vlq)|0;
        eachMapping(6, generatedLine|0, generatedColumn|0, source|0, originalLine|0,
                    originalColumn|0, name|0);

        // Eat away any garbage at the end of this mapping.
        result = isSeperatorAtIdx()|0;
        while ((result|0) == 0) {
          incIdx();
          result = isSeperatorAtIdx()|0;
        }
      }

      return 1;
    }

    return { parse: parse };
  };

  var NUMBER_OF_RESERVED_SLOTS = 3;

  exports.parseMappings = function (mappings, sourceRoot) {
    function eachMapping(segmentsParsed, generatedLine, generatedColumn,
                         sourceIdx, originalLine, originalColumn, nameIdx) {
      var mapping = {};
      this.__generatedMappings.push(mapping);

      mapping.generatedColumn = generatedColumn;
      mapping.generatedLine

      if (segmentsParsed >= 5) {
        this.__originalMappings.push(mapping);

        // try {
        //   mapping.source = this._sources.at(sourceIdx);
        // } catch (e) {
        //   // TODO
        // }
        mapping.originalLine = originalLine;
        mapping.originalColumn = originalColumn;

        if (segmentsParsed >= 6 && this._names.has()) {
          // try {
          //   mapping.name = this._names.at(nameIdx);
          // } catch (e) {
          //   // TODO
          // }
        }
      }
    }

    var buffer = stringToArray(mappings, NUMBER_OF_RESERVED_SLOTS);
    var result = AsmParse(typeof window !== "undefined" ? window : global,
                          {
                            eachMapping: eachMapping.bind(this),
                            getBufferLength: function () { return buffer.byteLength; }
                          },
                          buffer)
        .parse();
    if (!result) {
      throw new Error("Error parsing source map's mappings");
    }

    this.__generatedMappings.sort(util.compareByGeneratedPositions);
    this.__originalMappings.sort(util.compareByOriginalPositions);
  };

});
