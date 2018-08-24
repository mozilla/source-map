/* eslint-env browser */
// Browser version of reading a wasm file into an array buffer.

// Webpack is configured to load .wasm files using base64-loader, which
// loads the file's contents as a base64-encoded string.
const wasmBase64 = require("./mappings.wasm");

module.exports = function readWasm() {
  const dataString = atob(wasmBase64);
  const data = new Uint8Array(dataString.length);

  for (let i = 0; i < data.length; ++i) {
    data[i] = dataString.charCodeAt(i);
  }

  return Promise.resolve(data.buffer);
};
