# Contributing

Thank you for your interest in contributing to this library! Contributions are
very appreciated.

If you want help or mentorship, reach out to us in a GitHub issue,
or over Matrix in [source-map on mozilla.org](https://matrix.to/#/#source-map:mozilla.org)
and introduce yourself.

---

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Filing Issues](#filing-issues)
- [Building From Source](#building-from-source)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Running Tests](#running-tests)
- [Writing New Tests](#writing-new-tests)
- [Checking code coverage](#checking-code-coverage)
- [Updating the `lib/mappings.wasm` WebAssembly Module](#updating-the-libmappingswasm-webassembly-module)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Filing Issues

If you are filing an issue for a bug or other misbehavior, please provide:

- **A test case.** The more minimal the better, but sometimes a larger test case
  cannot be helped. This should be in the form of a gist, node script,
  repository, etc.

- **Steps to reproduce the bug.** The more exact and specific the better.

- **The result you expected.**

- **The actual result.**

## Building From Source

Install Node.js `18` or greater and then run

    $ git clone https://github.com/mozilla/source-map.git
    $ cd source-map/
    $ npm install

There is no build step for the JavaScript: the package is used directly from
`source-map.js` and `lib/`. The only generated files are `lib/mappings.wasm` and
its glue, which are committed; see
[Updating the `lib/mappings.wasm` WebAssembly Module](#updating-the-libmappingswasm-webassembly-module)
if you need to change them.

## Submitting Pull Requests

Make sure that tests pass locally before creating a pull request.

Use a feature branch and pull request for each change, with logical commits. If
your reviewer asks you to make changes before the pull request is accepted,
fixup your existing commit(s) rather than adding follow up commits, and then
force push to the remote branch to update the pull request.

## Running Tests

The test suite is written for node.js. Install node.js `18` or greater and
then run the tests with `npm test`:

```shell
$ npm test

> source-map@0.8.0 test
> git submodule update --init --recursive; node test/run-tests.js


190 / 190 tests passed.
```

## Writing New Tests

To add new tests, create a new file named `test/test-your-new-test-name.js` and
export your test functions with names that start with "test", for example:

```js
exports["test issue #123: doing the foo bar"] = function (assert) {
  ...
};
```

The new tests will be located and run automatically when you run the full test
suite.

The `assert` argument is a cut down version of node's assert module. You have
access to the following assertion functions:

- `doesNotThrow`

- `equal`

- `ok`

- `strictEqual`

- `throws`

(The reason for the restricted set of test functions is because we need the
tests to run inside Firefox's test suite as well and Firefox has a shimmed
version of the assert module.)

There are additional test utilities and helpers in `./test/util.js` which you
can use as well:

```js
var util = require("./util");
```

## Checking code coverage

It's fun to find ways to test lines of code that aren't visited by the tests yet.

```shell
$ npm run coverage
$ open coverage/index.html
```

This will allow you to browse to red sections of the code that need more attention.

## Updating the `lib/mappings.wasm` WebAssembly Module

Ensure that you have the Rust toolchain installed:

```
$ curl https://sh.rustup.rs -sSf | sh
```

The exact toolchain version is pinned in `wasm-mappings/rust-toolchain.toml`
and `rustup` will install it on demand, including the
`wasm32-unknown-unknown` target.
Note: The pin exists because CI rebuilds the
committed artifacts and fails if they differ byte-for-byte, which only works
if everyone builds with the same compiler.

Install [`wasm-pack`](https://wasm-bindgen.github.io/wasm-pack/) version
0.15.0, the version CI uses, which vendors its own `wasm-bindgen`:

```
$ cargo install wasm-pack --version 0.15.0 --locked
```

You also need `wasm-opt` from [binaryen](https://github.com/WebAssembly/binaryen)
**version 132** on your `PATH` (for example `brew install binaryen`, or a
[release download](https://github.com/WebAssembly/binaryen/releases/tag/version_132)).
`build.sh` refuses to run with any other version: without one on `PATH`,
wasm-pack falls back to downloading an older binaryen, whose output does not
match the committed `lib/mappings.wasm`.

Make sure the crate's tests pass:

```
$ cd wasm-mappings/
$ cargo test
```

Then rebuild the shipped artifacts:

```
$ ./build.sh
```

This writes five files into `lib/`:

| File                          | Purpose                                      |
| ----------------------------- | -------------------------------------------- |
| `mappings.wasm`               | the WebAssembly module itself                |
| `mappings-glue.js`            | `wasm-bindgen` glue for Node (CommonJS)      |
| `mappings-glue.d.ts`          | types for the above node glue file           |
| `mappings-glue-browser.mjs`   | `wasm-bindgen` glue for browsers (ES module) |
| `mappings-glue-browser.d.mts` | types for the above browser glue file        |

All five are generated and committed; do not edit them by hand. `package.json`'s
`browser` field swaps `lib/read-wasm.js` for `lib/read-wasm-browser.js`, which
is what selects between the Node and browser glue.

Set `PROFILING=1` to enable the crate's `profiling` feature, which wraps each
query in a `console.time` / `console.timeEnd` pair:

```
$ PROFILING=1 ./build.sh
```

See further information in [wasm-mappings/CONTRIBUTING.md](wasm-mappings/CONTRIBUTING.md).
