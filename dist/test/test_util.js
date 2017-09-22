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
	
	  var parsed = libUtil.urlParse('http://x-y.com/bar');
	  assert.equal(parsed.scheme, 'http');
	  assert.equal(parsed.host, 'x-y.com');
	  assert.equal(parsed.path, '/bar');
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
	
	var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(\S*)$/;
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
	  var cmp = strcmp(mappingA.source, mappingB.source);
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
	
	  return strcmp(mappingA.name, mappingB.name);
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
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 === null) {
	    return 1; // aStr2 !== null
	  }
	
	  if (aStr2 === null) {
	    return -1; // aStr1 !== null
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWYzYTFkYjQzNWUyMzQwNTcyZjEiLCJ3ZWJwYWNrOi8vLy4vdGVzdC90ZXN0LXV0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMxTkEsaUJBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsK0NBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUEyQixRQUFRO0FBQ25DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0EsZUFBYztBQUNkOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoidGVzdF91dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNWYzYTFkYjQzNWUyMzQwNTcyZjEiLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTQgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciBsaWJVdGlsID0gcmVxdWlyZSgnLi4vbGliL3V0aWwnKTtcblxuZXhwb3J0c1sndGVzdCB1cmxzJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBhc3NlcnRVcmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgYXNzZXJ0LmVxdWFsKHVybCwgbGliVXRpbC51cmxHZW5lcmF0ZShsaWJVdGlsLnVybFBhcnNlKHVybCkpKTtcbiAgfTtcbiAgYXNzZXJ0VXJsKCdodHRwOi8vJyk7XG4gIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpO1xuICBhc3NlcnRVcmwoJ2h0dHA6Ly91c2VyOnBhc3NAd3d3LmV4YW1wbGUuY29tJyk7XG4gIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbTo4MCcpO1xuICBhc3NlcnRVcmwoJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20vJyk7XG4gIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbS9mb28vYmFyJyk7XG4gIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbS9mb28vYmFyLycpO1xuICBhc3NlcnRVcmwoJ2h0dHA6Ly91c2VyOnBhc3NAd3d3LmV4YW1wbGUuY29tOjgwL2Zvby9iYXIvJyk7XG5cbiAgYXNzZXJ0VXJsKCcvLycpO1xuICBhc3NlcnRVcmwoJy8vd3d3LmV4YW1wbGUuY29tJyk7XG4gIGFzc2VydFVybCgnZmlsZTovLy93d3cuZXhhbXBsZS5jb20nKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnJyksIG51bGwpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnLicpLCBudWxsKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJy4uJyksIG51bGwpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnYScpLCBudWxsKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2EvYicpLCBudWxsKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2EvL2InKSwgbnVsbCk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnVybFBhcnNlKCcvYScpLCBudWxsKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2RhdGE6Zm9vLGJhcicpLCBudWxsKTtcblxuICB2YXIgcGFyc2VkID0gbGliVXRpbC51cmxQYXJzZSgnaHR0cDovL3gteS5jb20vYmFyJyk7XG4gIGFzc2VydC5lcXVhbChwYXJzZWQuc2NoZW1lLCAnaHR0cCcpO1xuICBhc3NlcnQuZXF1YWwocGFyc2VkLmhvc3QsICd4LXkuY29tJyk7XG4gIGFzc2VydC5lcXVhbChwYXJzZWQucGF0aCwgJy9iYXInKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3Qgbm9ybWFsaXplKCknXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLi4nKSwgJy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLi4vJyksICcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4uLy4uLy4uLy4uJyksICcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4uLy4uLy4uLy4uL2EvYi9jJyksICcvYS9iL2MnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvYS9iL2MvLi4vLi4vLi4vZC8uLi8uLi9lJyksICcvZScpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLi4nKSwgJy4uJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLi4vJyksICcuLi8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcuLi8uLi9hLycpLCAnLi4vLi4vYS8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdhLy4uJyksICcuJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnYS8uLi8uLi8uLicpLCAnLi4vLi4nKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uJyksICcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4vJyksICcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4vLi8uLy4nKSwgJy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLi8uLy4vLi9hL2IvYycpLCAnL2EvYi9jJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnL2EvYi9jLy4vLi8uL2QvLi8uL2UnKSwgJy9hL2IvYy9kL2UnKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJycpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4nKSwgJy4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcuLycpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4vLi9hJyksICdhJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnYS8uLycpLCAnYS8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdhLy4vLi8uJyksICdhJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvYS9iLy9jLy8vL2QvLy8vLycpLCAnL2EvYi9jL2QvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy8vYS9iLy9jLy8vL2QvLy8vLycpLCAnLy8vYS9iL2MvZC8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdhL2IvL2MvLy8vZCcpLCAnYS9iL2MvZCcpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLi8vLy4uLy4vLi4vYS9iLy8uLy4uJyksICcuLi8uLi9hJylcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdodHRwOi8vd3d3LmV4YW1wbGUuY29tLycpLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbS8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdodHRwOi8vd3d3LmV4YW1wbGUuY29tLy4vLi4vL2EvYi9jLy4uLy4vZC8vJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tL2EvYi9kLycpO1xufTtcblxuZXhwb3J0c1sndGVzdCBqb2luKCknXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICdiJyksICdhL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8nLCAnYicpLCAnYS9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvLycsICdiJyksICdhL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICdiLycpLCAnYS9iLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJ2IvLycpLCAnYS9iLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhLycsICcvYicpLCAnL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8vJywgJy8vYicpLCAnLy9iJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICcuLicpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJy4uL2InKSwgJ2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS9iJywgJy4uL2MnKSwgJ2EvYycpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnLicpLCAnYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJy4vYicpLCAnYS9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvYicsICcuL2MnKSwgJ2EvYi9jJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnZGF0YTpmb28sYmFyJyksICdkYXRhOmZvbyxiYXInKTtcblxuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICdiJyksICdiJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnYicpLCAnYicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnYi8nKSwgJ2IvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnYi8nKSwgJ2IvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICdiLy8nKSwgJ2IvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnYi8vJyksICdiLycpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICcuLicpLCAnLi4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuLicpLCAnLi4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJy4uL2InKSwgJy4uL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuLi9iJyksICcuLi9iJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJy4nKSwgJy4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuJyksICcuJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICcuL2InKSwgJ2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuL2InKSwgJ2InKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJ2RhdGE6Zm9vLGJhcicpLCAnZGF0YTpmb28sYmFyJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnZGF0YTpmb28sYmFyJyksICdkYXRhOmZvbyxiYXInKTtcblxuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJ2InKSwgJy4uL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnYi8nKSwgJy4uL2IvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJ2IvLycpLCAnLi4vYi8nKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICcuLicpLCAnLi4vLi4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnLi4vYicpLCAnLi4vLi4vYicpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJy4nKSwgJy4uJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJy4vYicpLCAnLi4vYicpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnZGF0YTpmb28sYmFyJyksICdkYXRhOmZvbyxiYXInKTtcblxuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnJyksICdhJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnLicpLCAnYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhLycsICcnKSwgJ2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8nLCAnLicpLCAnYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhLy8nLCAnJyksICdhJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvLycsICcuJyksICdhJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy9hJywgJycpLCAnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignL2EnLCAnLicpLCAnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJycpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJycpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJycpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJy4nKSwgJy4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnJyksICcuLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICcuJyksICcuLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJycpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJy4nKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8nLCAnJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvJywgJy4nKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8vJywgJycpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hLy8nLCAnLicpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZycsICcnKSwgJ2h0dHA6Ly9mb28ub3JnLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZycsICcuJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvJywgJycpLCAnaHR0cDovL2Zvby5vcmcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLycsICcuJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvLycsICcnKSwgJ2h0dHA6Ly9mb28ub3JnLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy8vJywgJy4nKSwgJ2h0dHA6Ly9mb28ub3JnLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcvL3d3dy5leGFtcGxlLmNvbScsICcnKSwgJy8vd3d3LmV4YW1wbGUuY29tLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcvL3d3dy5leGFtcGxlLmNvbScsICcuJyksICcvL3d3dy5leGFtcGxlLmNvbS8nKTtcblxuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnYicpLCAnaHR0cDovL2Zvby5vcmcvYS9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvJywgJ2InKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hLy8nLCAnYicpLCAnaHR0cDovL2Zvby5vcmcvYS9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnYi8nKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYi8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICdiLy8nKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYi8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8nLCAnL2InKSwgJ2h0dHA6Ly9mb28ub3JnL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8vJywgJy8vYicpLCAnaHR0cDovL2InKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJy4uJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcuLi9iJyksICdodHRwOi8vZm9vLm9yZy9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvYicsICcuLi9jJyksICdodHRwOi8vZm9vLm9yZy9hL2MnKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJy4nKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcuL2InKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hL2InLCAnLi9jJyksICdodHRwOi8vZm9vLm9yZy9hL2IvYycpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJ2RhdGE6Zm9vLGJhcicpLCAnZGF0YTpmb28sYmFyJyk7XG5cblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZycsICdhJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLycsICdhJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLy8nLCAnYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZycsICcvYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy8nLCAnL2EnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvLycsICcvYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuXG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovLycsICd3d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignZmlsZTovLy8nLCAnd3d3LmV4YW1wbGUuY29tJyksICdmaWxlOi8vL3d3dy5leGFtcGxlLmNvbScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vJywgJ2Z0cDovL2V4YW1wbGUuY29tJyksICdmdHA6Ly9leGFtcGxlLmNvbScpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nLCAnLy9mb28ub3JnL2JhcicpLCAnaHR0cDovL2Zvby5vcmcvYmFyJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy8vd3d3LmV4YW1wbGUuY29tJywgJy8vZm9vLm9yZy9iYXInKSwgJy8vZm9vLm9yZy9iYXInKTtcbn07XG5cbi8vIFRPRE8gSXNzdWUgIzEyODogRGVmaW5lIGFuZCB0ZXN0IHRoaXMgZnVuY3Rpb24gcHJvcGVybHkuXG5leHBvcnRzWyd0ZXN0IHJlbGF0aXZlKCknXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy90aGUvcm9vdCcsICcvdGhlL3Jvb3Qvb25lLmpzJyksICdvbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJ2h0dHA6Ly90aGUvcm9vdCcsICdodHRwOi8vdGhlL3Jvb3Qvb25lLmpzJyksICdvbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy90aGUvcm9vdCcsICcvdGhlL3Jvb3RvbmUuanMnKSwgJy4uL3Jvb3RvbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJ2h0dHA6Ly90aGUvcm9vdCcsICdodHRwOi8vdGhlL3Jvb3RvbmUuanMnKSwgJy4uL3Jvb3RvbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy90aGUvcm9vdCcsICcvdGhlcm9vdG9uZS5qcycpLCAnL3RoZXJvb3RvbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJ2h0dHA6Ly90aGUvcm9vdCcsICcvdGhlcm9vdG9uZS5qcycpLCAnL3RoZXJvb3RvbmUuanMnKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnJywgJy90aGUvcm9vdC9vbmUuanMnKSwgJy90aGUvcm9vdC9vbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy4nLCAnL3RoZS9yb290L29uZS5qcycpLCAnL3RoZS9yb290L29uZS5qcycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnJywgJ3RoZS9yb290L29uZS5qcycpLCAndGhlL3Jvb3Qvb25lLmpzJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcuJywgJ3RoZS9yb290L29uZS5qcycpLCAndGhlL3Jvb3Qvb25lLmpzJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy8nLCAnL3RoZS9yb290L29uZS5qcycpLCAndGhlL3Jvb3Qvb25lLmpzJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcvJywgJ3RoZS9yb290L29uZS5qcycpLCAndGhlL3Jvb3Qvb25lLmpzJyk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90ZXN0L3Rlc3QtdXRpbC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbi8qKlxuICogVGhpcyBpcyBhIGhlbHBlciBmdW5jdGlvbiBmb3IgZ2V0dGluZyB2YWx1ZXMgZnJvbSBwYXJhbWV0ZXIvb3B0aW9uc1xuICogb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0gYXJncyBUaGUgb2JqZWN0IHdlIGFyZSBleHRyYWN0aW5nIHZhbHVlcyBmcm9tXG4gKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgd2UgYXJlIGdldHRpbmcuXG4gKiBAcGFyYW0gZGVmYXVsdFZhbHVlIEFuIG9wdGlvbmFsIHZhbHVlIHRvIHJldHVybiBpZiB0aGUgcHJvcGVydHkgaXMgbWlzc2luZ1xuICogZnJvbSB0aGUgb2JqZWN0LiBJZiB0aGlzIGlzIG5vdCBzcGVjaWZpZWQgYW5kIHRoZSBwcm9wZXJ0eSBpcyBtaXNzaW5nLCBhblxuICogZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gKi9cbmZ1bmN0aW9uIGdldEFyZyhhQXJncywgYU5hbWUsIGFEZWZhdWx0VmFsdWUpIHtcbiAgaWYgKGFOYW1lIGluIGFBcmdzKSB7XG4gICAgcmV0dXJuIGFBcmdzW2FOYW1lXTtcbiAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgcmV0dXJuIGFEZWZhdWx0VmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBhTmFtZSArICdcIiBpcyBhIHJlcXVpcmVkIGFyZ3VtZW50LicpO1xuICB9XG59XG5leHBvcnRzLmdldEFyZyA9IGdldEFyZztcblxudmFyIHVybFJlZ2V4cCA9IC9eKD86KFtcXHcrXFwtLl0rKTopP1xcL1xcLyg/OihcXHcrOlxcdyspQCk/KFtcXHcuLV0qKSg/OjooXFxkKykpPyhcXFMqKSQvO1xudmFyIGRhdGFVcmxSZWdleHAgPSAvXmRhdGE6LitcXCwuKyQvO1xuXG5mdW5jdGlvbiB1cmxQYXJzZShhVXJsKSB7XG4gIHZhciBtYXRjaCA9IGFVcmwubWF0Y2godXJsUmVnZXhwKTtcbiAgaWYgKCFtYXRjaCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB7XG4gICAgc2NoZW1lOiBtYXRjaFsxXSxcbiAgICBhdXRoOiBtYXRjaFsyXSxcbiAgICBob3N0OiBtYXRjaFszXSxcbiAgICBwb3J0OiBtYXRjaFs0XSxcbiAgICBwYXRoOiBtYXRjaFs1XVxuICB9O1xufVxuZXhwb3J0cy51cmxQYXJzZSA9IHVybFBhcnNlO1xuXG5mdW5jdGlvbiB1cmxHZW5lcmF0ZShhUGFyc2VkVXJsKSB7XG4gIHZhciB1cmwgPSAnJztcbiAgaWYgKGFQYXJzZWRVcmwuc2NoZW1lKSB7XG4gICAgdXJsICs9IGFQYXJzZWRVcmwuc2NoZW1lICsgJzonO1xuICB9XG4gIHVybCArPSAnLy8nO1xuICBpZiAoYVBhcnNlZFVybC5hdXRoKSB7XG4gICAgdXJsICs9IGFQYXJzZWRVcmwuYXV0aCArICdAJztcbiAgfVxuICBpZiAoYVBhcnNlZFVybC5ob3N0KSB7XG4gICAgdXJsICs9IGFQYXJzZWRVcmwuaG9zdDtcbiAgfVxuICBpZiAoYVBhcnNlZFVybC5wb3J0KSB7XG4gICAgdXJsICs9IFwiOlwiICsgYVBhcnNlZFVybC5wb3J0XG4gIH1cbiAgaWYgKGFQYXJzZWRVcmwucGF0aCkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLnBhdGg7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cbmV4cG9ydHMudXJsR2VuZXJhdGUgPSB1cmxHZW5lcmF0ZTtcblxuLyoqXG4gKiBOb3JtYWxpemVzIGEgcGF0aCwgb3IgdGhlIHBhdGggcG9ydGlvbiBvZiBhIFVSTDpcbiAqXG4gKiAtIFJlcGxhY2VzIGNvbnNlY3V0aXZlIHNsYXNoZXMgd2l0aCBvbmUgc2xhc2guXG4gKiAtIFJlbW92ZXMgdW5uZWNlc3NhcnkgJy4nIHBhcnRzLlxuICogLSBSZW1vdmVzIHVubmVjZXNzYXJ5ICc8ZGlyPi8uLicgcGFydHMuXG4gKlxuICogQmFzZWQgb24gY29kZSBpbiB0aGUgTm9kZS5qcyAncGF0aCcgY29yZSBtb2R1bGUuXG4gKlxuICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIHVybCB0byBub3JtYWxpemUuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZShhUGF0aCkge1xuICB2YXIgcGF0aCA9IGFQYXRoO1xuICB2YXIgdXJsID0gdXJsUGFyc2UoYVBhdGgpO1xuICBpZiAodXJsKSB7XG4gICAgaWYgKCF1cmwucGF0aCkge1xuICAgICAgcmV0dXJuIGFQYXRoO1xuICAgIH1cbiAgICBwYXRoID0gdXJsLnBhdGg7XG4gIH1cbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCk7XG5cbiAgdmFyIHBhcnRzID0gcGF0aC5zcGxpdCgvXFwvKy8pO1xuICBmb3IgKHZhciBwYXJ0LCB1cCA9IDAsIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHBhcnQgPSBwYXJ0c1tpXTtcbiAgICBpZiAocGFydCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChwYXJ0ID09PSAnLi4nKSB7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXAgPiAwKSB7XG4gICAgICBpZiAocGFydCA9PT0gJycpIHtcbiAgICAgICAgLy8gVGhlIGZpcnN0IHBhcnQgaXMgYmxhbmsgaWYgdGhlIHBhdGggaXMgYWJzb2x1dGUuIFRyeWluZyB0byBnb1xuICAgICAgICAvLyBhYm92ZSB0aGUgcm9vdCBpcyBhIG5vLW9wLiBUaGVyZWZvcmUgd2UgY2FuIHJlbW92ZSBhbGwgJy4uJyBwYXJ0c1xuICAgICAgICAvLyBkaXJlY3RseSBhZnRlciB0aGUgcm9vdC5cbiAgICAgICAgcGFydHMuc3BsaWNlKGkgKyAxLCB1cCk7XG4gICAgICAgIHVwID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnRzLnNwbGljZShpLCAyKTtcbiAgICAgICAgdXAtLTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcGF0aCA9IHBhcnRzLmpvaW4oJy8nKTtcblxuICBpZiAocGF0aCA9PT0gJycpIHtcbiAgICBwYXRoID0gaXNBYnNvbHV0ZSA/ICcvJyA6ICcuJztcbiAgfVxuXG4gIGlmICh1cmwpIHtcbiAgICB1cmwucGF0aCA9IHBhdGg7XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKHVybCk7XG4gIH1cbiAgcmV0dXJuIHBhdGg7XG59XG5leHBvcnRzLm5vcm1hbGl6ZSA9IG5vcm1hbGl6ZTtcblxuLyoqXG4gKiBKb2lucyB0d28gcGF0aHMvVVJMcy5cbiAqXG4gKiBAcGFyYW0gYVJvb3QgVGhlIHJvb3QgcGF0aCBvciBVUkwuXG4gKiBAcGFyYW0gYVBhdGggVGhlIHBhdGggb3IgVVJMIHRvIGJlIGpvaW5lZCB3aXRoIHRoZSByb290LlxuICpcbiAqIC0gSWYgYVBhdGggaXMgYSBVUkwgb3IgYSBkYXRhIFVSSSwgYVBhdGggaXMgcmV0dXJuZWQsIHVubGVzcyBhUGF0aCBpcyBhXG4gKiAgIHNjaGVtZS1yZWxhdGl2ZSBVUkw6IFRoZW4gdGhlIHNjaGVtZSBvZiBhUm9vdCwgaWYgYW55LCBpcyBwcmVwZW5kZWRcbiAqICAgZmlyc3QuXG4gKiAtIE90aGVyd2lzZSBhUGF0aCBpcyBhIHBhdGguIElmIGFSb290IGlzIGEgVVJMLCB0aGVuIGl0cyBwYXRoIHBvcnRpb25cbiAqICAgaXMgdXBkYXRlZCB3aXRoIHRoZSByZXN1bHQgYW5kIGFSb290IGlzIHJldHVybmVkLiBPdGhlcndpc2UgdGhlIHJlc3VsdFxuICogICBpcyByZXR1cm5lZC5cbiAqICAgLSBJZiBhUGF0aCBpcyBhYnNvbHV0ZSwgdGhlIHJlc3VsdCBpcyBhUGF0aC5cbiAqICAgLSBPdGhlcndpc2UgdGhlIHR3byBwYXRocyBhcmUgam9pbmVkIHdpdGggYSBzbGFzaC5cbiAqIC0gSm9pbmluZyBmb3IgZXhhbXBsZSAnaHR0cDovLycgYW5kICd3d3cuZXhhbXBsZS5jb20nIGlzIGFsc28gc3VwcG9ydGVkLlxuICovXG5mdW5jdGlvbiBqb2luKGFSb290LCBhUGF0aCkge1xuICBpZiAoYVJvb3QgPT09IFwiXCIpIHtcbiAgICBhUm9vdCA9IFwiLlwiO1xuICB9XG4gIGlmIChhUGF0aCA9PT0gXCJcIikge1xuICAgIGFQYXRoID0gXCIuXCI7XG4gIH1cbiAgdmFyIGFQYXRoVXJsID0gdXJsUGFyc2UoYVBhdGgpO1xuICB2YXIgYVJvb3RVcmwgPSB1cmxQYXJzZShhUm9vdCk7XG4gIGlmIChhUm9vdFVybCkge1xuICAgIGFSb290ID0gYVJvb3RVcmwucGF0aCB8fCAnLyc7XG4gIH1cblxuICAvLyBgam9pbihmb28sICcvL3d3dy5leGFtcGxlLm9yZycpYFxuICBpZiAoYVBhdGhVcmwgJiYgIWFQYXRoVXJsLnNjaGVtZSkge1xuICAgIGlmIChhUm9vdFVybCkge1xuICAgICAgYVBhdGhVcmwuc2NoZW1lID0gYVJvb3RVcmwuc2NoZW1lO1xuICAgIH1cbiAgICByZXR1cm4gdXJsR2VuZXJhdGUoYVBhdGhVcmwpO1xuICB9XG5cbiAgaWYgKGFQYXRoVXJsIHx8IGFQYXRoLm1hdGNoKGRhdGFVcmxSZWdleHApKSB7XG4gICAgcmV0dXJuIGFQYXRoO1xuICB9XG5cbiAgLy8gYGpvaW4oJ2h0dHA6Ly8nLCAnd3d3LmV4YW1wbGUuY29tJylgXG4gIGlmIChhUm9vdFVybCAmJiAhYVJvb3RVcmwuaG9zdCAmJiAhYVJvb3RVcmwucGF0aCkge1xuICAgIGFSb290VXJsLmhvc3QgPSBhUGF0aDtcbiAgICByZXR1cm4gdXJsR2VuZXJhdGUoYVJvb3RVcmwpO1xuICB9XG5cbiAgdmFyIGpvaW5lZCA9IGFQYXRoLmNoYXJBdCgwKSA9PT0gJy8nXG4gICAgPyBhUGF0aFxuICAgIDogbm9ybWFsaXplKGFSb290LnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgYVBhdGgpO1xuXG4gIGlmIChhUm9vdFVybCkge1xuICAgIGFSb290VXJsLnBhdGggPSBqb2luZWQ7XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKGFSb290VXJsKTtcbiAgfVxuICByZXR1cm4gam9pbmVkO1xufVxuZXhwb3J0cy5qb2luID0gam9pbjtcblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24gKGFQYXRoKSB7XG4gIHJldHVybiBhUGF0aC5jaGFyQXQoMCkgPT09ICcvJyB8fCAhIWFQYXRoLm1hdGNoKHVybFJlZ2V4cCk7XG59O1xuXG4vKipcbiAqIE1ha2UgYSBwYXRoIHJlbGF0aXZlIHRvIGEgVVJMIG9yIGFub3RoZXIgcGF0aC5cbiAqXG4gKiBAcGFyYW0gYVJvb3QgVGhlIHJvb3QgcGF0aCBvciBVUkwuXG4gKiBAcGFyYW0gYVBhdGggVGhlIHBhdGggb3IgVVJMIHRvIGJlIG1hZGUgcmVsYXRpdmUgdG8gYVJvb3QuXG4gKi9cbmZ1bmN0aW9uIHJlbGF0aXZlKGFSb290LCBhUGF0aCkge1xuICBpZiAoYVJvb3QgPT09IFwiXCIpIHtcbiAgICBhUm9vdCA9IFwiLlwiO1xuICB9XG5cbiAgYVJvb3QgPSBhUm9vdC5yZXBsYWNlKC9cXC8kLywgJycpO1xuXG4gIC8vIEl0IGlzIHBvc3NpYmxlIGZvciB0aGUgcGF0aCB0byBiZSBhYm92ZSB0aGUgcm9vdC4gSW4gdGhpcyBjYXNlLCBzaW1wbHlcbiAgLy8gY2hlY2tpbmcgd2hldGhlciB0aGUgcm9vdCBpcyBhIHByZWZpeCBvZiB0aGUgcGF0aCB3b24ndCB3b3JrLiBJbnN0ZWFkLCB3ZVxuICAvLyBuZWVkIHRvIHJlbW92ZSBjb21wb25lbnRzIGZyb20gdGhlIHJvb3Qgb25lIGJ5IG9uZSwgdW50aWwgZWl0aGVyIHdlIGZpbmRcbiAgLy8gYSBwcmVmaXggdGhhdCBmaXRzLCBvciB3ZSBydW4gb3V0IG9mIGNvbXBvbmVudHMgdG8gcmVtb3ZlLlxuICB2YXIgbGV2ZWwgPSAwO1xuICB3aGlsZSAoYVBhdGguaW5kZXhPZihhUm9vdCArICcvJykgIT09IDApIHtcbiAgICB2YXIgaW5kZXggPSBhUm9vdC5sYXN0SW5kZXhPZihcIi9cIik7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuIGFQYXRoO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBvbmx5IHBhcnQgb2YgdGhlIHJvb3QgdGhhdCBpcyBsZWZ0IGlzIHRoZSBzY2hlbWUgKGkuZS4gaHR0cDovLyxcbiAgICAvLyBmaWxlOi8vLywgZXRjLiksIG9uZSBvciBtb3JlIHNsYXNoZXMgKC8pLCBvciBzaW1wbHkgbm90aGluZyBhdCBhbGwsIHdlXG4gICAgLy8gaGF2ZSBleGhhdXN0ZWQgYWxsIGNvbXBvbmVudHMsIHNvIHRoZSBwYXRoIGlzIG5vdCByZWxhdGl2ZSB0byB0aGUgcm9vdC5cbiAgICBhUm9vdCA9IGFSb290LnNsaWNlKDAsIGluZGV4KTtcbiAgICBpZiAoYVJvb3QubWF0Y2goL14oW15cXC9dKzpcXC8pP1xcLyokLykpIHtcbiAgICAgIHJldHVybiBhUGF0aDtcbiAgICB9XG5cbiAgICArK2xldmVsO1xuICB9XG5cbiAgLy8gTWFrZSBzdXJlIHdlIGFkZCBhIFwiLi4vXCIgZm9yIGVhY2ggY29tcG9uZW50IHdlIHJlbW92ZWQgZnJvbSB0aGUgcm9vdC5cbiAgcmV0dXJuIEFycmF5KGxldmVsICsgMSkuam9pbihcIi4uL1wiKSArIGFQYXRoLnN1YnN0cihhUm9vdC5sZW5ndGggKyAxKTtcbn1cbmV4cG9ydHMucmVsYXRpdmUgPSByZWxhdGl2ZTtcblxudmFyIHN1cHBvcnRzTnVsbFByb3RvID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIG9iaiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHJldHVybiAhKCdfX3Byb3RvX18nIGluIG9iaik7XG59KCkpO1xuXG5mdW5jdGlvbiBpZGVudGl0eSAocykge1xuICByZXR1cm4gcztcbn1cblxuLyoqXG4gKiBCZWNhdXNlIGJlaGF2aW9yIGdvZXMgd2Fja3kgd2hlbiB5b3Ugc2V0IGBfX3Byb3RvX19gIG9uIG9iamVjdHMsIHdlXG4gKiBoYXZlIHRvIHByZWZpeCBhbGwgdGhlIHN0cmluZ3MgaW4gb3VyIHNldCB3aXRoIGFuIGFyYml0cmFyeSBjaGFyYWN0ZXIuXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3NvdXJjZS1tYXAvcHVsbC8zMSBhbmRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3NvdXJjZS1tYXAvaXNzdWVzLzMwXG4gKlxuICogQHBhcmFtIFN0cmluZyBhU3RyXG4gKi9cbmZ1bmN0aW9uIHRvU2V0U3RyaW5nKGFTdHIpIHtcbiAgaWYgKGlzUHJvdG9TdHJpbmcoYVN0cikpIHtcbiAgICByZXR1cm4gJyQnICsgYVN0cjtcbiAgfVxuXG4gIHJldHVybiBhU3RyO1xufVxuZXhwb3J0cy50b1NldFN0cmluZyA9IHN1cHBvcnRzTnVsbFByb3RvID8gaWRlbnRpdHkgOiB0b1NldFN0cmluZztcblxuZnVuY3Rpb24gZnJvbVNldFN0cmluZyhhU3RyKSB7XG4gIGlmIChpc1Byb3RvU3RyaW5nKGFTdHIpKSB7XG4gICAgcmV0dXJuIGFTdHIuc2xpY2UoMSk7XG4gIH1cblxuICByZXR1cm4gYVN0cjtcbn1cbmV4cG9ydHMuZnJvbVNldFN0cmluZyA9IHN1cHBvcnRzTnVsbFByb3RvID8gaWRlbnRpdHkgOiBmcm9tU2V0U3RyaW5nO1xuXG5mdW5jdGlvbiBpc1Byb3RvU3RyaW5nKHMpIHtcbiAgaWYgKCFzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGxlbmd0aCA9IHMubGVuZ3RoO1xuXG4gIGlmIChsZW5ndGggPCA5IC8qIFwiX19wcm90b19fXCIubGVuZ3RoICovKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHMuY2hhckNvZGVBdChsZW5ndGggLSAxKSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDIpICE9PSA5NSAgLyogJ18nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gMykgIT09IDExMSAvKiAnbycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA0KSAhPT0gMTE2IC8qICd0JyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDUpICE9PSAxMTEgLyogJ28nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNikgIT09IDExNCAvKiAncicgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA3KSAhPT0gMTEyIC8qICdwJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDgpICE9PSA5NSAgLyogJ18nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gOSkgIT09IDk1ICAvKiAnXycgKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKHZhciBpID0gbGVuZ3RoIC0gMTA7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSAhPT0gMzYgLyogJyQnICovKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvciBiZXR3ZWVuIHR3byBtYXBwaW5ncyB3aGVyZSB0aGUgb3JpZ2luYWwgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAqXG4gKiBPcHRpb25hbGx5IHBhc3MgaW4gYHRydWVgIGFzIGBvbmx5Q29tcGFyZUdlbmVyYXRlZGAgdG8gY29uc2lkZXIgdHdvXG4gKiBtYXBwaW5ncyB3aXRoIHRoZSBzYW1lIG9yaWdpbmFsIHNvdXJjZS9saW5lL2NvbHVtbiwgYnV0IGRpZmZlcmVudCBnZW5lcmF0ZWRcbiAqIGxpbmUgYW5kIGNvbHVtbiB0aGUgc2FtZS4gVXNlZnVsIHdoZW4gc2VhcmNoaW5nIGZvciBhIG1hcHBpbmcgd2l0aCBhXG4gKiBzdHViYmVkIG91dCBtYXBwaW5nLlxuICovXG5mdW5jdGlvbiBjb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyhtYXBwaW5nQSwgbWFwcGluZ0IsIG9ubHlDb21wYXJlT3JpZ2luYWwpIHtcbiAgdmFyIGNtcCA9IHN0cmNtcChtYXBwaW5nQS5zb3VyY2UsIG1hcHBpbmdCLnNvdXJjZSk7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVPcmlnaW5hbCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZSAtIG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIHN0cmNtcChtYXBwaW5nQS5uYW1lLCBtYXBwaW5nQi5uYW1lKTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMgPSBjb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucztcblxuLyoqXG4gKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdpdGggZGVmbGF0ZWQgc291cmNlIGFuZCBuYW1lIGluZGljZXMgd2hlcmVcbiAqIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAqXG4gKiBPcHRpb25hbGx5IHBhc3MgaW4gYHRydWVgIGFzIGBvbmx5Q29tcGFyZUdlbmVyYXRlZGAgdG8gY29uc2lkZXIgdHdvXG4gKiBtYXBwaW5ncyB3aXRoIHRoZSBzYW1lIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4sIGJ1dCBkaWZmZXJlbnRcbiAqIHNvdXJjZS9uYW1lL29yaWdpbmFsIGxpbmUgYW5kIGNvbHVtbiB0aGUgc2FtZS4gVXNlZnVsIHdoZW4gc2VhcmNoaW5nIGZvciBhXG4gKiBtYXBwaW5nIHdpdGggYSBzdHViYmVkIG91dCBtYXBwaW5nLlxuICovXG5mdW5jdGlvbiBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IsIG9ubHlDb21wYXJlR2VuZXJhdGVkKSB7XG4gIHZhciBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lIC0gbWFwcGluZ0IuZ2VuZXJhdGVkTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVHZW5lcmF0ZWQpIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gc3RyY21wKG1hcHBpbmdBLnNvdXJjZSwgbWFwcGluZ0Iuc291cmNlKTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbExpbmUgLSBtYXBwaW5nQi5vcmlnaW5hbExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxDb2x1bW4gLSBtYXBwaW5nQi5vcmlnaW5hbENvbHVtbjtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICByZXR1cm4gc3RyY21wKG1hcHBpbmdBLm5hbWUsIG1hcHBpbmdCLm5hbWUpO1xufVxuZXhwb3J0cy5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZCA9IGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkO1xuXG5mdW5jdGlvbiBzdHJjbXAoYVN0cjEsIGFTdHIyKSB7XG4gIGlmIChhU3RyMSA9PT0gYVN0cjIpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChhU3RyMSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAxOyAvLyBhU3RyMiAhPT0gbnVsbFxuICB9XG5cbiAgaWYgKGFTdHIyID09PSBudWxsKSB7XG4gICAgcmV0dXJuIC0xOyAvLyBhU3RyMSAhPT0gbnVsbFxuICB9XG5cbiAgaWYgKGFTdHIxID4gYVN0cjIpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdpdGggaW5mbGF0ZWQgc291cmNlIGFuZCBuYW1lIHN0cmluZ3Mgd2hlcmVcbiAqIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQobWFwcGluZ0EsIG1hcHBpbmdCKSB7XG4gIHZhciBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lIC0gbWFwcGluZ0IuZ2VuZXJhdGVkTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gc3RyY21wKG1hcHBpbmdBLnNvdXJjZSwgbWFwcGluZ0Iuc291cmNlKTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbExpbmUgLSBtYXBwaW5nQi5vcmlnaW5hbExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxDb2x1bW4gLSBtYXBwaW5nQi5vcmlnaW5hbENvbHVtbjtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICByZXR1cm4gc3RyY21wKG1hcHBpbmdBLm5hbWUsIG1hcHBpbmdCLm5hbWUpO1xufVxuZXhwb3J0cy5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZCA9IGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvdXRpbC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9