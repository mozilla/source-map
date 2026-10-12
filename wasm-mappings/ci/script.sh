#!/usr/bin/env bash

set -eux

# Everything below expects to run from wasm-mappings/, both for the relative
# paths and so that rustup picks up wasm-mappings/rust-toolchain.toml.
cd "$(dirname "$0")/.."

case "$JOB" in
    "test")
        cargo test
        ;;
    "bench")
        # The benches use `#![feature(test)]`, so they need nightly rather than
        # the stable toolchain pinned in rust-toolchain.toml. An explicit
        # RUSTUP_TOOLCHAIN (as set by CI) still wins.
        export RUSTUP_TOOLCHAIN="${RUSTUP_TOOLCHAIN:-nightly}"
        cargo bench
        ;;
    "wasm")
        rustup target add wasm32-unknown-unknown
        cd source-map-mappings-wasm-api/

        cargo build --release --target wasm32-unknown-unknown
        test -f target/wasm32-unknown-unknown/release/source_map_mappings_wasm_api.wasm

        rm target/wasm32-unknown-unknown/release/source_map_mappings_wasm_api.wasm
        cargo build --release --target wasm32-unknown-unknown --features profiling
        test -f target/wasm32-unknown-unknown/release/source_map_mappings_wasm_api.wasm
        ;;
    "wasm-dist")
        # Rebuild the committed wasm binary and its glue from source and fail
        # if anything differs. Without this, the shipped artifacts are never
        # checked against the Rust sources they supposedly came from.
        rustup target add wasm32-unknown-unknown
        ./build.sh
        cd ..
        git diff --stat --exit-code -- \
            lib/mappings.wasm \
            lib/mappings-glue.js \
            lib/mappings-glue.d.ts \
            lib/mappings-glue-browser.mjs \
            lib/mappings-glue-browser.d.mts
        ;;
    *)
        echo "Unknown \$JOB = '$JOB'"
        exit 1
esac
