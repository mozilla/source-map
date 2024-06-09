import { mapping_callback } from '../../lib/wasm.js';

let wasm;

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
* Get the last error's error code, or 0 if there was none.
*
* See `source_map_mappings::Error` for the error code definitions.
* @returns {number}
*/
export function get_last_error() {
    const ret = wasm.get_last_error();
    return ret >>> 0;
}

/**
* Allocate space for a mappings string of the given size (in bytes).
*
* It is the JS callers responsibility to initialize the resulting buffer by
* copying the JS `String` holding the source map's "mappings" into it (encoded
* in ascii).
* @param {number} size
* @returns {number}
*/
export function allocate_mappings(size) {
    const ret = wasm.allocate_mappings(size);
    return ret;
}

/**
* Parse the given initialized mappings string into a `Mappings` structure.
*
* Returns `NULL` on failure, or a pointer to the parsed `Mappings` structure
* on success.
*
* In the case of failure, the error can be retrieved with `get_last_error`.
*
* In the case of success, the caller takes ownership of the result, and must
* call `free_mappings` to destroy it when finished.
*
* In both the success or failure cases, the caller gives up ownership of the
* input mappings string and must not use it again.
* @param {number} mappings
* @returns {number}
*/
export function parse_mappings(mappings) {
    const ret = wasm.parse_mappings(mappings);
    return ret;
}

/**
* Destroy the given `Mappings` structure.
*
* The caller gives up ownership of the mappings and must not use them again.
* @param {number} mappings
*/
export function free_mappings(mappings) {
    wasm.free_mappings(mappings);
}

/**
* Invoke the `mapping_callback` on each mapping in the given `Mappings`
* structure, in order of generated location.
* @param {number} mappings
*/
export function by_generated_location(mappings) {
    wasm.by_generated_location(mappings);
}

/**
* Compute column spans for the given mappings.
* @param {number} mappings
*/
export function compute_column_spans(mappings) {
    wasm.compute_column_spans(mappings);
}

/**
* Invoke the `mapping_callback` on each mapping in the given `Mappings`
* structure that has original location information, in order of original
* location.
* @param {number} mappings
*/
export function by_original_location(mappings) {
    wasm.by_original_location(mappings);
}

/**
* Find the mapping for the given generated location, if any exists.
*
* If a mapping is found, the `mapping_callback` is invoked with it
* once. Otherwise, the `mapping_callback` is not invoked at all.
* @param {number} mappings
* @param {number} generated_line
* @param {number} generated_column
* @param {number} bias
*/
export function original_location_for(mappings, generated_line, generated_column, bias) {
    wasm.original_location_for(mappings, generated_line, generated_column, bias);
}

/**
* Find the mapping for the given original location, if any exists.
*
* If a mapping is found, the `mapping_callback` is invoked with it
* once. Otherwise, the `mapping_callback` is not invoked at all.
* @param {number} mappings
* @param {number} source
* @param {number} original_line
* @param {number} original_column
* @param {number} bias
*/
export function generated_location_for(mappings, source, original_line, original_column, bias) {
    wasm.generated_location_for(mappings, source, original_line, original_column, bias);
}

/**
* Find all mappings for the given original location, and invoke the
* `mapping_callback` on each of them.
*
* If `has_original_column` is `true`, then the `mapping_callback` is only
* invoked with mappings with matching source and original line **and**
* original column is equal to `original_column`. If `has_original_column` is
* `false`, then the `original_column` argument is ignored, and the
* `mapping_callback` is invoked on all mappings with matching source and
* original line.
* @param {number} mappings
* @param {number} source
* @param {number} original_line
* @param {boolean} has_original_column
* @param {number} original_column
*/
export function all_generated_locations_for(mappings, source, original_line, has_original_column, original_column) {
    wasm.all_generated_locations_for(mappings, source, original_line, has_original_column, original_column);
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_mappingcallback_af4710b7a58d26dd = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        mapping_callback(arg0 >>> 0, arg1 >>> 0, arg2 !== 0, arg3 >>> 0, arg4 !== 0, arg5 >>> 0, arg6 >>> 0, arg7 >>> 0, arg8 !== 0, arg9 >>> 0);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function initMemory(imports, maybe_memory) {

}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedUint8Memory0 = new Uint8Array();


    return wasm;
}

function initSync(module) {
    const imports = getImports();

    initMemory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('source_map_mappings_wasm_api_bg.wasm', import.meta.url);
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    initMemory(imports);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { initSync }
export default init;
