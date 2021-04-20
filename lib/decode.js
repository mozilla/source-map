"use strict";

function decodeSign(c) {
  if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) {
    // Inverse: 'A'/65 is "even" in base64
    // Inverse: 'a'/97 is "even" in base64
    return c % 2 === 0 ? -1 : 1;
  } else if (c >= 48 && c <= 57) {
    // Matching: '0'/48 is "even" in base64.
    return c % 2 === 0 ? 1 : -1;
  }
  return c === 47 ? -1 : 1;
}

const SIGN_BIT = Array.from({ length: 128 }, (_, c) => {
  return decodeSign(c);
});

const FIRST_MASK = 0b011110;
function decodeFirstDigit(c) {
  // For each possible first digit char code, return the numeric value.
  // What matters is the center 4 bits of the base64 number.
  if (c >= 65 && c <= 90) {
    return ((c - 65) & FIRST_MASK) >>> 1;
  } else if (c >= 97 && c <= 122) {
    return ((c - 97 + 26) & FIRST_MASK) >>> 1;
  } else if (c >= 48 && c <= 57) {
    return ((c - 48 + 52) & FIRST_MASK) >>> 1;
  }
  // Both + and / have the same center bits.
  return 0b1111;
}
const FIRST_DIGIT = Array.from({ length: 128 }, (_, c) => {
  return decodeFirstDigit(c);
});
const FIRST_DIGIT_TYPED_ARR = new Int8Array(128);
for (let i = 0; i < 128; ++i) {
  FIRST_DIGIT_TYPED_ARR[i] = decodeFirstDigit[i];
}

const GENERAL_MASK = 0b11111;
function decodeGeneralDigit(c) {
  // For each possible first digit char code, return the numeric value.
  // What matters is the right-most 5 bits of the base64 number.
  if (c >= 65 && c <= 90) {
    return c - 65;
  } else if (c >= 97 && c <= 122) {
    return (c - 97 + 26) & GENERAL_MASK;
  } else if (c >= 48 && c <= 57) {
    return (c - 48 + 52) & GENERAL_MASK;
  }
  return c === 47 ? 0b11111 : 0b11110;
}
const GENERAL_DIGIT = Array.from({ length: 128 }, (_, c) => {
  return decodeGeneralDigit(c);
});

const STATE_INITIAL = 0; // ';' or start of generated line
const STATE_SOURCE = 1; // ';' or start of source index
const STATE_SOURCE_LINE = 2; // start of source line
const STATE_SOURCE_COL = 3; // start of source column
const STATE_NAME = 4; // ';', ',', or start of name index
const STATE_END_OF_SEGMENT = 5; // ',' or ';'

function decodeMapping(aStr) {
  // 'A' ->  65 -> 000000 [ 0]
  // 'Z' ->  90 -> 011001 [25]
  // 'a' ->  97 -> 011010 [26]
  // 'f' -> 102 -> 011111 [31]

  // 'g' -> 103 -> 100000 [32]
  // 'z' -> 122 -> 110011 [51]
  // '0' ->  48 -> 110100 [52]
  // '9' ->  57 -> 111101 [61]
  // '+' ->  43 -> 111110 [62]
  // '/' ->  47 -> 111111 [63]

  // '=' ->  61
  // ';' ->  59
  // ',' ->  44

  let state = STATE_INITIAL;

  // For group/segment state:
  let generatedLine = 0;
  let generatedColumn = 0;
  let lastSourceIndex = 0;
  let sourceIndex = -1;
  let lastSourceLine = 0;
  let sourceLine = -1;
  let lastSourceCol = 0;
  let sourceCol = -1;
  let lastNameIndex = 0;
  let nameIndex = -1;

  const mappings = [];

  // For parsing numbers:
  let isFirst = true;
  let signBit = 1;
  let n = 0;
  let bitOffset = 0;

  const len = aStr.length;
  for (let idx = 0; idx <= len; ++idx) {
    const c = idx === len ? 59 : aStr.charCodeAt(idx);

    if (c === 44 || c === 59) {
      // End of segment
      if (!isFirst) {
        throw new Error("Incomplete VLQ");
      }
      // const mapping = new Int32Array(6);
      // mapping[0] = generatedLine;
      // mapping[1] = generatedColumn;
      // mapping[2] = sourceIndex;
      // mapping[3] = sourceLine;
      // mapping[4] = sourceCol;
      // mapping[5] = nameIndex;
      mappings.push([
        generatedLine,
        generatedColumn,
        sourceIndex,
        sourceLine,
        sourceCol,
        nameIndex
      ]);
      sourceIndex = sourceLine = sourceCol = nameIndex = -1;
      state = STATE_INITIAL;
      if (c === 59) {
        // Reset for new segment.
        ++generatedLine;
        generatedColumn = 0;
      }
      continue;
    }

    if (state === STATE_END_OF_SEGMENT) {
      throw new Error('Expected ";" or ","');
    }

    const isLast = c >= 65 && c <= 102;

    if (isFirst) {
      n = FIRST_DIGIT[c];
      signBit = SIGN_BIT[c];
      bitOffset = 4;
    } else {
      n |= GENERAL_DIGIT[c] << bitOffset;
      bitOffset += 5;
    }
    isFirst = isLast;

    if (isLast) {
      isFirst = true;
      const withSign = n * signBit;

      switch (state) {
        case STATE_INITIAL:
          generatedColumn += withSign;
          ++state;
          break;

        case STATE_SOURCE:
          lastSourceIndex = sourceIndex = lastSourceIndex + withSign;
          ++state;
          break;

        case STATE_SOURCE_LINE:
          lastSourceLine = sourceLine = lastSourceLine + withSign;
          ++state;
          break;

        case STATE_SOURCE_COL:
          lastSourceCol = sourceCol = lastSourceCol + withSign;
          ++state;
          break;

        case STATE_NAME:
          lastNameIndex = nameIndex = lastNameIndex + withSign;
          ++state;
          break;
      }
    }
  }

  return mappings;
}
exports.decodeMapping = decodeMapping;
