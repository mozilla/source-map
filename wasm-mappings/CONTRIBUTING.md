# Contributing to `source-map-mappings`

## Building

To build the core library for the host target (for use with testing):

```
$ cargo build
```

To build the WebAssembly module and its JS glue, use the build script in this
directory:

```
$ ./build.sh
```

That runs [`wasm-pack`](https://wasm-bindgen.github.io/wasm-pack/) twice -- once
for the `nodejs` target and once for `web` -- and installs the results into
`../lib/`. Both targets produce an identical `.wasm`; only the JS glue
differs, and the script fails if they ever diverge.

You need two tools besides Rust:

- `wasm-pack` 0.15.0 (`cargo install wasm-pack --version 0.15.0 --locked`),
  which vendors its own `wasm-bindgen`.
- `wasm-opt` from [binaryen](https://github.com/WebAssembly/binaryen) version
  132 on your `PATH`. `build.sh` refuses to run with any other version, because
  without one wasm-pack downloads an older binaryen whose output differs.

The Rust toolchain version is pinned in `rust-toolchain.toml`, including the
`wasm32-unknown-unknown` target, so `rustup` will fetch whatever is missing.

Set `PROFILING=1` to enable the `profiling` cargo feature.

The generated artifacts are committed to the repository, and the `wasm-dist`
CI job rebuilds them and fails if they differ byte-for-byte. If you change
anything under `wasm-mappings/`, re-run `./build.sh` and commit the result in
the same change.

## Testing

To run all the tests:

```
$ cargo test
```

## Automatic code formatting

We use [`rustfmt`](https://github.com/rust-lang/rustfmt) to enforce a
consistent code style across the whole code base.

```
$ rustup component add rustfmt
```

Once that is taken care of, you can (re)format all code by running this command:

```
$ cargo fmt
```
