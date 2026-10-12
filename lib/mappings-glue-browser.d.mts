/* tslint:disable */
/* eslint-disable */

/**
 * A parsed `mappings` string, ready to be queried.
 *
 * JS owns this handle and must call `free()` on it when finished.
 */
export class Mappings {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Find all mappings for the given original location and invoke `cb` on
     * each of them.
     *
     * When `has_original_column` is false, `original_column` is ignored and
     * every mapping with a matching source and original line is yielded.
     */
    allGeneratedLocationsFor(source: number, original_line: number, has_original_column: boolean, original_column: number, cb: any): void;
    /**
     * Invoke `cb` on each mapping, in order of generated location.
     */
    byGeneratedLocation(cb: any): void;
    /**
     * Invoke `cb` on each mapping that has original location information, in
     * order of original location.
     */
    byOriginalLocation(cb: any): void;
    /**
     * Compute column spans for the mappings.
     */
    computeColumnSpans(): void;
    /**
     * Find the mapping for the given original location, if any exists, and
     * invoke `cb` with it once.
     */
    generatedLocationFor(source: number, original_line: number, original_column: number, bias: number, cb: any): void;
    /**
     * Find the mapping for the given generated location, if any exists, and
     * invoke `cb` with it once.
     */
    originalLocationFor(generated_line: number, generated_column: number, bias: number, cb: any): void;
}

/**
 * Parse a source map's `mappings` string.
 *
 * On failure, rejects with the numeric `source_map_mappings::Error` code.
 * Replaces the old `allocate_mappings` / `parse_mappings` / `get_last_error`
 * trio: `wasm-bindgen` copies the string into wasm memory itself, so JS no
 * longer has to hand-manage a buffer.
 */
export function parseMappings(mappings: string): Mappings;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_mappings_free: (a: number, b: number) => void;
    readonly mappings_allGeneratedLocationsFor: (a: number, b: number, c: number, d: number, e: number, f: any) => [number, number];
    readonly mappings_byGeneratedLocation: (a: number, b: any) => [number, number];
    readonly mappings_byOriginalLocation: (a: number, b: any) => [number, number];
    readonly mappings_computeColumnSpans: (a: number) => void;
    readonly mappings_generatedLocationFor: (a: number, b: number, c: number, d: number, e: number, f: any) => [number, number];
    readonly mappings_originalLocationFor: (a: number, b: number, c: number, d: number, e: any) => [number, number];
    readonly parseMappings: (a: number, b: number) => [number, number, number];
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
