#!/usr/bin/env bash

set -eux

case "$JOB" in
    "test")
        cargo test
        ;;
    "bench")
        cargo bench
        ;;
    "wasm")
        rustup target add wasm32-unknown-unknown
        cd source-map-mappings-wasm-api/

        # Non-release builds are broken for wasm32-unknown-unknown targets right now.
        # cargo build --target wasm32-unknown-unknown
        # test -f target/wasm32-unknown-unknown/debug/source_map_mappings_wasm_api.wasm

        cargo build --release --target wasm32-unknown-unknown
        test -f target/wasm32-unknown-unknown/release/source_map_mappings_wasm_api.wasm

        rm target/wasm32-unknown-unknown/release/source_map_mappings_wasm_api.wasm
        cargo build --release --target wasm32-unknown-unknown --features profiling
        test -f target/wasm32-unknown-unknown/release/source_map_mappings_wasm_api.wasm
        ;;
    *)
        echo "Unknown \$JOB = '$JOB'"
        exit 1
esac
