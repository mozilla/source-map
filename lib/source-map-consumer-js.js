"use strict";

const { decodeMapping } = require("./decode");
const util = require("./util");

function copyToInt32(arr) {
  const result = new Int32Array(arr.length * 6);
  let offset = 0;
  for (let i = 0; i < arr.length; ++i) {
    result[offset + 0] = arr[i][0];
    result[offset + 1] = arr[i][1];
    result[offset + 2] = arr[i][2];
    result[offset + 3] = arr[i][3];
    result[offset + 4] = arr[i][4];
    result[offset + 5] = arr[i][5];
    offset += 6;
  }
  return result;
}

class Mapping {
  constructor(
    generatedLine,
    generatedColumn,
    source,
    originalLine,
    originalColumn,
    name
  ) {
    this.generatedLine = generatedLine;
    this.generatedColumn = generatedColumn;

    this.source = source;
    this.originalLine = originalLine;
    this.originalColumn = originalColumn;

    this.name = name;
  }
}

function getSource(arr, offset, sources) {
  return arr[offset + 2] === -1 ? null : sources[arr[offset + 2]];
}

function getName(arr, offset, names) {
  return arr[offset + 5] === -1 ? null : names[arr[offset + 5]];
}

class SourceMapConsumerJS {
  constructor(sourceMap, aSourceMapURL) {
    const {
      version,
      file = null,
      mappings,
      sourceRoot = null,
      sources,
      sourcesContent = null,
      names = []
    } = sourceMap;

    if (version !== 3 && version !== "3") {
      throw new Error("Unsupported version: " + version);
    }

    const data = decodeMapping(mappings);

    this.file = file;
    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;

    this._data = data;
    this._byGeneratedOrder = null;
    this._byOriginalOrder = null;
    this._sourceMapURL = aSourceMapURL;

    this._sources = sources.map(String);
    this._names = names;

    this._absoluteSources = this._sources.map(s =>
      util.computeSourceURL(sourceRoot, s, aSourceMapURL)
    );
  }

  _getByOrder() {
    if (this._byGeneratedOrder === null) {
      this._data.sort((x, y) => x[0] - y[0]);
      this._byGeneratedOrder = copyToInt32(this._data);
    }
    return this._byGeneratedOrder;
  }

  eachMapping(fn) {
    const byOrder = this._getByOrder();
    const len = byOrder.length;
    for (let idx = 0; idx < len; idx += 6) {
      fn(
        new Mapping(
          /* generatedLine=*/ byOrder[idx],
          /* generatedColumn=*/ byOrder[idx + 1],
          /* source=*/ getSource(byOrder, idx, this._absoluteSources),
          /* sourceLine=*/ byOrder[idx + 3],
          /* sourceColumn=*/ byOrder[idx + 4],
          /* name=*/ getName(byOrder, idx, this._names)
        )
      );
    }
  }

  eachEphemeralMapping(fn) {
    const byOrder = this._getByOrder();
    const len = byOrder.length;
    const m = new Mapping(0, 0, null, 0, 0, null);
    for (let idx = 0; idx < len; idx += 6) {
      m.generatedLine = byOrder[idx];
      m.generatedColumn = byOrder[idx + 1];
      m.source = getSource(byOrder, idx, this._absoluteSources);
      m.originalLine = byOrder[idx + 3];
      m.originalColumn = byOrder[idx + 4];
      m.name = getName(byOrder, idx, this._names);
      fn(m);
    }
  }

  static async with(rawMap, mapURL, fn) {
    const map = new SourceMapConsumerJS(rawMap, mapURL);
    fn(map);
  }
}
exports.SourceMapConsumerJS = SourceMapConsumerJS;
