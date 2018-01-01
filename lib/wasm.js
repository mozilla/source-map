const readWasm = require("../lib/read-wasm");

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

let cachedWasm = null;

module.exports = function wasm() {
  if (cachedWasm) {
    return cachedWasm;
  }

  let currentCallback = null;

  cachedWasm = readWasm().then(buffer => {
      return WebAssembly.instantiate(buffer, {
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
          },

          start_all_generated_locations_for: function () { console.time("all_generated_locations_for"); },
          end_all_generated_locations_for: function () { console.timeEnd("all_generated_locations_for"); },

          start_compute_column_spans: function () { console.time("compute_column_spans"); },
          end_compute_column_spans: function () { console.timeEnd("compute_column_spans"); },

          start_generated_location_for: function () { console.time("generated_location_for"); },
          end_generated_location_for: function () { console.timeEnd("generated_location_for"); },

          start_original_location_for: function () { console.time("original_location_for"); },
          end_original_location_for: function () { console.timeEnd("original_location_for"); },

          start_parse_mappings: function () { console.time("parse_mappings"); },
          end_parse_mappings: function () { console.timeEnd("parse_mappings"); },

          start_sort_by_generated_location: function () { console.time("sort_by_generated_location"); },
          end_sort_by_generated_location: function () { console.timeEnd("sort_by_generated_location"); },

          start_sort_by_original_location: function () { console.time("sort_by_original_location"); },
          end_sort_by_original_location: function () { console.timeEnd("sort_by_original_location"); },
        }
      });
  }).then(wasm => {
    return {
      exports: wasm.instance.exports,
      withMappingCallback: (mappingCallback, f) => {
        currentCallback = mappingCallback;
        try {
          f();
        } finally {
          currentCallback = null;
        }
      }
    };
  }).then(null, e => {
    cachedWasm = null;
    throw e;
  });

  return cachedWasm;
};
