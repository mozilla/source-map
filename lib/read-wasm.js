"use strict";

// Note: This file is replaced with "read-wasm-browser.js" when this module is
// bundled with a packager that takes package.json#browser fields into account.

module.exports = function readWasm() {
  // The generated Node glue reads `mappings.wasm` off disk and instantiates it
  // itself, so requiring it lazily here is all the loading we need to do.
  return Promise.resolve(require("./mappings-glue.js"));
};

module.exports.initialize = _ => {
  console.debug(
    "SourceMapConsumer.initialize is a no-op when running in node.js"
  );
};
