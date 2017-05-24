function run_test() {
  for (var k in SOURCE_MAP_TEST_MODULE) {
    if (/^test/.test(k)) {
      SOURCE_MAP_TEST_MODULE[k](assert);
    }
  }
}


var SOURCE_MAP_TEST_MODULE =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var libUtil = __webpack_require__(1);
	
	exports['test urls'] = function (assert) {
	  var assertUrl = function (url) {
	    assert.equal(url, libUtil.urlGenerate(libUtil.urlParse(url)));
	  };
	  assertUrl('http://');
	  assertUrl('http://www.example.com');
	  assertUrl('http://user:pass@www.example.com');
	  assertUrl('http://www.example.com:80');
	  assertUrl('http://www.example.com/');
	  assertUrl('http://www.example.com/foo/bar');
	  assertUrl('http://www.example.com/foo/bar/');
	  assertUrl('http://user:pass@www.example.com:80/foo/bar/');
	
	  assertUrl('//');
	  assertUrl('//www.example.com');
	  assertUrl('file:///www.example.com');
	
	  assert.equal(libUtil.urlParse(''), null);
	  assert.equal(libUtil.urlParse('.'), null);
	  assert.equal(libUtil.urlParse('..'), null);
	  assert.equal(libUtil.urlParse('a'), null);
	  assert.equal(libUtil.urlParse('a/b'), null);
	  assert.equal(libUtil.urlParse('a//b'), null);
	  assert.equal(libUtil.urlParse('/a'), null);
	  assert.equal(libUtil.urlParse('data:foo,bar'), null);
	};
	
	exports['test normalize()'] = function (assert) {
	  assert.equal(libUtil.normalize('/..'), '/');
	  assert.equal(libUtil.normalize('/../'), '/');
	  assert.equal(libUtil.normalize('/../../../..'), '/');
	  assert.equal(libUtil.normalize('/../../../../a/b/c'), '/a/b/c');
	  assert.equal(libUtil.normalize('/a/b/c/../../../d/../../e'), '/e');
	
	  assert.equal(libUtil.normalize('..'), '..');
	  assert.equal(libUtil.normalize('../'), '../');
	  assert.equal(libUtil.normalize('../../a/'), '../../a/');
	  assert.equal(libUtil.normalize('a/..'), '.');
	  assert.equal(libUtil.normalize('a/../../..'), '../..');
	
	  assert.equal(libUtil.normalize('/.'), '/');
	  assert.equal(libUtil.normalize('/./'), '/');
	  assert.equal(libUtil.normalize('/./././.'), '/');
	  assert.equal(libUtil.normalize('/././././a/b/c'), '/a/b/c');
	  assert.equal(libUtil.normalize('/a/b/c/./././d/././e'), '/a/b/c/d/e');
	
	  assert.equal(libUtil.normalize(''), '.');
	  assert.equal(libUtil.normalize('.'), '.');
	  assert.equal(libUtil.normalize('./'), '.');
	  assert.equal(libUtil.normalize('././a'), 'a');
	  assert.equal(libUtil.normalize('a/./'), 'a/');
	  assert.equal(libUtil.normalize('a/././.'), 'a');
	
	  assert.equal(libUtil.normalize('/a/b//c////d/////'), '/a/b/c/d/');
	  assert.equal(libUtil.normalize('///a/b//c////d/////'), '///a/b/c/d/');
	  assert.equal(libUtil.normalize('a/b//c////d'), 'a/b/c/d');
	
	  assert.equal(libUtil.normalize('.///.././../a/b//./..'), '../../a')
	
	  assert.equal(libUtil.normalize('http://www.example.com'), 'http://www.example.com');
	  assert.equal(libUtil.normalize('http://www.example.com/'), 'http://www.example.com/');
	  assert.equal(libUtil.normalize('http://www.example.com/./..//a/b/c/.././d//'), 'http://www.example.com/a/b/d/');
	};
	
	exports['test join()'] = function (assert) {
	  assert.equal(libUtil.join('a', 'b'), 'a/b');
	  assert.equal(libUtil.join('a/', 'b'), 'a/b');
	  assert.equal(libUtil.join('a//', 'b'), 'a/b');
	  assert.equal(libUtil.join('a', 'b/'), 'a/b/');
	  assert.equal(libUtil.join('a', 'b//'), 'a/b/');
	  assert.equal(libUtil.join('a/', '/b'), '/b');
	  assert.equal(libUtil.join('a//', '//b'), '//b');
	
	  assert.equal(libUtil.join('a', '..'), '.');
	  assert.equal(libUtil.join('a', '../b'), 'b');
	  assert.equal(libUtil.join('a/b', '../c'), 'a/c');
	
	  assert.equal(libUtil.join('a', '.'), 'a');
	  assert.equal(libUtil.join('a', './b'), 'a/b');
	  assert.equal(libUtil.join('a/b', './c'), 'a/b/c');
	
	  assert.equal(libUtil.join('a', 'http://www.example.com'), 'http://www.example.com');
	  assert.equal(libUtil.join('a', 'data:foo,bar'), 'data:foo,bar');
	
	
	  assert.equal(libUtil.join('', 'b'), 'b');
	  assert.equal(libUtil.join('.', 'b'), 'b');
	  assert.equal(libUtil.join('', 'b/'), 'b/');
	  assert.equal(libUtil.join('.', 'b/'), 'b/');
	  assert.equal(libUtil.join('', 'b//'), 'b/');
	  assert.equal(libUtil.join('.', 'b//'), 'b/');
	
	  assert.equal(libUtil.join('', '..'), '..');
	  assert.equal(libUtil.join('.', '..'), '..');
	  assert.equal(libUtil.join('', '../b'), '../b');
	  assert.equal(libUtil.join('.', '../b'), '../b');
	
	  assert.equal(libUtil.join('', '.'), '.');
	  assert.equal(libUtil.join('.', '.'), '.');
	  assert.equal(libUtil.join('', './b'), 'b');
	  assert.equal(libUtil.join('.', './b'), 'b');
	
	  assert.equal(libUtil.join('', 'http://www.example.com'), 'http://www.example.com');
	  assert.equal(libUtil.join('.', 'http://www.example.com'), 'http://www.example.com');
	  assert.equal(libUtil.join('', 'data:foo,bar'), 'data:foo,bar');
	  assert.equal(libUtil.join('.', 'data:foo,bar'), 'data:foo,bar');
	
	
	  assert.equal(libUtil.join('..', 'b'), '../b');
	  assert.equal(libUtil.join('..', 'b/'), '../b/');
	  assert.equal(libUtil.join('..', 'b//'), '../b/');
	
	  assert.equal(libUtil.join('..', '..'), '../..');
	  assert.equal(libUtil.join('..', '../b'), '../../b');
	
	  assert.equal(libUtil.join('..', '.'), '..');
	  assert.equal(libUtil.join('..', './b'), '../b');
	
	  assert.equal(libUtil.join('..', 'http://www.example.com'), 'http://www.example.com');
	  assert.equal(libUtil.join('..', 'data:foo,bar'), 'data:foo,bar');
	
	
	  assert.equal(libUtil.join('a', ''), 'a');
	  assert.equal(libUtil.join('a', '.'), 'a');
	  assert.equal(libUtil.join('a/', ''), 'a');
	  assert.equal(libUtil.join('a/', '.'), 'a');
	  assert.equal(libUtil.join('a//', ''), 'a');
	  assert.equal(libUtil.join('a//', '.'), 'a');
	  assert.equal(libUtil.join('/a', ''), '/a');
	  assert.equal(libUtil.join('/a', '.'), '/a');
	  assert.equal(libUtil.join('', ''), '.');
	  assert.equal(libUtil.join('.', ''), '.');
	  assert.equal(libUtil.join('.', ''), '.');
	  assert.equal(libUtil.join('.', '.'), '.');
	  assert.equal(libUtil.join('..', ''), '..');
	  assert.equal(libUtil.join('..', '.'), '..');
	  assert.equal(libUtil.join('http://foo.org/a', ''), 'http://foo.org/a');
	  assert.equal(libUtil.join('http://foo.org/a', '.'), 'http://foo.org/a');
	  assert.equal(libUtil.join('http://foo.org/a/', ''), 'http://foo.org/a');
	  assert.equal(libUtil.join('http://foo.org/a/', '.'), 'http://foo.org/a');
	  assert.equal(libUtil.join('http://foo.org/a//', ''), 'http://foo.org/a');
	  assert.equal(libUtil.join('http://foo.org/a//', '.'), 'http://foo.org/a');
	  assert.equal(libUtil.join('http://foo.org', ''), 'http://foo.org/');
	  assert.equal(libUtil.join('http://foo.org', '.'), 'http://foo.org/');
	  assert.equal(libUtil.join('http://foo.org/', ''), 'http://foo.org/');
	  assert.equal(libUtil.join('http://foo.org/', '.'), 'http://foo.org/');
	  assert.equal(libUtil.join('http://foo.org//', ''), 'http://foo.org/');
	  assert.equal(libUtil.join('http://foo.org//', '.'), 'http://foo.org/');
	  assert.equal(libUtil.join('//www.example.com', ''), '//www.example.com/');
	  assert.equal(libUtil.join('//www.example.com', '.'), '//www.example.com/');
	
	
	  assert.equal(libUtil.join('http://foo.org/a', 'b'), 'http://foo.org/a/b');
	  assert.equal(libUtil.join('http://foo.org/a/', 'b'), 'http://foo.org/a/b');
	  assert.equal(libUtil.join('http://foo.org/a//', 'b'), 'http://foo.org/a/b');
	  assert.equal(libUtil.join('http://foo.org/a', 'b/'), 'http://foo.org/a/b/');
	  assert.equal(libUtil.join('http://foo.org/a', 'b//'), 'http://foo.org/a/b/');
	  assert.equal(libUtil.join('http://foo.org/a/', '/b'), 'http://foo.org/b');
	  assert.equal(libUtil.join('http://foo.org/a//', '//b'), 'http://b');
	
	  assert.equal(libUtil.join('http://foo.org/a', '..'), 'http://foo.org/');
	  assert.equal(libUtil.join('http://foo.org/a', '../b'), 'http://foo.org/b');
	  assert.equal(libUtil.join('http://foo.org/a/b', '../c'), 'http://foo.org/a/c');
	
	  assert.equal(libUtil.join('http://foo.org/a', '.'), 'http://foo.org/a');
	  assert.equal(libUtil.join('http://foo.org/a', './b'), 'http://foo.org/a/b');
	  assert.equal(libUtil.join('http://foo.org/a/b', './c'), 'http://foo.org/a/b/c');
	
	  assert.equal(libUtil.join('http://foo.org/a', 'http://www.example.com'), 'http://www.example.com');
	  assert.equal(libUtil.join('http://foo.org/a', 'data:foo,bar'), 'data:foo,bar');
	
	
	  assert.equal(libUtil.join('http://foo.org', 'a'), 'http://foo.org/a');
	  assert.equal(libUtil.join('http://foo.org/', 'a'), 'http://foo.org/a');
	  assert.equal(libUtil.join('http://foo.org//', 'a'), 'http://foo.org/a');
	  assert.equal(libUtil.join('http://foo.org', '/a'), 'http://foo.org/a');
	  assert.equal(libUtil.join('http://foo.org/', '/a'), 'http://foo.org/a');
	  assert.equal(libUtil.join('http://foo.org//', '/a'), 'http://foo.org/a');
	
	
	  assert.equal(libUtil.join('http://', 'www.example.com'), 'http://www.example.com');
	  assert.equal(libUtil.join('file:///', 'www.example.com'), 'file:///www.example.com');
	  assert.equal(libUtil.join('http://', 'ftp://example.com'), 'ftp://example.com');
	
	  assert.equal(libUtil.join('http://www.example.com', '//foo.org/bar'), 'http://foo.org/bar');
	  assert.equal(libUtil.join('//www.example.com', '//foo.org/bar'), '//foo.org/bar');
	};
	
	// TODO Issue #128: Define and test this function properly.
	exports['test relative()'] = function (assert) {
	  assert.equal(libUtil.relative('/the/root', '/the/root/one.js'), 'one.js');
	  assert.equal(libUtil.relative('http://the/root', 'http://the/root/one.js'), 'one.js');
	  assert.equal(libUtil.relative('/the/root', '/the/rootone.js'), '../rootone.js');
	  assert.equal(libUtil.relative('http://the/root', 'http://the/rootone.js'), '../rootone.js');
	  assert.equal(libUtil.relative('/the/root', '/therootone.js'), '/therootone.js');
	  assert.equal(libUtil.relative('http://the/root', '/therootone.js'), '/therootone.js');
	
	  assert.equal(libUtil.relative('', '/the/root/one.js'), '/the/root/one.js');
	  assert.equal(libUtil.relative('.', '/the/root/one.js'), '/the/root/one.js');
	  assert.equal(libUtil.relative('', 'the/root/one.js'), 'the/root/one.js');
	  assert.equal(libUtil.relative('.', 'the/root/one.js'), 'the/root/one.js');
	
	  assert.equal(libUtil.relative('/', '/the/root/one.js'), 'the/root/one.js');
	  assert.equal(libUtil.relative('/', 'the/root/one.js'), 'the/root/one.js');
	};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	/**
	 * This is a helper function for getting values from parameter/options
	 * objects.
	 *
	 * @param args The object we are extracting values from
	 * @param name The name of the property we are getting.
	 * @param defaultValue An optional value to return if the property is missing
	 * from the object. If this is not specified and the property is missing, an
	 * error will be thrown.
	 */
	function getArg(aArgs, aName, aDefaultValue) {
	  if (aName in aArgs) {
	    return aArgs[aName];
	  } else if (arguments.length === 3) {
	    return aDefaultValue;
	  } else {
	    throw new Error('"' + aName + '" is a required argument.');
	  }
	}
	exports.getArg = getArg;
	
	var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
	var dataUrlRegexp = /^data:.+\,.+$/;
	
	function urlParse(aUrl) {
	  var match = aUrl.match(urlRegexp);
	  if (!match) {
	    return null;
	  }
	  return {
	    scheme: match[1],
	    auth: match[2],
	    host: match[3],
	    port: match[4],
	    path: match[5]
	  };
	}
	exports.urlParse = urlParse;
	
	function urlGenerate(aParsedUrl) {
	  var url = '';
	  if (aParsedUrl.scheme) {
	    url += aParsedUrl.scheme + ':';
	  }
	  url += '//';
	  if (aParsedUrl.auth) {
	    url += aParsedUrl.auth + '@';
	  }
	  if (aParsedUrl.host) {
	    url += aParsedUrl.host;
	  }
	  if (aParsedUrl.port) {
	    url += ":" + aParsedUrl.port
	  }
	  if (aParsedUrl.path) {
	    url += aParsedUrl.path;
	  }
	  return url;
	}
	exports.urlGenerate = urlGenerate;
	
	/**
	 * Normalizes a path, or the path portion of a URL:
	 *
	 * - Replaces consecutive slashes with one slash.
	 * - Removes unnecessary '.' parts.
	 * - Removes unnecessary '<dir>/..' parts.
	 *
	 * Based on code in the Node.js 'path' core module.
	 *
	 * @param aPath The path or url to normalize.
	 */
	function normalize(aPath) {
	  var path = aPath;
	  var url = urlParse(aPath);
	  if (url) {
	    if (!url.path) {
	      return aPath;
	    }
	    path = url.path;
	  }
	  var isAbsolute = exports.isAbsolute(path);
	
	  var parts = path.split(/\/+/);
	  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
	    part = parts[i];
	    if (part === '.') {
	      parts.splice(i, 1);
	    } else if (part === '..') {
	      up++;
	    } else if (up > 0) {
	      if (part === '') {
	        // The first part is blank if the path is absolute. Trying to go
	        // above the root is a no-op. Therefore we can remove all '..' parts
	        // directly after the root.
	        parts.splice(i + 1, up);
	        up = 0;
	      } else {
	        parts.splice(i, 2);
	        up--;
	      }
	    }
	  }
	  path = parts.join('/');
	
	  if (path === '') {
	    path = isAbsolute ? '/' : '.';
	  }
	
	  if (url) {
	    url.path = path;
	    return urlGenerate(url);
	  }
	  return path;
	}
	exports.normalize = normalize;
	
	/**
	 * Joins two paths/URLs.
	 *
	 * @param aRoot The root path or URL.
	 * @param aPath The path or URL to be joined with the root.
	 *
	 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
	 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
	 *   first.
	 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
	 *   is updated with the result and aRoot is returned. Otherwise the result
	 *   is returned.
	 *   - If aPath is absolute, the result is aPath.
	 *   - Otherwise the two paths are joined with a slash.
	 * - Joining for example 'http://' and 'www.example.com' is also supported.
	 */
	function join(aRoot, aPath) {
	  if (aRoot === "") {
	    aRoot = ".";
	  }
	  if (aPath === "") {
	    aPath = ".";
	  }
	  var aPathUrl = urlParse(aPath);
	  var aRootUrl = urlParse(aRoot);
	  if (aRootUrl) {
	    aRoot = aRootUrl.path || '/';
	  }
	
	  // `join(foo, '//www.example.org')`
	  if (aPathUrl && !aPathUrl.scheme) {
	    if (aRootUrl) {
	      aPathUrl.scheme = aRootUrl.scheme;
	    }
	    return urlGenerate(aPathUrl);
	  }
	
	  if (aPathUrl || aPath.match(dataUrlRegexp)) {
	    return aPath;
	  }
	
	  // `join('http://', 'www.example.com')`
	  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
	    aRootUrl.host = aPath;
	    return urlGenerate(aRootUrl);
	  }
	
	  var joined = aPath.charAt(0) === '/'
	    ? aPath
	    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);
	
	  if (aRootUrl) {
	    aRootUrl.path = joined;
	    return urlGenerate(aRootUrl);
	  }
	  return joined;
	}
	exports.join = join;
	
	exports.isAbsolute = function (aPath) {
	  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
	};
	
	/**
	 * Make a path relative to a URL or another path.
	 *
	 * @param aRoot The root path or URL.
	 * @param aPath The path or URL to be made relative to aRoot.
	 */
	function relative(aRoot, aPath) {
	  if (aRoot === "") {
	    aRoot = ".";
	  }
	
	  aRoot = aRoot.replace(/\/$/, '');
	
	  // It is possible for the path to be above the root. In this case, simply
	  // checking whether the root is a prefix of the path won't work. Instead, we
	  // need to remove components from the root one by one, until either we find
	  // a prefix that fits, or we run out of components to remove.
	  var level = 0;
	  while (aPath.indexOf(aRoot + '/') !== 0) {
	    var index = aRoot.lastIndexOf("/");
	    if (index < 0) {
	      return aPath;
	    }
	
	    // If the only part of the root that is left is the scheme (i.e. http://,
	    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
	    // have exhausted all components, so the path is not relative to the root.
	    aRoot = aRoot.slice(0, index);
	    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
	      return aPath;
	    }
	
	    ++level;
	  }
	
	  // Make sure we add a "../" for each component we removed from the root.
	  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
	}
	exports.relative = relative;
	
	var supportsNullProto = (function () {
	  var obj = Object.create(null);
	  return !('__proto__' in obj);
	}());
	
	function identity (s) {
	  return s;
	}
	
	/**
	 * Because behavior goes wacky when you set `__proto__` on objects, we
	 * have to prefix all the strings in our set with an arbitrary character.
	 *
	 * See https://github.com/mozilla/source-map/pull/31 and
	 * https://github.com/mozilla/source-map/issues/30
	 *
	 * @param String aStr
	 */
	function toSetString(aStr) {
	  if (isProtoString(aStr)) {
	    return '$' + aStr;
	  }
	
	  return aStr;
	}
	exports.toSetString = supportsNullProto ? identity : toSetString;
	
	function fromSetString(aStr) {
	  if (isProtoString(aStr)) {
	    return aStr.slice(1);
	  }
	
	  return aStr;
	}
	exports.fromSetString = supportsNullProto ? identity : fromSetString;
	
	function isProtoString(s) {
	  if (!s) {
	    return false;
	  }
	
	  var length = s.length;
	
	  if (length < 9 /* "__proto__".length */) {
	    return false;
	  }
	
	  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
	      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
	      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
	      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
	      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
	      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 9) !== 95  /* '_' */) {
	    return false;
	  }
	
	  for (var i = length - 10; i >= 0; i--) {
	    if (s.charCodeAt(i) !== 36 /* '$' */) {
	      return false;
	    }
	  }
	
	  return true;
	}
	
	/**
	 * Comparator between two mappings where the original positions are compared.
	 *
	 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	 * mappings with the same original source/line/column, but different generated
	 * line and column the same. Useful when searching for a mapping with a
	 * stubbed out mapping.
	 */
	function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
	  var cmp = mappingA.source - mappingB.source;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0 || onlyCompareOriginal) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return mappingA.name - mappingB.name;
	}
	exports.compareByOriginalPositions = compareByOriginalPositions;
	
	/**
	 * Comparator between two mappings with deflated source and name indices where
	 * the generated positions are compared.
	 *
	 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	 * mappings with the same generated line and column, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }
	
	  cmp = mappingA.source - mappingB.source;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return mappingA.name - mappingB.name;
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 > aStr2) {
	    return 1;
	  }
	
	  return -1;
	}
	
	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGU4Mjc2OTE5NTRkYTg5MDNjZTQiLCJ3ZWJwYWNrOi8vLy4vdGVzdC90ZXN0LXV0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNyTkEsaUJBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsK0NBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUEyQixRQUFRO0FBQ25DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoidGVzdF91dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZGU4Mjc2OTE5NTRkYTg5MDNjZTQiLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTQgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciBsaWJVdGlsID0gcmVxdWlyZSgnLi4vbGliL3V0aWwnKTtcblxuZXhwb3J0c1sndGVzdCB1cmxzJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBhc3NlcnRVcmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgYXNzZXJ0LmVxdWFsKHVybCwgbGliVXRpbC51cmxHZW5lcmF0ZShsaWJVdGlsLnVybFBhcnNlKHVybCkpKTtcbiAgfTtcbiAgYXNzZXJ0VXJsKCdodHRwOi8vJyk7XG4gIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpO1xuICBhc3NlcnRVcmwoJ2h0dHA6Ly91c2VyOnBhc3NAd3d3LmV4YW1wbGUuY29tJyk7XG4gIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbTo4MCcpO1xuICBhc3NlcnRVcmwoJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20vJyk7XG4gIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbS9mb28vYmFyJyk7XG4gIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbS9mb28vYmFyLycpO1xuICBhc3NlcnRVcmwoJ2h0dHA6Ly91c2VyOnBhc3NAd3d3LmV4YW1wbGUuY29tOjgwL2Zvby9iYXIvJyk7XG5cbiAgYXNzZXJ0VXJsKCcvLycpO1xuICBhc3NlcnRVcmwoJy8vd3d3LmV4YW1wbGUuY29tJyk7XG4gIGFzc2VydFVybCgnZmlsZTovLy93d3cuZXhhbXBsZS5jb20nKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnJyksIG51bGwpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnLicpLCBudWxsKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJy4uJyksIG51bGwpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnYScpLCBudWxsKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2EvYicpLCBudWxsKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2EvL2InKSwgbnVsbCk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnVybFBhcnNlKCcvYScpLCBudWxsKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2RhdGE6Zm9vLGJhcicpLCBudWxsKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3Qgbm9ybWFsaXplKCknXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLi4nKSwgJy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLi4vJyksICcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4uLy4uLy4uLy4uJyksICcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4uLy4uLy4uLy4uL2EvYi9jJyksICcvYS9iL2MnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvYS9iL2MvLi4vLi4vLi4vZC8uLi8uLi9lJyksICcvZScpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLi4nKSwgJy4uJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLi4vJyksICcuLi8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcuLi8uLi9hLycpLCAnLi4vLi4vYS8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdhLy4uJyksICcuJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnYS8uLi8uLi8uLicpLCAnLi4vLi4nKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uJyksICcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4vJyksICcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4vLi8uLy4nKSwgJy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLi8uLy4vLi9hL2IvYycpLCAnL2EvYi9jJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnL2EvYi9jLy4vLi8uL2QvLi8uL2UnKSwgJy9hL2IvYy9kL2UnKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJycpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4nKSwgJy4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcuLycpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4vLi9hJyksICdhJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnYS8uLycpLCAnYS8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdhLy4vLi8uJyksICdhJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvYS9iLy9jLy8vL2QvLy8vLycpLCAnL2EvYi9jL2QvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy8vYS9iLy9jLy8vL2QvLy8vLycpLCAnLy8vYS9iL2MvZC8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdhL2IvL2MvLy8vZCcpLCAnYS9iL2MvZCcpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLi8vLy4uLy4vLi4vYS9iLy8uLy4uJyksICcuLi8uLi9hJylcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdodHRwOi8vd3d3LmV4YW1wbGUuY29tLycpLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbS8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdodHRwOi8vd3d3LmV4YW1wbGUuY29tLy4vLi4vL2EvYi9jLy4uLy4vZC8vJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tL2EvYi9kLycpO1xufTtcblxuZXhwb3J0c1sndGVzdCBqb2luKCknXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICdiJyksICdhL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8nLCAnYicpLCAnYS9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvLycsICdiJyksICdhL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICdiLycpLCAnYS9iLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJ2IvLycpLCAnYS9iLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhLycsICcvYicpLCAnL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8vJywgJy8vYicpLCAnLy9iJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICcuLicpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJy4uL2InKSwgJ2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS9iJywgJy4uL2MnKSwgJ2EvYycpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnLicpLCAnYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJy4vYicpLCAnYS9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvYicsICcuL2MnKSwgJ2EvYi9jJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnZGF0YTpmb28sYmFyJyksICdkYXRhOmZvbyxiYXInKTtcblxuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICdiJyksICdiJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnYicpLCAnYicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnYi8nKSwgJ2IvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnYi8nKSwgJ2IvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICdiLy8nKSwgJ2IvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnYi8vJyksICdiLycpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICcuLicpLCAnLi4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuLicpLCAnLi4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJy4uL2InKSwgJy4uL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuLi9iJyksICcuLi9iJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJy4nKSwgJy4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuJyksICcuJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICcuL2InKSwgJ2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuL2InKSwgJ2InKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJ2RhdGE6Zm9vLGJhcicpLCAnZGF0YTpmb28sYmFyJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnZGF0YTpmb28sYmFyJyksICdkYXRhOmZvbyxiYXInKTtcblxuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJ2InKSwgJy4uL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnYi8nKSwgJy4uL2IvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJ2IvLycpLCAnLi4vYi8nKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICcuLicpLCAnLi4vLi4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnLi4vYicpLCAnLi4vLi4vYicpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJy4nKSwgJy4uJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJy4vYicpLCAnLi4vYicpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnZGF0YTpmb28sYmFyJyksICdkYXRhOmZvbyxiYXInKTtcblxuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnJyksICdhJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnLicpLCAnYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhLycsICcnKSwgJ2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8nLCAnLicpLCAnYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhLy8nLCAnJyksICdhJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvLycsICcuJyksICdhJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy9hJywgJycpLCAnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignL2EnLCAnLicpLCAnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJycpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJycpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJycpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJy4nKSwgJy4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnJyksICcuLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICcuJyksICcuLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJycpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJy4nKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8nLCAnJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvJywgJy4nKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8vJywgJycpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hLy8nLCAnLicpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZycsICcnKSwgJ2h0dHA6Ly9mb28ub3JnLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZycsICcuJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvJywgJycpLCAnaHR0cDovL2Zvby5vcmcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLycsICcuJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvLycsICcnKSwgJ2h0dHA6Ly9mb28ub3JnLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy8vJywgJy4nKSwgJ2h0dHA6Ly9mb28ub3JnLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcvL3d3dy5leGFtcGxlLmNvbScsICcnKSwgJy8vd3d3LmV4YW1wbGUuY29tLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcvL3d3dy5leGFtcGxlLmNvbScsICcuJyksICcvL3d3dy5leGFtcGxlLmNvbS8nKTtcblxuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnYicpLCAnaHR0cDovL2Zvby5vcmcvYS9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvJywgJ2InKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hLy8nLCAnYicpLCAnaHR0cDovL2Zvby5vcmcvYS9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnYi8nKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYi8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICdiLy8nKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYi8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8nLCAnL2InKSwgJ2h0dHA6Ly9mb28ub3JnL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8vJywgJy8vYicpLCAnaHR0cDovL2InKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJy4uJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcuLi9iJyksICdodHRwOi8vZm9vLm9yZy9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvYicsICcuLi9jJyksICdodHRwOi8vZm9vLm9yZy9hL2MnKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJy4nKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcuL2InKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hL2InLCAnLi9jJyksICdodHRwOi8vZm9vLm9yZy9hL2IvYycpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJ2RhdGE6Zm9vLGJhcicpLCAnZGF0YTpmb28sYmFyJyk7XG5cblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZycsICdhJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLycsICdhJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLy8nLCAnYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZycsICcvYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy8nLCAnL2EnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvLycsICcvYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuXG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovLycsICd3d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignZmlsZTovLy8nLCAnd3d3LmV4YW1wbGUuY29tJyksICdmaWxlOi8vL3d3dy5leGFtcGxlLmNvbScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vJywgJ2Z0cDovL2V4YW1wbGUuY29tJyksICdmdHA6Ly9leGFtcGxlLmNvbScpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nLCAnLy9mb28ub3JnL2JhcicpLCAnaHR0cDovL2Zvby5vcmcvYmFyJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy8vd3d3LmV4YW1wbGUuY29tJywgJy8vZm9vLm9yZy9iYXInKSwgJy8vZm9vLm9yZy9iYXInKTtcbn07XG5cbi8vIFRPRE8gSXNzdWUgIzEyODogRGVmaW5lIGFuZCB0ZXN0IHRoaXMgZnVuY3Rpb24gcHJvcGVybHkuXG5leHBvcnRzWyd0ZXN0IHJlbGF0aXZlKCknXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy90aGUvcm9vdCcsICcvdGhlL3Jvb3Qvb25lLmpzJyksICdvbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJ2h0dHA6Ly90aGUvcm9vdCcsICdodHRwOi8vdGhlL3Jvb3Qvb25lLmpzJyksICdvbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy90aGUvcm9vdCcsICcvdGhlL3Jvb3RvbmUuanMnKSwgJy4uL3Jvb3RvbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJ2h0dHA6Ly90aGUvcm9vdCcsICdodHRwOi8vdGhlL3Jvb3RvbmUuanMnKSwgJy4uL3Jvb3RvbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy90aGUvcm9vdCcsICcvdGhlcm9vdG9uZS5qcycpLCAnL3RoZXJvb3RvbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJ2h0dHA6Ly90aGUvcm9vdCcsICcvdGhlcm9vdG9uZS5qcycpLCAnL3RoZXJvb3RvbmUuanMnKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnJywgJy90aGUvcm9vdC9vbmUuanMnKSwgJy90aGUvcm9vdC9vbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy4nLCAnL3RoZS9yb290L29uZS5qcycpLCAnL3RoZS9yb290L29uZS5qcycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnJywgJ3RoZS9yb290L29uZS5qcycpLCAndGhlL3Jvb3Qvb25lLmpzJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcuJywgJ3RoZS9yb290L29uZS5qcycpLCAndGhlL3Jvb3Qvb25lLmpzJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy8nLCAnL3RoZS9yb290L29uZS5qcycpLCAndGhlL3Jvb3Qvb25lLmpzJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcvJywgJ3RoZS9yb290L29uZS5qcycpLCAndGhlL3Jvb3Qvb25lLmpzJyk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90ZXN0L3Rlc3QtdXRpbC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbi8qKlxuICogVGhpcyBpcyBhIGhlbHBlciBmdW5jdGlvbiBmb3IgZ2V0dGluZyB2YWx1ZXMgZnJvbSBwYXJhbWV0ZXIvb3B0aW9uc1xuICogb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0gYXJncyBUaGUgb2JqZWN0IHdlIGFyZSBleHRyYWN0aW5nIHZhbHVlcyBmcm9tXG4gKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgd2UgYXJlIGdldHRpbmcuXG4gKiBAcGFyYW0gZGVmYXVsdFZhbHVlIEFuIG9wdGlvbmFsIHZhbHVlIHRvIHJldHVybiBpZiB0aGUgcHJvcGVydHkgaXMgbWlzc2luZ1xuICogZnJvbSB0aGUgb2JqZWN0LiBJZiB0aGlzIGlzIG5vdCBzcGVjaWZpZWQgYW5kIHRoZSBwcm9wZXJ0eSBpcyBtaXNzaW5nLCBhblxuICogZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gKi9cbmZ1bmN0aW9uIGdldEFyZyhhQXJncywgYU5hbWUsIGFEZWZhdWx0VmFsdWUpIHtcbiAgaWYgKGFOYW1lIGluIGFBcmdzKSB7XG4gICAgcmV0dXJuIGFBcmdzW2FOYW1lXTtcbiAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgcmV0dXJuIGFEZWZhdWx0VmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBhTmFtZSArICdcIiBpcyBhIHJlcXVpcmVkIGFyZ3VtZW50LicpO1xuICB9XG59XG5leHBvcnRzLmdldEFyZyA9IGdldEFyZztcblxudmFyIHVybFJlZ2V4cCA9IC9eKD86KFtcXHcrXFwtLl0rKTopP1xcL1xcLyg/OihcXHcrOlxcdyspQCk/KFtcXHcuXSopKD86OihcXGQrKSk/KFxcUyopJC87XG52YXIgZGF0YVVybFJlZ2V4cCA9IC9eZGF0YTouK1xcLC4rJC87XG5cbmZ1bmN0aW9uIHVybFBhcnNlKGFVcmwpIHtcbiAgdmFyIG1hdGNoID0gYVVybC5tYXRjaCh1cmxSZWdleHApO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBzY2hlbWU6IG1hdGNoWzFdLFxuICAgIGF1dGg6IG1hdGNoWzJdLFxuICAgIGhvc3Q6IG1hdGNoWzNdLFxuICAgIHBvcnQ6IG1hdGNoWzRdLFxuICAgIHBhdGg6IG1hdGNoWzVdXG4gIH07XG59XG5leHBvcnRzLnVybFBhcnNlID0gdXJsUGFyc2U7XG5cbmZ1bmN0aW9uIHVybEdlbmVyYXRlKGFQYXJzZWRVcmwpIHtcbiAgdmFyIHVybCA9ICcnO1xuICBpZiAoYVBhcnNlZFVybC5zY2hlbWUpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5zY2hlbWUgKyAnOic7XG4gIH1cbiAgdXJsICs9ICcvLyc7XG4gIGlmIChhUGFyc2VkVXJsLmF1dGgpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5hdXRoICsgJ0AnO1xuICB9XG4gIGlmIChhUGFyc2VkVXJsLmhvc3QpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5ob3N0O1xuICB9XG4gIGlmIChhUGFyc2VkVXJsLnBvcnQpIHtcbiAgICB1cmwgKz0gXCI6XCIgKyBhUGFyc2VkVXJsLnBvcnRcbiAgfVxuICBpZiAoYVBhcnNlZFVybC5wYXRoKSB7XG4gICAgdXJsICs9IGFQYXJzZWRVcmwucGF0aDtcbiAgfVxuICByZXR1cm4gdXJsO1xufVxuZXhwb3J0cy51cmxHZW5lcmF0ZSA9IHVybEdlbmVyYXRlO1xuXG4vKipcbiAqIE5vcm1hbGl6ZXMgYSBwYXRoLCBvciB0aGUgcGF0aCBwb3J0aW9uIG9mIGEgVVJMOlxuICpcbiAqIC0gUmVwbGFjZXMgY29uc2VjdXRpdmUgc2xhc2hlcyB3aXRoIG9uZSBzbGFzaC5cbiAqIC0gUmVtb3ZlcyB1bm5lY2Vzc2FyeSAnLicgcGFydHMuXG4gKiAtIFJlbW92ZXMgdW5uZWNlc3NhcnkgJzxkaXI+Ly4uJyBwYXJ0cy5cbiAqXG4gKiBCYXNlZCBvbiBjb2RlIGluIHRoZSBOb2RlLmpzICdwYXRoJyBjb3JlIG1vZHVsZS5cbiAqXG4gKiBAcGFyYW0gYVBhdGggVGhlIHBhdGggb3IgdXJsIHRvIG5vcm1hbGl6ZS5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplKGFQYXRoKSB7XG4gIHZhciBwYXRoID0gYVBhdGg7XG4gIHZhciB1cmwgPSB1cmxQYXJzZShhUGF0aCk7XG4gIGlmICh1cmwpIHtcbiAgICBpZiAoIXVybC5wYXRoKSB7XG4gICAgICByZXR1cm4gYVBhdGg7XG4gICAgfVxuICAgIHBhdGggPSB1cmwucGF0aDtcbiAgfVxuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKTtcblxuICB2YXIgcGFydHMgPSBwYXRoLnNwbGl0KC9cXC8rLyk7XG4gIGZvciAodmFyIHBhcnQsIHVwID0gMCwgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgcGFydCA9IHBhcnRzW2ldO1xuICAgIGlmIChwYXJ0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKHBhcnQgPT09ICcuLicpIHtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCA+IDApIHtcbiAgICAgIGlmIChwYXJ0ID09PSAnJykge1xuICAgICAgICAvLyBUaGUgZmlyc3QgcGFydCBpcyBibGFuayBpZiB0aGUgcGF0aCBpcyBhYnNvbHV0ZS4gVHJ5aW5nIHRvIGdvXG4gICAgICAgIC8vIGFib3ZlIHRoZSByb290IGlzIGEgbm8tb3AuIFRoZXJlZm9yZSB3ZSBjYW4gcmVtb3ZlIGFsbCAnLi4nIHBhcnRzXG4gICAgICAgIC8vIGRpcmVjdGx5IGFmdGVyIHRoZSByb290LlxuICAgICAgICBwYXJ0cy5zcGxpY2UoaSArIDEsIHVwKTtcbiAgICAgICAgdXAgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFydHMuc3BsaWNlKGksIDIpO1xuICAgICAgICB1cC0tO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBwYXRoID0gcGFydHMuam9pbignLycpO1xuXG4gIGlmIChwYXRoID09PSAnJykge1xuICAgIHBhdGggPSBpc0Fic29sdXRlID8gJy8nIDogJy4nO1xuICB9XG5cbiAgaWYgKHVybCkge1xuICAgIHVybC5wYXRoID0gcGF0aDtcbiAgICByZXR1cm4gdXJsR2VuZXJhdGUodXJsKTtcbiAgfVxuICByZXR1cm4gcGF0aDtcbn1cbmV4cG9ydHMubm9ybWFsaXplID0gbm9ybWFsaXplO1xuXG4vKipcbiAqIEpvaW5zIHR3byBwYXRocy9VUkxzLlxuICpcbiAqIEBwYXJhbSBhUm9vdCBUaGUgcm9vdCBwYXRoIG9yIFVSTC5cbiAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciBVUkwgdG8gYmUgam9pbmVkIHdpdGggdGhlIHJvb3QuXG4gKlxuICogLSBJZiBhUGF0aCBpcyBhIFVSTCBvciBhIGRhdGEgVVJJLCBhUGF0aCBpcyByZXR1cm5lZCwgdW5sZXNzIGFQYXRoIGlzIGFcbiAqICAgc2NoZW1lLXJlbGF0aXZlIFVSTDogVGhlbiB0aGUgc2NoZW1lIG9mIGFSb290LCBpZiBhbnksIGlzIHByZXBlbmRlZFxuICogICBmaXJzdC5cbiAqIC0gT3RoZXJ3aXNlIGFQYXRoIGlzIGEgcGF0aC4gSWYgYVJvb3QgaXMgYSBVUkwsIHRoZW4gaXRzIHBhdGggcG9ydGlvblxuICogICBpcyB1cGRhdGVkIHdpdGggdGhlIHJlc3VsdCBhbmQgYVJvb3QgaXMgcmV0dXJuZWQuIE90aGVyd2lzZSB0aGUgcmVzdWx0XG4gKiAgIGlzIHJldHVybmVkLlxuICogICAtIElmIGFQYXRoIGlzIGFic29sdXRlLCB0aGUgcmVzdWx0IGlzIGFQYXRoLlxuICogICAtIE90aGVyd2lzZSB0aGUgdHdvIHBhdGhzIGFyZSBqb2luZWQgd2l0aCBhIHNsYXNoLlxuICogLSBKb2luaW5nIGZvciBleGFtcGxlICdodHRwOi8vJyBhbmQgJ3d3dy5leGFtcGxlLmNvbScgaXMgYWxzbyBzdXBwb3J0ZWQuXG4gKi9cbmZ1bmN0aW9uIGpvaW4oYVJvb3QsIGFQYXRoKSB7XG4gIGlmIChhUm9vdCA9PT0gXCJcIikge1xuICAgIGFSb290ID0gXCIuXCI7XG4gIH1cbiAgaWYgKGFQYXRoID09PSBcIlwiKSB7XG4gICAgYVBhdGggPSBcIi5cIjtcbiAgfVxuICB2YXIgYVBhdGhVcmwgPSB1cmxQYXJzZShhUGF0aCk7XG4gIHZhciBhUm9vdFVybCA9IHVybFBhcnNlKGFSb290KTtcbiAgaWYgKGFSb290VXJsKSB7XG4gICAgYVJvb3QgPSBhUm9vdFVybC5wYXRoIHx8ICcvJztcbiAgfVxuXG4gIC8vIGBqb2luKGZvbywgJy8vd3d3LmV4YW1wbGUub3JnJylgXG4gIGlmIChhUGF0aFVybCAmJiAhYVBhdGhVcmwuc2NoZW1lKSB7XG4gICAgaWYgKGFSb290VXJsKSB7XG4gICAgICBhUGF0aFVybC5zY2hlbWUgPSBhUm9vdFVybC5zY2hlbWU7XG4gICAgfVxuICAgIHJldHVybiB1cmxHZW5lcmF0ZShhUGF0aFVybCk7XG4gIH1cblxuICBpZiAoYVBhdGhVcmwgfHwgYVBhdGgubWF0Y2goZGF0YVVybFJlZ2V4cCkpIHtcbiAgICByZXR1cm4gYVBhdGg7XG4gIH1cblxuICAvLyBgam9pbignaHR0cDovLycsICd3d3cuZXhhbXBsZS5jb20nKWBcbiAgaWYgKGFSb290VXJsICYmICFhUm9vdFVybC5ob3N0ICYmICFhUm9vdFVybC5wYXRoKSB7XG4gICAgYVJvb3RVcmwuaG9zdCA9IGFQYXRoO1xuICAgIHJldHVybiB1cmxHZW5lcmF0ZShhUm9vdFVybCk7XG4gIH1cblxuICB2YXIgam9pbmVkID0gYVBhdGguY2hhckF0KDApID09PSAnLydcbiAgICA/IGFQYXRoXG4gICAgOiBub3JtYWxpemUoYVJvb3QucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyBhUGF0aCk7XG5cbiAgaWYgKGFSb290VXJsKSB7XG4gICAgYVJvb3RVcmwucGF0aCA9IGpvaW5lZDtcbiAgICByZXR1cm4gdXJsR2VuZXJhdGUoYVJvb3RVcmwpO1xuICB9XG4gIHJldHVybiBqb2luZWQ7XG59XG5leHBvcnRzLmpvaW4gPSBqb2luO1xuXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbiAoYVBhdGgpIHtcbiAgcmV0dXJuIGFQYXRoLmNoYXJBdCgwKSA9PT0gJy8nIHx8ICEhYVBhdGgubWF0Y2godXJsUmVnZXhwKTtcbn07XG5cbi8qKlxuICogTWFrZSBhIHBhdGggcmVsYXRpdmUgdG8gYSBVUkwgb3IgYW5vdGhlciBwYXRoLlxuICpcbiAqIEBwYXJhbSBhUm9vdCBUaGUgcm9vdCBwYXRoIG9yIFVSTC5cbiAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciBVUkwgdG8gYmUgbWFkZSByZWxhdGl2ZSB0byBhUm9vdC5cbiAqL1xuZnVuY3Rpb24gcmVsYXRpdmUoYVJvb3QsIGFQYXRoKSB7XG4gIGlmIChhUm9vdCA9PT0gXCJcIikge1xuICAgIGFSb290ID0gXCIuXCI7XG4gIH1cblxuICBhUm9vdCA9IGFSb290LnJlcGxhY2UoL1xcLyQvLCAnJyk7XG5cbiAgLy8gSXQgaXMgcG9zc2libGUgZm9yIHRoZSBwYXRoIHRvIGJlIGFib3ZlIHRoZSByb290LiBJbiB0aGlzIGNhc2UsIHNpbXBseVxuICAvLyBjaGVja2luZyB3aGV0aGVyIHRoZSByb290IGlzIGEgcHJlZml4IG9mIHRoZSBwYXRoIHdvbid0IHdvcmsuIEluc3RlYWQsIHdlXG4gIC8vIG5lZWQgdG8gcmVtb3ZlIGNvbXBvbmVudHMgZnJvbSB0aGUgcm9vdCBvbmUgYnkgb25lLCB1bnRpbCBlaXRoZXIgd2UgZmluZFxuICAvLyBhIHByZWZpeCB0aGF0IGZpdHMsIG9yIHdlIHJ1biBvdXQgb2YgY29tcG9uZW50cyB0byByZW1vdmUuXG4gIHZhciBsZXZlbCA9IDA7XG4gIHdoaWxlIChhUGF0aC5pbmRleE9mKGFSb290ICsgJy8nKSAhPT0gMCkge1xuICAgIHZhciBpbmRleCA9IGFSb290Lmxhc3RJbmRleE9mKFwiL1wiKTtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICByZXR1cm4gYVBhdGg7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG9ubHkgcGFydCBvZiB0aGUgcm9vdCB0aGF0IGlzIGxlZnQgaXMgdGhlIHNjaGVtZSAoaS5lLiBodHRwOi8vLFxuICAgIC8vIGZpbGU6Ly8vLCBldGMuKSwgb25lIG9yIG1vcmUgc2xhc2hlcyAoLyksIG9yIHNpbXBseSBub3RoaW5nIGF0IGFsbCwgd2VcbiAgICAvLyBoYXZlIGV4aGF1c3RlZCBhbGwgY29tcG9uZW50cywgc28gdGhlIHBhdGggaXMgbm90IHJlbGF0aXZlIHRvIHRoZSByb290LlxuICAgIGFSb290ID0gYVJvb3Quc2xpY2UoMCwgaW5kZXgpO1xuICAgIGlmIChhUm9vdC5tYXRjaCgvXihbXlxcL10rOlxcLyk/XFwvKiQvKSkge1xuICAgICAgcmV0dXJuIGFQYXRoO1xuICAgIH1cblxuICAgICsrbGV2ZWw7XG4gIH1cblxuICAvLyBNYWtlIHN1cmUgd2UgYWRkIGEgXCIuLi9cIiBmb3IgZWFjaCBjb21wb25lbnQgd2UgcmVtb3ZlZCBmcm9tIHRoZSByb290LlxuICByZXR1cm4gQXJyYXkobGV2ZWwgKyAxKS5qb2luKFwiLi4vXCIpICsgYVBhdGguc3Vic3RyKGFSb290Lmxlbmd0aCArIDEpO1xufVxuZXhwb3J0cy5yZWxhdGl2ZSA9IHJlbGF0aXZlO1xuXG52YXIgc3VwcG9ydHNOdWxsUHJvdG8gPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgb2JqID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgcmV0dXJuICEoJ19fcHJvdG9fXycgaW4gb2JqKTtcbn0oKSk7XG5cbmZ1bmN0aW9uIGlkZW50aXR5IChzKSB7XG4gIHJldHVybiBzO1xufVxuXG4vKipcbiAqIEJlY2F1c2UgYmVoYXZpb3IgZ29lcyB3YWNreSB3aGVuIHlvdSBzZXQgYF9fcHJvdG9fX2Agb24gb2JqZWN0cywgd2VcbiAqIGhhdmUgdG8gcHJlZml4IGFsbCB0aGUgc3RyaW5ncyBpbiBvdXIgc2V0IHdpdGggYW4gYXJiaXRyYXJ5IGNoYXJhY3Rlci5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvc291cmNlLW1hcC9wdWxsLzMxIGFuZFxuICogaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvc291cmNlLW1hcC9pc3N1ZXMvMzBcbiAqXG4gKiBAcGFyYW0gU3RyaW5nIGFTdHJcbiAqL1xuZnVuY3Rpb24gdG9TZXRTdHJpbmcoYVN0cikge1xuICBpZiAoaXNQcm90b1N0cmluZyhhU3RyKSkge1xuICAgIHJldHVybiAnJCcgKyBhU3RyO1xuICB9XG5cbiAgcmV0dXJuIGFTdHI7XG59XG5leHBvcnRzLnRvU2V0U3RyaW5nID0gc3VwcG9ydHNOdWxsUHJvdG8gPyBpZGVudGl0eSA6IHRvU2V0U3RyaW5nO1xuXG5mdW5jdGlvbiBmcm9tU2V0U3RyaW5nKGFTdHIpIHtcbiAgaWYgKGlzUHJvdG9TdHJpbmcoYVN0cikpIHtcbiAgICByZXR1cm4gYVN0ci5zbGljZSgxKTtcbiAgfVxuXG4gIHJldHVybiBhU3RyO1xufVxuZXhwb3J0cy5mcm9tU2V0U3RyaW5nID0gc3VwcG9ydHNOdWxsUHJvdG8gPyBpZGVudGl0eSA6IGZyb21TZXRTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzUHJvdG9TdHJpbmcocykge1xuICBpZiAoIXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgbGVuZ3RoID0gcy5sZW5ndGg7XG5cbiAgaWYgKGxlbmd0aCA8IDkgLyogXCJfX3Byb3RvX19cIi5sZW5ndGggKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocy5jaGFyQ29kZUF0KGxlbmd0aCAtIDEpICE9PSA5NSAgLyogJ18nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gMikgIT09IDk1ICAvKiAnXycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSAzKSAhPT0gMTExIC8qICdvJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDQpICE9PSAxMTYgLyogJ3QnICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNSkgIT09IDExMSAvKiAnbycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA2KSAhPT0gMTE0IC8qICdyJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDcpICE9PSAxMTIgLyogJ3AnICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gOCkgIT09IDk1ICAvKiAnXycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA5KSAhPT0gOTUgIC8qICdfJyAqLykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSBsZW5ndGggLSAxMDsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAocy5jaGFyQ29kZUF0KGkpICE9PSAzNiAvKiAnJCcgKi8pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdoZXJlIHRoZSBvcmlnaW5hbCBwb3NpdGlvbnMgYXJlIGNvbXBhcmVkLlxuICpcbiAqIE9wdGlvbmFsbHkgcGFzcyBpbiBgdHJ1ZWAgYXMgYG9ubHlDb21wYXJlR2VuZXJhdGVkYCB0byBjb25zaWRlciB0d29cbiAqIG1hcHBpbmdzIHdpdGggdGhlIHNhbWUgb3JpZ2luYWwgc291cmNlL2xpbmUvY29sdW1uLCBidXQgZGlmZmVyZW50IGdlbmVyYXRlZFxuICogbGluZSBhbmQgY29sdW1uIHRoZSBzYW1lLiBVc2VmdWwgd2hlbiBzZWFyY2hpbmcgZm9yIGEgbWFwcGluZyB3aXRoIGFcbiAqIHN0dWJiZWQgb3V0IG1hcHBpbmcuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKG1hcHBpbmdBLCBtYXBwaW5nQiwgb25seUNvbXBhcmVPcmlnaW5hbCkge1xuICB2YXIgY21wID0gbWFwcGluZ0Euc291cmNlIC0gbWFwcGluZ0Iuc291cmNlO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICBpZiAoY21wICE9PSAwIHx8IG9ubHlDb21wYXJlT3JpZ2luYWwpIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIHJldHVybiBtYXBwaW5nQS5uYW1lIC0gbWFwcGluZ0IubmFtZTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMgPSBjb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucztcblxuLyoqXG4gKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdpdGggZGVmbGF0ZWQgc291cmNlIGFuZCBuYW1lIGluZGljZXMgd2hlcmVcbiAqIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAqXG4gKiBPcHRpb25hbGx5IHBhc3MgaW4gYHRydWVgIGFzIGBvbmx5Q29tcGFyZUdlbmVyYXRlZGAgdG8gY29uc2lkZXIgdHdvXG4gKiBtYXBwaW5ncyB3aXRoIHRoZSBzYW1lIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4sIGJ1dCBkaWZmZXJlbnRcbiAqIHNvdXJjZS9uYW1lL29yaWdpbmFsIGxpbmUgYW5kIGNvbHVtbiB0aGUgc2FtZS4gVXNlZnVsIHdoZW4gc2VhcmNoaW5nIGZvciBhXG4gKiBtYXBwaW5nIHdpdGggYSBzdHViYmVkIG91dCBtYXBwaW5nLlxuICovXG5mdW5jdGlvbiBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IsIG9ubHlDb21wYXJlR2VuZXJhdGVkKSB7XG4gIHZhciBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lIC0gbWFwcGluZ0IuZ2VuZXJhdGVkTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVHZW5lcmF0ZWQpIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Euc291cmNlIC0gbWFwcGluZ0Iuc291cmNlO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIHJldHVybiBtYXBwaW5nQS5uYW1lIC0gbWFwcGluZ0IubmFtZTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQgPSBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZDtcblxuZnVuY3Rpb24gc3RyY21wKGFTdHIxLCBhU3RyMikge1xuICBpZiAoYVN0cjEgPT09IGFTdHIyKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoYVN0cjEgPiBhU3RyMikge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIENvbXBhcmF0b3IgYmV0d2VlbiB0d28gbWFwcGluZ3Mgd2l0aCBpbmZsYXRlZCBzb3VyY2UgYW5kIG5hbWUgc3RyaW5ncyB3aGVyZVxuICogdGhlIGdlbmVyYXRlZCBwb3NpdGlvbnMgYXJlIGNvbXBhcmVkLlxuICovXG5mdW5jdGlvbiBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IpIHtcbiAgdmFyIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZENvbHVtbiAtIG1hcHBpbmdCLmdlbmVyYXRlZENvbHVtbjtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBzdHJjbXAobWFwcGluZ0Euc291cmNlLCBtYXBwaW5nQi5zb3VyY2UpO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIHJldHVybiBzdHJjbXAobWFwcGluZ0EubmFtZSwgbWFwcGluZ0IubmFtZSk7XG59XG5leHBvcnRzLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkID0gY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi91dGlsLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=