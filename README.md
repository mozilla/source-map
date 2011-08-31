# Source Map

This is a library to generate and consume the source map format
[described here][format].

[Learn more here][feature].

This library was written in the Asynchronous Module Definition
format. It should work in the following environments:

* Modern Browsers (either after the build, or with an AMD loader such as
  RequireJS)

* Inside Firefox (as a JSM file, after the build)

* With NodeJS versions 0.4.X

## Installing with NPM (for use with NodeJS)

Simply

    $ npm install source-map

Or, if you'd like to hack on this library and have it installed via npm so you
can try out your changes:

    $ git clone https://fitzgen@github.com/mozilla/source-map.git
    $ cd source-map
    $ npm link .

## Building from Source (for everywhere else)

Install NodeJS and [Dryice][]. Then run `node Makefile.dryice.js`. This should
create the following files:

* `dist/source-map.js` - The unminified browser version.

* `dist/source-map.min.js` - The minified browser version.

* `dist/SourceMapConsumer.jsm` - The JavaScript Module for inclusion in Firefox
  source.

## API

Get a reference to the module:

    // NodeJS
    var sourceMap = require('source-map');

    // Browser builds
    var sourceMap = window.sourceMap;

    // Inside Firefox
    let sourceMap = {};
    Components.utils.import('resource:///modules/SourceMapConsumer.jsm', sourceMap);

### SourceMapConsumer

A SourceMapConsumer instance represents a parsed source map which we can query
for information about the original file positions by giving it a file position
in the generated source.

#### new SourceMapConsumer(rawSourceMap)

The only parameter is the raw source map (either as a string which can be
`JSON.parse`'d, or an object). According to the spec, source maps have the
following attributes:

* `version`: Which version of the source map spec this map is following.

* `sources`: An array of URLs to the original source files.

* `names`: An array of identifiers which can be referrenced by individual
  mappings.

* `sourceRoot`: Optional. The URL root from which all sources are relative.

* `mappings`: A string of base64 VLQs which contain the actual mappings.

* `file`: The generated filename this source map is associated with.

#### SourceMapConsumer.prototype.originalPositionFor(generatedPosition)

Returns the original source, line, and column information for the generated
source's line and column positions provided. The only argument is an object with
the following properties:

* `line`: The line number in the generated source.

* `column`: The column number in the generated source.

and an object is returned with the following properties:

* `source`: The original source file, or null if this information is not
  available.

* `line`: The line number in the original source, or null if this information is
  not available.

* `column`: The column number in the original source, or null or null if this
  information is not available.

* `name`: The original identifier, or null if this information is not available.

### SourceMapGenerator

An instance of the SourceMapGenerator represents a source map which is being
built incrementally.

#### new SourceMapGenerator(startOfSourceMap)

To create a new one, you must pass an object with the following properties:

* `file`: The filename of the generated source that this source map is
  associated with.

* `sourceRoot`: An optional root for all relative URLs in this source map.

#### SourceMapGenerator.prototype.addMapping(mapping)

Add a single mapping from original source line and column to the generated
source's line and column for this source map being created. The mapping object
should have the following properties:

* `generated`: An object with the generated line and column positions.

* `original`: An object with the original line and column positions.

* `source`: The original source file (relative to the sourceRoot).

* `name`: An optional original token name for this mapping.

#### SourceMapGenerator.prototype.toString()

Renders the source map being generated to a string.

## Running the Tests

Install NodeJS version 0.4.0 or greater, then run `node test/run-tests.js`.

[format]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit
[feature]: https://wiki.mozilla.org/DevTools/Features/SourceMap
[Dryice]: https://github.com/mozilla/dryice
