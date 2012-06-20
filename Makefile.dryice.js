/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
var path = require('path');
var fs = require('fs');
var copy = require('dryice').copy;

function buildBrowser() {
  console.log('\nCreating dist/source-map.js');

  var project = copy.createCommonJsProject({
    roots: [ path.join(__dirname, 'lib') ]
  });

  copy({
    source: [
      'build/mini-require.js',
      {
        project: project,
        require: [ 'source-map/source-map-generator',
                   'source-map/source-map-consumer',
                   'source-map/source-node']
      },
      'build/suffix-browser.js'
    ],
    filter: copy.filter.moduleDefines,
    dest: 'dist/source-map.js'
  });
}

function buildBrowserMin() {
  console.log('\nCreating dist/source-map.min.js');

  copy({
    source: 'dist/source-map.js',
    filter: copy.filter.uglifyjs,
    dest: 'dist/source-map.min.js'
  });
}

function buildFirefox() {
  console.log('\nCreating dist/SourceMap.jsm');

  var project = copy.createCommonJsProject({
    roots: [ path.join(__dirname, 'lib') ]
  });

  // Create SourceMapConsumer.jsm
  copy({
    source: [
      'build/prefix-source-map.jsm',
      {
        project: project,
        require: [ 'source-map/source-map-consumer',
                   'source-map/source-map-generator',
                   'source-map/source-node' ]
      },
      'build/suffix-source-map.jsm'
    ],
    filter: copy.filter.moduleDefines,
    dest: 'dist/SourceMap.jsm'
  });

  // TODO: Create TestUtils.jsm

  // TODO: Loop through all the test files and make them built test files.
}

var dirExists = false;
try {
  dirExists = fs.statSync('dist').isDirectory();
} catch (err) {}

if (!dirExists) {
  fs.mkdirSync('dist', 0777);
}

buildFirefox();
buildBrowser();
buildBrowserMin();
