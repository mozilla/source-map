let cachedWasm = null;

module.exports = async function wasm() {
  if (cachedWasm) {
    return cachedWasm;
  }

  let wasmExports;

  // Once we support Es Modules is Workers in Firefox,
  // we can migrate all modules from CommonJS to ES Modules, especially the current module
  // and import the wasm mjs from the top level and no longar have to be async here!
  //
  // => This mean that we will no longer require to be async in this library, at least on nodejs
  const wasm = await import("../wasm-mappings/source-map-mappings-wasm-api/source_map_mappings_wasm_api.mjs");
  if (true /* IS NODE */) {
    const path = require('path').join(__dirname, '../wasm-mappings/source-map-mappings-wasm-api/source_map_mappings_wasm_api_bg.wasm');
    const bytes = require('fs').readFileSync(path);
    const wasmModule = new WebAssembly.Module(bytes);
    wasmExports = wasm.initSync(wasmModule);
  } else { /* IS BROWSER */
    wasmExports = await wasm.default("../wasm-mappings/source-map-mappings-wasm-api/source_map_mappings_wasm_api.wasm");
  }

  cachedWasm = {
    exports: wasmExports,
    withMappingCallback,
  };
  return cachedWasm;
};

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.lastGeneratedColumn = null;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

const callbackStack = [];

function withMappingCallback(mappingCallback, f) {
  callbackStack.push(mappingCallback);
  try {
    f();
  } finally {
    callbackStack.pop();
  }
}

// Expose this method to WASM/Rust
module.exports.mapping_callback =
  (
    generatedLine,
    generatedColumn,

    hasLastGeneratedColumn,
    lastGeneratedColumn,

    hasOriginal,
    source,
    originalLine,
    originalColumn,

    hasName,
    name
  ) => {
    const mapping = new Mapping();
    // JS uses 1-based line numbers, wasm uses 0-based.
    mapping.generatedLine = generatedLine + 1;
    mapping.generatedColumn = generatedColumn;

    if (hasLastGeneratedColumn) {
      // JS uses inclusive last generated column, wasm uses exclusive.
      mapping.lastGeneratedColumn = lastGeneratedColumn - 1;
    }

    if (hasOriginal) {
      mapping.source = source;
      // JS uses 1-based line numbers, wasm uses 0-based.
      mapping.originalLine = originalLine + 1;
      mapping.originalColumn = originalColumn;

      if (hasName) {
        mapping.name = name;
      }
    }

    callbackStack[callbackStack.length - 1](mapping);
  };
