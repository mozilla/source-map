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
