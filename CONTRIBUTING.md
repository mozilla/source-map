# Contributing

Thank you for your interest in contributing to this library! Contributions are
very appreciated.

--------------------------------------------------------------------------------

<!-- `npm run toc` to regenerate the Table of Contents -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

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

* **A test case.** The more minimal the better, but sometimes a larger test case
  cannot be helped. This should be in the form of a gist, node script,
  repository, etc.

* **Steps to reproduce the bug.** The more exact and specific the better.

* **The result you expected.**

* **The actual result.**

## Building From Source

Install Node.js `8` or greater and then run

    $ git clone https://github.com/mozilla/source-map.git
    $ cd source-map/
    $ npm install

Next, run

    $ npm run build

This will create the following files:

* `dist/source-map.js` - The plain browser build.

## Submitting Pull Requests

Make sure that tests pass locally before creating a pull request.

Use a feature branch and pull request for each change, with logical commits. If
your reviewer asks you to make changes before the pull request is accepted,
fixup your existing commit(s) rather than adding follow up commits, and then
force push to the remote branch to update the pull request.

## Running Tests

The test suite is written for node.js. Install node.js `8` or greater and
then run the tests with `npm test`:

```shell
$ npm test
> source-map@0.7.3 test /Users/fitzgen/src/source-map
> node test/run-tests.js


137 / 137 tests passed.
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

* `doesNotThrow`

* `equal`

* `ok`

* `strictEqual`

* `throws`

(The reason for the restricted set of test functions is because we need the
tests to run inside Firefox's test suite as well and Firefox has a shimmed
version of the assert module.)

There are additional test utilities and helpers in `./test/util.js` which you
can use as well:

```js
var util = require('./util');
```

## Checking code coverage

It's fun to find ways to test lines of code that aren't visited by
the tests yet.

```shell
$ npm run coverage
$ open coverage/index.html
```

This will allow you to browse to red sections of the code that need
more attention.  Even more cool, however, is to run:

```shell
$ npm run dev
```

(On some operating systems, this may pop up a request for node to be able to open a socket.  Click "Allow" or the equivalent.)

This will run the coverage tools, and monitor all of the files in the
project, re-running the coverage tools and refreshing the browser when
any files change.  There will be a small web server running on port 4103 to enable this.  Control-C to stop.

## Updating the `lib/mappings.wasm` WebAssembly Module

Ensure that you have the Rust toolchain installed:

```
$ curl https://sh.rustup.rs -sSf | sh
```

The `wasm32-unknown-unknown` target is nightly-only at the time of writing. Use
`rustup` to ensure you have it installed:

```
$ rustup toolchain install nightly
$ rustup target add wasm32-unknown-unknown --toolchain nightly
```

Next, clone the Rust source used to create `lib/mappings.wasm`:

```
$ git clone https://github.com/fitzgen/source-map-mappings.git
$ cd source-map-mappings/
```

Make sure the crate's tests pass:

```
$ cargo test
```

Ensure that you have the following wasm post-processing tools installed:

- `wasm-nm`: https://github.com/fitzgen/wasm-nm
- `wasm-gc`: https://github.com/alexcrichton/wasm-gc
- `wasm-snip`: https://github.com/fitzgen/wasm-snip
- `wasm-opt`: https://github.com/WebAssembly/binaryen

Build Rust crate as a `.wasm` file:

```
$ cd source-map-mappings-wasm-api/
$ ./build.py -o path/to/source-map/lib/mappings.wasm
```
