# Contributing to `source-map-mappings`

## Building

To build the core library for the host target (for use with testing):

```
$ cargo build
```

To build for WebAssembly, ensure that you have the `wasm32-unknown-unknown` target:

```
$ rustup update
$ rustup target add wasm32-unknown-unknown --toolchain nightly
```

Then, cross compile to a `.wasm` file via the WebAssembly API crate:

```
$ cd source-map-mappings-wasm-api/
$ ./build.py -o output.wasm
```

The `build.py` script handles shrinking the size of the resulting `.wasm` file
for you, with `wasm-gc`, `wasm-snip`, and `wasm-opt`.

For more details, run:

```
$ ./build.py --help
```

## Testing

To run all the tests:

```
$ cargo test
```

## Automatic code formatting

We use [`rustfmt`](https://github.com/rust-lang-nursery/rustfmt) to enforce a
consistent code style across the whole code base.

You can install the latest version of `rustfmt` with this command:

```
$ rustup update nightly
$ cargo install -f rustfmt-nightly
```

Ensure that `~/.cargo/bin` is on your path.

Once that is taken care of, you can (re)format all code by running this command:

```
$ cargo fmt
```
