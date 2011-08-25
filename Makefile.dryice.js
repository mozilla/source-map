/* -*- Mode: js; js-indent-level: 2; -*- */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Source Map.
 *
 * The Initial Developer of the Original Code is Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Nick Fitzgerald <nfitzgerald@mozilla.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
var path = require('path');
var fs = require('fs');
var copy = require('dryice').copy;

function buildBrowser() {
  console.log('Creating dist/source-map.js');

  var project = copy.createCommonJsProject({
    roots: [ __dirname ]
  });

  copy({
    source: [
      'build/mini-require.js',
      copy.source.commonjs({
        project: project,
        require: [ 'lib/source-map/source-map-generator',
                   'lib/source-map/source-map-consumer' ]
      }),
      'build/suffix-browser.js'
    ],
    filter: copy.filter.moduleDefines,
    dest: 'dist/source-map.js'
  });
}

function buildBrowserMin() {
  console.log('Creating dist/source-map.min.js');

  copy({
    source: 'dist/source-map.js',
    filter: copy.filter.uglifyjs,
    dest: 'dist/source-map.min.js'
  });
}

function buildFirefox() {
  console.log('Creating dist/source-map-consumer.jsm');

  var project = copy.createCommonJsProject({
    roots: [ __dirname ]
  });

  copy({
    source: [
      'build/prefix-source-map-consumer.jsm',
      'build/mini-require.js',
      copy.source.commonjs({
        project: project,
        require: [ 'lib/source-map/source-map-consumer' ]
      }),
      'build/suffix-source-map-consumer.jsm'
    ],
    filter: copy.filter.moduleDefines,
    dest: 'dist/SourceMapConsumer.jsm'
  });
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
