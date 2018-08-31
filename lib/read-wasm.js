// Node version of reading a wasm file into an array buffer.
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);

module.exports = function readWasm() {
  const wasmPath = path.join(__dirname, "mappings.wasm");
  return readFile(wasmPath).then(data => data.buffer);
};
