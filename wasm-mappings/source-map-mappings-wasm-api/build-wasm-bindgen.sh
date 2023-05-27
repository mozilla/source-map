#!/bin/sh

cargo build --target=wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/debug/source_map_mappings_wasm_api.wasm --out-dir . --target web --no-typescript
mv source_map_mappings_wasm_api.js source_map_mappings_wasm_api.mjs
