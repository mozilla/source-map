const fs = require("fs");
const path = require("path");

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

module.exports = new Promise((resolve, reject) => {
  const wasmPath = path.join(__dirname, "mappings.wasm");
  fs.readFile(wasmPath, null, (error, data) => {
    if (error) {
      return reject(error);
    }

    let currentCallback = null;

    WebAssembly.instantiate(data.buffer, {
      env: {
        mapping_callback: function (
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
        ) {
          const mapping = new Mapping;
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

          currentCallback(mapping);
        }
      }
    }).then(
      wasm => {
        resolve({
          exports: wasm.instance.exports,
          withMappingCallback: (mappingCallback, f) => {
            currentCallback = mappingCallback;
            try {
              f();
            } finally {
              currentCallback = null;
            }
          }
        });
      },
      error => {
        reject(error);
      });
  });
});
