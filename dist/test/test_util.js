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
	
	  var parsed = libUtil.urlParse('webpack:///webpack/bootstrap 67e184f9679733298d44');
	  assert.equal(parsed.scheme, 'webpack');
	  assert.equal(parsed.host, '');
	  assert.equal(parsed.path, 'webpack/bootstrap 67e184f9679733298d44');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2M0NWJkMmVlZmVhM2E2ZDhjMmQiLCJ3ZWJwYWNrOi8vLy4vdGVzdC90ZXN0LXV0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMvTkEsaUJBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsK0NBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUEyQixRQUFRO0FBQ25DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0EsZUFBYztBQUNkOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoidGVzdF91dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgN2M0NWJkMmVlZmVhM2E2ZDhjMmQiLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTQgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciBsaWJVdGlsID0gcmVxdWlyZSgnLi4vbGliL3V0aWwnKTtcblxuZXhwb3J0c1sndGVzdCB1cmxzJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBhc3NlcnRVcmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgYXNzZXJ0LmVxdWFsKHVybCwgbGliVXRpbC51cmxHZW5lcmF0ZShsaWJVdGlsLnVybFBhcnNlKHVybCkpKTtcbiAgfTtcbiAgYXNzZXJ0VXJsKCdodHRwOi8vJyk7XG4gIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpO1xuICBhc3NlcnRVcmwoJ2h0dHA6Ly91c2VyOnBhc3NAd3d3LmV4YW1wbGUuY29tJyk7XG4gIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbTo4MCcpO1xuICBhc3NlcnRVcmwoJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20vJyk7XG4gIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbS9mb28vYmFyJyk7XG4gIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbS9mb28vYmFyLycpO1xuICBhc3NlcnRVcmwoJ2h0dHA6Ly91c2VyOnBhc3NAd3d3LmV4YW1wbGUuY29tOjgwL2Zvby9iYXIvJyk7XG5cbiAgYXNzZXJ0VXJsKCcvLycpO1xuICBhc3NlcnRVcmwoJy8vd3d3LmV4YW1wbGUuY29tJyk7XG4gIGFzc2VydFVybCgnZmlsZTovLy93d3cuZXhhbXBsZS5jb20nKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnJyksIG51bGwpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnLicpLCBudWxsKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJy4uJyksIG51bGwpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnYScpLCBudWxsKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2EvYicpLCBudWxsKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2EvL2InKSwgbnVsbCk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnVybFBhcnNlKCcvYScpLCBudWxsKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2RhdGE6Zm9vLGJhcicpLCBudWxsKTtcblxuICB2YXIgcGFyc2VkID0gbGliVXRpbC51cmxQYXJzZSgnaHR0cDovL3gteS5jb20vYmFyJyk7XG4gIGFzc2VydC5lcXVhbChwYXJzZWQuc2NoZW1lLCAnaHR0cCcpO1xuICBhc3NlcnQuZXF1YWwocGFyc2VkLmhvc3QsICd4LXkuY29tJyk7XG4gIGFzc2VydC5lcXVhbChwYXJzZWQucGF0aCwgJy9iYXInKTtcblxuICB2YXIgcGFyc2VkID0gbGliVXRpbC51cmxQYXJzZSgnd2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA2N2UxODRmOTY3OTczMzI5OGQ0NCcpO1xuICBhc3NlcnQuZXF1YWwocGFyc2VkLnNjaGVtZSwgJ3dlYnBhY2snKTtcbiAgYXNzZXJ0LmVxdWFsKHBhcnNlZC5ob3N0LCAnJyk7XG4gIGFzc2VydC5lcXVhbChwYXJzZWQucGF0aCwgJ3dlYnBhY2svYm9vdHN0cmFwIDY3ZTE4NGY5Njc5NzMzMjk4ZDQ0Jyk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IG5vcm1hbGl6ZSgpJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4uJyksICcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4uLycpLCAnLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uLi8uLi8uLi8uLicpLCAnLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uLi8uLi8uLi8uLi9hL2IvYycpLCAnL2EvYi9jJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnL2EvYi9jLy4uLy4uLy4uL2QvLi4vLi4vZScpLCAnL2UnKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4uJyksICcuLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4uLycpLCAnLi4vJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLi4vLi4vYS8nKSwgJy4uLy4uL2EvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnYS8uLicpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJ2EvLi4vLi4vLi4nKSwgJy4uLy4uJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLicpLCAnLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uLycpLCAnLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uLy4vLi8uJyksICcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4vLi8uLy4vYS9iL2MnKSwgJy9hL2IvYycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy9hL2IvYy8uLy4vLi9kLy4vLi9lJyksICcvYS9iL2MvZC9lJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcnKSwgJy4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcuJyksICcuJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLi8nKSwgJy4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcuLy4vYScpLCAnYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJ2EvLi8nKSwgJ2EvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnYS8uLy4vLicpLCAnYScpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnL2EvYi8vYy8vLy9kLy8vLy8nKSwgJy9hL2IvYy9kLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8vL2EvYi8vYy8vLy9kLy8vLy8nKSwgJy8vL2EvYi9jL2QvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnYS9iLy9jLy8vL2QnKSwgJ2EvYi9jL2QnKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4vLy8uLi8uLy4uL2EvYi8vLi8uLicpLCAnLi4vLi4vYScpXG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnaHR0cDovL3d3dy5leGFtcGxlLmNvbS8nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20vJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnaHR0cDovL3d3dy5leGFtcGxlLmNvbS8uLy4uLy9hL2IvYy8uLi8uL2QvLycpLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbS9hL2IvZC8nKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3Qgam9pbigpJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnYicpLCAnYS9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvJywgJ2InKSwgJ2EvYicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhLy8nLCAnYicpLCAnYS9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnYi8nKSwgJ2EvYi8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICdiLy8nKSwgJ2EvYi8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8nLCAnL2InKSwgJy9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvLycsICcvL2InKSwgJy8vYicpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnLi4nKSwgJy4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICcuLi9iJyksICdiJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvYicsICcuLi9jJyksICdhL2MnKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJy4nKSwgJ2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICcuL2InKSwgJ2EvYicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhL2InLCAnLi9jJyksICdhL2IvYycpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJ2RhdGE6Zm9vLGJhcicpLCAnZGF0YTpmb28sYmFyJyk7XG5cblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnYicpLCAnYicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJ2InKSwgJ2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJ2IvJyksICdiLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJ2IvJyksICdiLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnYi8vJyksICdiLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJ2IvLycpLCAnYi8nKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnLi4nKSwgJy4uJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnLi4nKSwgJy4uJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICcuLi9iJyksICcuLi9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnLi4vYicpLCAnLi4vYicpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICcuJyksICcuJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnLicpLCAnLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnLi9iJyksICdiJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnLi9iJyksICdiJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICdkYXRhOmZvbyxiYXInKSwgJ2RhdGE6Zm9vLGJhcicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJ2RhdGE6Zm9vLGJhcicpLCAnZGF0YTpmb28sYmFyJyk7XG5cblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICdiJyksICcuLi9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJ2IvJyksICcuLi9iLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICdiLy8nKSwgJy4uL2IvJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnLi4nKSwgJy4uLy4uJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJy4uL2InKSwgJy4uLy4uL2InKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICcuJyksICcuLicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICcuL2InKSwgJy4uL2InKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJ2RhdGE6Zm9vLGJhcicpLCAnZGF0YTpmb28sYmFyJyk7XG5cblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJycpLCAnYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJy4nKSwgJ2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8nLCAnJyksICdhJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvJywgJy4nKSwgJ2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8vJywgJycpLCAnYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhLy8nLCAnLicpLCAnYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcvYScsICcnKSwgJy9hJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy9hJywgJy4nKSwgJy9hJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICcnKSwgJy4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcnKSwgJy4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcnKSwgJy4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuJyksICcuJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJycpLCAnLi4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnLicpLCAnLi4nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcuJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvJywgJycpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hLycsICcuJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvLycsICcnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8vJywgJy4nKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcnLCAnJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcnLCAnLicpLCAnaHR0cDovL2Zvby5vcmcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLycsICcnKSwgJ2h0dHA6Ly9mb28ub3JnLycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy8nLCAnLicpLCAnaHR0cDovL2Zvby5vcmcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLy8nLCAnJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvLycsICcuJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLy93d3cuZXhhbXBsZS5jb20nLCAnJyksICcvL3d3dy5leGFtcGxlLmNvbS8nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLy93d3cuZXhhbXBsZS5jb20nLCAnLicpLCAnLy93d3cuZXhhbXBsZS5jb20vJyk7XG5cblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJ2InKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hLycsICdiJyksICdodHRwOi8vZm9vLm9yZy9hL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8vJywgJ2InKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJ2IvJyksICdodHRwOi8vZm9vLm9yZy9hL2IvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnYi8vJyksICdodHRwOi8vZm9vLm9yZy9hL2IvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvJywgJy9iJyksICdodHRwOi8vZm9vLm9yZy9iJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvLycsICcvL2InKSwgJ2h0dHA6Ly9iJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcuLicpLCAnaHR0cDovL2Zvby5vcmcvJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnLi4vYicpLCAnaHR0cDovL2Zvby5vcmcvYicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hL2InLCAnLi4vYycpLCAnaHR0cDovL2Zvby5vcmcvYS9jJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcuJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnLi9iJyksICdodHRwOi8vZm9vLm9yZy9hL2InKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS9iJywgJy4vYycpLCAnaHR0cDovL2Zvby5vcmcvYS9iL2MnKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICdkYXRhOmZvbyxiYXInKSwgJ2RhdGE6Zm9vLGJhcicpO1xuXG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcnLCAnYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy8nLCAnYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy8vJywgJ2EnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcnLCAnL2EnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvJywgJy9hJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLy8nLCAnL2EnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcblxuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly8nLCAnd3d3LmV4YW1wbGUuY29tJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2ZpbGU6Ly8vJywgJ3d3dy5leGFtcGxlLmNvbScpLCAnZmlsZTovLy93d3cuZXhhbXBsZS5jb20nKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovLycsICdmdHA6Ly9leGFtcGxlLmNvbScpLCAnZnRwOi8vZXhhbXBsZS5jb20nKTtcblxuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vd3d3LmV4YW1wbGUuY29tJywgJy8vZm9vLm9yZy9iYXInKSwgJ2h0dHA6Ly9mb28ub3JnL2JhcicpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcvL3d3dy5leGFtcGxlLmNvbScsICcvL2Zvby5vcmcvYmFyJyksICcvL2Zvby5vcmcvYmFyJyk7XG59O1xuXG4vLyBUT0RPIElzc3VlICMxMjg6IERlZmluZSBhbmQgdGVzdCB0aGlzIGZ1bmN0aW9uIHByb3Blcmx5LlxuZXhwb3J0c1sndGVzdCByZWxhdGl2ZSgpJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcvdGhlL3Jvb3QnLCAnL3RoZS9yb290L29uZS5qcycpLCAnb25lLmpzJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCdodHRwOi8vdGhlL3Jvb3QnLCAnaHR0cDovL3RoZS9yb290L29uZS5qcycpLCAnb25lLmpzJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcvdGhlL3Jvb3QnLCAnL3RoZS9yb290b25lLmpzJyksICcuLi9yb290b25lLmpzJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCdodHRwOi8vdGhlL3Jvb3QnLCAnaHR0cDovL3RoZS9yb290b25lLmpzJyksICcuLi9yb290b25lLmpzJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcvdGhlL3Jvb3QnLCAnL3RoZXJvb3RvbmUuanMnKSwgJy90aGVyb290b25lLmpzJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCdodHRwOi8vdGhlL3Jvb3QnLCAnL3RoZXJvb3RvbmUuanMnKSwgJy90aGVyb290b25lLmpzJyk7XG5cbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJycsICcvdGhlL3Jvb3Qvb25lLmpzJyksICcvdGhlL3Jvb3Qvb25lLmpzJyk7XG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcuJywgJy90aGUvcm9vdC9vbmUuanMnKSwgJy90aGUvcm9vdC9vbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJycsICd0aGUvcm9vdC9vbmUuanMnKSwgJ3RoZS9yb290L29uZS5qcycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnLicsICd0aGUvcm9vdC9vbmUuanMnKSwgJ3RoZS9yb290L29uZS5qcycpO1xuXG4gIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcvJywgJy90aGUvcm9vdC9vbmUuanMnKSwgJ3RoZS9yb290L29uZS5qcycpO1xuICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnLycsICd0aGUvcm9vdC9vbmUuanMnKSwgJ3RoZS9yb290L29uZS5qcycpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdGVzdC90ZXN0LXV0aWwuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG4vKipcbiAqIFRoaXMgaXMgYSBoZWxwZXIgZnVuY3Rpb24gZm9yIGdldHRpbmcgdmFsdWVzIGZyb20gcGFyYW1ldGVyL29wdGlvbnNcbiAqIG9iamVjdHMuXG4gKlxuICogQHBhcmFtIGFyZ3MgVGhlIG9iamVjdCB3ZSBhcmUgZXh0cmFjdGluZyB2YWx1ZXMgZnJvbVxuICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHdlIGFyZSBnZXR0aW5nLlxuICogQHBhcmFtIGRlZmF1bHRWYWx1ZSBBbiBvcHRpb25hbCB2YWx1ZSB0byByZXR1cm4gaWYgdGhlIHByb3BlcnR5IGlzIG1pc3NpbmdcbiAqIGZyb20gdGhlIG9iamVjdC4gSWYgdGhpcyBpcyBub3Qgc3BlY2lmaWVkIGFuZCB0aGUgcHJvcGVydHkgaXMgbWlzc2luZywgYW5cbiAqIGVycm9yIHdpbGwgYmUgdGhyb3duLlxuICovXG5mdW5jdGlvbiBnZXRBcmcoYUFyZ3MsIGFOYW1lLCBhRGVmYXVsdFZhbHVlKSB7XG4gIGlmIChhTmFtZSBpbiBhQXJncykge1xuICAgIHJldHVybiBhQXJnc1thTmFtZV07XG4gIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgIHJldHVybiBhRGVmYXVsdFZhbHVlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignXCInICsgYU5hbWUgKyAnXCIgaXMgYSByZXF1aXJlZCBhcmd1bWVudC4nKTtcbiAgfVxufVxuZXhwb3J0cy5nZXRBcmcgPSBnZXRBcmc7XG5cbnZhciB1cmxSZWdleHAgPSAvXig/OihbXFx3K1xcLS5dKyk6KT9cXC9cXC8oPzooXFx3KzpcXHcrKUApPyhbXFx3Li1dKikoPzo6KFxcZCspKT8oXFxTKikkLztcbnZhciBkYXRhVXJsUmVnZXhwID0gL15kYXRhOi4rXFwsLiskLztcblxuZnVuY3Rpb24gdXJsUGFyc2UoYVVybCkge1xuICB2YXIgbWF0Y2ggPSBhVXJsLm1hdGNoKHVybFJlZ2V4cCk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHNjaGVtZTogbWF0Y2hbMV0sXG4gICAgYXV0aDogbWF0Y2hbMl0sXG4gICAgaG9zdDogbWF0Y2hbM10sXG4gICAgcG9ydDogbWF0Y2hbNF0sXG4gICAgcGF0aDogbWF0Y2hbNV1cbiAgfTtcbn1cbmV4cG9ydHMudXJsUGFyc2UgPSB1cmxQYXJzZTtcblxuZnVuY3Rpb24gdXJsR2VuZXJhdGUoYVBhcnNlZFVybCkge1xuICB2YXIgdXJsID0gJyc7XG4gIGlmIChhUGFyc2VkVXJsLnNjaGVtZSkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLnNjaGVtZSArICc6JztcbiAgfVxuICB1cmwgKz0gJy8vJztcbiAgaWYgKGFQYXJzZWRVcmwuYXV0aCkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLmF1dGggKyAnQCc7XG4gIH1cbiAgaWYgKGFQYXJzZWRVcmwuaG9zdCkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLmhvc3Q7XG4gIH1cbiAgaWYgKGFQYXJzZWRVcmwucG9ydCkge1xuICAgIHVybCArPSBcIjpcIiArIGFQYXJzZWRVcmwucG9ydFxuICB9XG4gIGlmIChhUGFyc2VkVXJsLnBhdGgpIHtcbiAgICB1cmwgKz0gYVBhcnNlZFVybC5wYXRoO1xuICB9XG4gIHJldHVybiB1cmw7XG59XG5leHBvcnRzLnVybEdlbmVyYXRlID0gdXJsR2VuZXJhdGU7XG5cbi8qKlxuICogTm9ybWFsaXplcyBhIHBhdGgsIG9yIHRoZSBwYXRoIHBvcnRpb24gb2YgYSBVUkw6XG4gKlxuICogLSBSZXBsYWNlcyBjb25zZWN1dGl2ZSBzbGFzaGVzIHdpdGggb25lIHNsYXNoLlxuICogLSBSZW1vdmVzIHVubmVjZXNzYXJ5ICcuJyBwYXJ0cy5cbiAqIC0gUmVtb3ZlcyB1bm5lY2Vzc2FyeSAnPGRpcj4vLi4nIHBhcnRzLlxuICpcbiAqIEJhc2VkIG9uIGNvZGUgaW4gdGhlIE5vZGUuanMgJ3BhdGgnIGNvcmUgbW9kdWxlLlxuICpcbiAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciB1cmwgdG8gbm9ybWFsaXplLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemUoYVBhdGgpIHtcbiAgdmFyIHBhdGggPSBhUGF0aDtcbiAgdmFyIHVybCA9IHVybFBhcnNlKGFQYXRoKTtcbiAgaWYgKHVybCkge1xuICAgIGlmICghdXJsLnBhdGgpIHtcbiAgICAgIHJldHVybiBhUGF0aDtcbiAgICB9XG4gICAgcGF0aCA9IHVybC5wYXRoO1xuICB9XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpO1xuXG4gIHZhciBwYXJ0cyA9IHBhdGguc3BsaXQoL1xcLysvKTtcbiAgZm9yICh2YXIgcGFydCwgdXAgPSAwLCBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBwYXJ0ID0gcGFydHNbaV07XG4gICAgaWYgKHBhcnQgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAocGFydCA9PT0gJy4uJykge1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwID4gMCkge1xuICAgICAgaWYgKHBhcnQgPT09ICcnKSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBwYXJ0IGlzIGJsYW5rIGlmIHRoZSBwYXRoIGlzIGFic29sdXRlLiBUcnlpbmcgdG8gZ29cbiAgICAgICAgLy8gYWJvdmUgdGhlIHJvb3QgaXMgYSBuby1vcC4gVGhlcmVmb3JlIHdlIGNhbiByZW1vdmUgYWxsICcuLicgcGFydHNcbiAgICAgICAgLy8gZGlyZWN0bHkgYWZ0ZXIgdGhlIHJvb3QuXG4gICAgICAgIHBhcnRzLnNwbGljZShpICsgMSwgdXApO1xuICAgICAgICB1cCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMik7XG4gICAgICAgIHVwLS07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHBhdGggPSBwYXJ0cy5qb2luKCcvJyk7XG5cbiAgaWYgKHBhdGggPT09ICcnKSB7XG4gICAgcGF0aCA9IGlzQWJzb2x1dGUgPyAnLycgOiAnLic7XG4gIH1cblxuICBpZiAodXJsKSB7XG4gICAgdXJsLnBhdGggPSBwYXRoO1xuICAgIHJldHVybiB1cmxHZW5lcmF0ZSh1cmwpO1xuICB9XG4gIHJldHVybiBwYXRoO1xufVxuZXhwb3J0cy5ub3JtYWxpemUgPSBub3JtYWxpemU7XG5cbi8qKlxuICogSm9pbnMgdHdvIHBhdGhzL1VSTHMuXG4gKlxuICogQHBhcmFtIGFSb290IFRoZSByb290IHBhdGggb3IgVVJMLlxuICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIFVSTCB0byBiZSBqb2luZWQgd2l0aCB0aGUgcm9vdC5cbiAqXG4gKiAtIElmIGFQYXRoIGlzIGEgVVJMIG9yIGEgZGF0YSBVUkksIGFQYXRoIGlzIHJldHVybmVkLCB1bmxlc3MgYVBhdGggaXMgYVxuICogICBzY2hlbWUtcmVsYXRpdmUgVVJMOiBUaGVuIHRoZSBzY2hlbWUgb2YgYVJvb3QsIGlmIGFueSwgaXMgcHJlcGVuZGVkXG4gKiAgIGZpcnN0LlxuICogLSBPdGhlcndpc2UgYVBhdGggaXMgYSBwYXRoLiBJZiBhUm9vdCBpcyBhIFVSTCwgdGhlbiBpdHMgcGF0aCBwb3J0aW9uXG4gKiAgIGlzIHVwZGF0ZWQgd2l0aCB0aGUgcmVzdWx0IGFuZCBhUm9vdCBpcyByZXR1cm5lZC4gT3RoZXJ3aXNlIHRoZSByZXN1bHRcbiAqICAgaXMgcmV0dXJuZWQuXG4gKiAgIC0gSWYgYVBhdGggaXMgYWJzb2x1dGUsIHRoZSByZXN1bHQgaXMgYVBhdGguXG4gKiAgIC0gT3RoZXJ3aXNlIHRoZSB0d28gcGF0aHMgYXJlIGpvaW5lZCB3aXRoIGEgc2xhc2guXG4gKiAtIEpvaW5pbmcgZm9yIGV4YW1wbGUgJ2h0dHA6Ly8nIGFuZCAnd3d3LmV4YW1wbGUuY29tJyBpcyBhbHNvIHN1cHBvcnRlZC5cbiAqL1xuZnVuY3Rpb24gam9pbihhUm9vdCwgYVBhdGgpIHtcbiAgaWYgKGFSb290ID09PSBcIlwiKSB7XG4gICAgYVJvb3QgPSBcIi5cIjtcbiAgfVxuICBpZiAoYVBhdGggPT09IFwiXCIpIHtcbiAgICBhUGF0aCA9IFwiLlwiO1xuICB9XG4gIHZhciBhUGF0aFVybCA9IHVybFBhcnNlKGFQYXRoKTtcbiAgdmFyIGFSb290VXJsID0gdXJsUGFyc2UoYVJvb3QpO1xuICBpZiAoYVJvb3RVcmwpIHtcbiAgICBhUm9vdCA9IGFSb290VXJsLnBhdGggfHwgJy8nO1xuICB9XG5cbiAgLy8gYGpvaW4oZm9vLCAnLy93d3cuZXhhbXBsZS5vcmcnKWBcbiAgaWYgKGFQYXRoVXJsICYmICFhUGF0aFVybC5zY2hlbWUpIHtcbiAgICBpZiAoYVJvb3RVcmwpIHtcbiAgICAgIGFQYXRoVXJsLnNjaGVtZSA9IGFSb290VXJsLnNjaGVtZTtcbiAgICB9XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKGFQYXRoVXJsKTtcbiAgfVxuXG4gIGlmIChhUGF0aFVybCB8fCBhUGF0aC5tYXRjaChkYXRhVXJsUmVnZXhwKSkge1xuICAgIHJldHVybiBhUGF0aDtcbiAgfVxuXG4gIC8vIGBqb2luKCdodHRwOi8vJywgJ3d3dy5leGFtcGxlLmNvbScpYFxuICBpZiAoYVJvb3RVcmwgJiYgIWFSb290VXJsLmhvc3QgJiYgIWFSb290VXJsLnBhdGgpIHtcbiAgICBhUm9vdFVybC5ob3N0ID0gYVBhdGg7XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKGFSb290VXJsKTtcbiAgfVxuXG4gIHZhciBqb2luZWQgPSBhUGF0aC5jaGFyQXQoMCkgPT09ICcvJ1xuICAgID8gYVBhdGhcbiAgICA6IG5vcm1hbGl6ZShhUm9vdC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIGFQYXRoKTtcblxuICBpZiAoYVJvb3RVcmwpIHtcbiAgICBhUm9vdFVybC5wYXRoID0gam9pbmVkO1xuICAgIHJldHVybiB1cmxHZW5lcmF0ZShhUm9vdFVybCk7XG4gIH1cbiAgcmV0dXJuIGpvaW5lZDtcbn1cbmV4cG9ydHMuam9pbiA9IGpvaW47XG5cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uIChhUGF0aCkge1xuICByZXR1cm4gYVBhdGguY2hhckF0KDApID09PSAnLycgfHwgISFhUGF0aC5tYXRjaCh1cmxSZWdleHApO1xufTtcblxuLyoqXG4gKiBNYWtlIGEgcGF0aCByZWxhdGl2ZSB0byBhIFVSTCBvciBhbm90aGVyIHBhdGguXG4gKlxuICogQHBhcmFtIGFSb290IFRoZSByb290IHBhdGggb3IgVVJMLlxuICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIFVSTCB0byBiZSBtYWRlIHJlbGF0aXZlIHRvIGFSb290LlxuICovXG5mdW5jdGlvbiByZWxhdGl2ZShhUm9vdCwgYVBhdGgpIHtcbiAgaWYgKGFSb290ID09PSBcIlwiKSB7XG4gICAgYVJvb3QgPSBcIi5cIjtcbiAgfVxuXG4gIGFSb290ID0gYVJvb3QucmVwbGFjZSgvXFwvJC8sICcnKTtcblxuICAvLyBJdCBpcyBwb3NzaWJsZSBmb3IgdGhlIHBhdGggdG8gYmUgYWJvdmUgdGhlIHJvb3QuIEluIHRoaXMgY2FzZSwgc2ltcGx5XG4gIC8vIGNoZWNraW5nIHdoZXRoZXIgdGhlIHJvb3QgaXMgYSBwcmVmaXggb2YgdGhlIHBhdGggd29uJ3Qgd29yay4gSW5zdGVhZCwgd2VcbiAgLy8gbmVlZCB0byByZW1vdmUgY29tcG9uZW50cyBmcm9tIHRoZSByb290IG9uZSBieSBvbmUsIHVudGlsIGVpdGhlciB3ZSBmaW5kXG4gIC8vIGEgcHJlZml4IHRoYXQgZml0cywgb3Igd2UgcnVuIG91dCBvZiBjb21wb25lbnRzIHRvIHJlbW92ZS5cbiAgdmFyIGxldmVsID0gMDtcbiAgd2hpbGUgKGFQYXRoLmluZGV4T2YoYVJvb3QgKyAnLycpICE9PSAwKSB7XG4gICAgdmFyIGluZGV4ID0gYVJvb3QubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgIHJldHVybiBhUGF0aDtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgb25seSBwYXJ0IG9mIHRoZSByb290IHRoYXQgaXMgbGVmdCBpcyB0aGUgc2NoZW1lIChpLmUuIGh0dHA6Ly8sXG4gICAgLy8gZmlsZTovLy8sIGV0Yy4pLCBvbmUgb3IgbW9yZSBzbGFzaGVzICgvKSwgb3Igc2ltcGx5IG5vdGhpbmcgYXQgYWxsLCB3ZVxuICAgIC8vIGhhdmUgZXhoYXVzdGVkIGFsbCBjb21wb25lbnRzLCBzbyB0aGUgcGF0aCBpcyBub3QgcmVsYXRpdmUgdG8gdGhlIHJvb3QuXG4gICAgYVJvb3QgPSBhUm9vdC5zbGljZSgwLCBpbmRleCk7XG4gICAgaWYgKGFSb290Lm1hdGNoKC9eKFteXFwvXSs6XFwvKT9cXC8qJC8pKSB7XG4gICAgICByZXR1cm4gYVBhdGg7XG4gICAgfVxuXG4gICAgKytsZXZlbDtcbiAgfVxuXG4gIC8vIE1ha2Ugc3VyZSB3ZSBhZGQgYSBcIi4uL1wiIGZvciBlYWNoIGNvbXBvbmVudCB3ZSByZW1vdmVkIGZyb20gdGhlIHJvb3QuXG4gIHJldHVybiBBcnJheShsZXZlbCArIDEpLmpvaW4oXCIuLi9cIikgKyBhUGF0aC5zdWJzdHIoYVJvb3QubGVuZ3RoICsgMSk7XG59XG5leHBvcnRzLnJlbGF0aXZlID0gcmVsYXRpdmU7XG5cbnZhciBzdXBwb3J0c051bGxQcm90byA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICByZXR1cm4gISgnX19wcm90b19fJyBpbiBvYmopO1xufSgpKTtcblxuZnVuY3Rpb24gaWRlbnRpdHkgKHMpIHtcbiAgcmV0dXJuIHM7XG59XG5cbi8qKlxuICogQmVjYXVzZSBiZWhhdmlvciBnb2VzIHdhY2t5IHdoZW4geW91IHNldCBgX19wcm90b19fYCBvbiBvYmplY3RzLCB3ZVxuICogaGF2ZSB0byBwcmVmaXggYWxsIHRoZSBzdHJpbmdzIGluIG91ciBzZXQgd2l0aCBhbiBhcmJpdHJhcnkgY2hhcmFjdGVyLlxuICpcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL3B1bGwvMzEgYW5kXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL2lzc3Vlcy8zMFxuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5mdW5jdGlvbiB0b1NldFN0cmluZyhhU3RyKSB7XG4gIGlmIChpc1Byb3RvU3RyaW5nKGFTdHIpKSB7XG4gICAgcmV0dXJuICckJyArIGFTdHI7XG4gIH1cblxuICByZXR1cm4gYVN0cjtcbn1cbmV4cG9ydHMudG9TZXRTdHJpbmcgPSBzdXBwb3J0c051bGxQcm90byA/IGlkZW50aXR5IDogdG9TZXRTdHJpbmc7XG5cbmZ1bmN0aW9uIGZyb21TZXRTdHJpbmcoYVN0cikge1xuICBpZiAoaXNQcm90b1N0cmluZyhhU3RyKSkge1xuICAgIHJldHVybiBhU3RyLnNsaWNlKDEpO1xuICB9XG5cbiAgcmV0dXJuIGFTdHI7XG59XG5leHBvcnRzLmZyb21TZXRTdHJpbmcgPSBzdXBwb3J0c051bGxQcm90byA/IGlkZW50aXR5IDogZnJvbVNldFN0cmluZztcblxuZnVuY3Rpb24gaXNQcm90b1N0cmluZyhzKSB7XG4gIGlmICghcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBzLmxlbmd0aDtcblxuICBpZiAobGVuZ3RoIDwgOSAvKiBcIl9fcHJvdG9fX1wiLmxlbmd0aCAqLykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChzLmNoYXJDb2RlQXQobGVuZ3RoIC0gMSkgIT09IDk1ICAvKiAnXycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSAyKSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDMpICE9PSAxMTEgLyogJ28nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNCkgIT09IDExNiAvKiAndCcgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA1KSAhPT0gMTExIC8qICdvJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDYpICE9PSAxMTQgLyogJ3InICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNykgIT09IDExMiAvKiAncCcgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA4KSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDkpICE9PSA5NSAgLyogJ18nICovKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IGxlbmd0aCAtIDEwOyBpID49IDA7IGktLSkge1xuICAgIGlmIChzLmNoYXJDb2RlQXQoaSkgIT09IDM2IC8qICckJyAqLykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENvbXBhcmF0b3IgYmV0d2VlbiB0d28gbWFwcGluZ3Mgd2hlcmUgdGhlIG9yaWdpbmFsIHBvc2l0aW9ucyBhcmUgY29tcGFyZWQuXG4gKlxuICogT3B0aW9uYWxseSBwYXNzIGluIGB0cnVlYCBhcyBgb25seUNvbXBhcmVHZW5lcmF0ZWRgIHRvIGNvbnNpZGVyIHR3b1xuICogbWFwcGluZ3Mgd2l0aCB0aGUgc2FtZSBvcmlnaW5hbCBzb3VyY2UvbGluZS9jb2x1bW4sIGJ1dCBkaWZmZXJlbnQgZ2VuZXJhdGVkXG4gKiBsaW5lIGFuZCBjb2x1bW4gdGhlIHNhbWUuIFVzZWZ1bCB3aGVuIHNlYXJjaGluZyBmb3IgYSBtYXBwaW5nIHdpdGggYVxuICogc3R1YmJlZCBvdXQgbWFwcGluZy5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMobWFwcGluZ0EsIG1hcHBpbmdCLCBvbmx5Q29tcGFyZU9yaWdpbmFsKSB7XG4gIHZhciBjbXAgPSBzdHJjbXAobWFwcGluZ0Euc291cmNlLCBtYXBwaW5nQi5zb3VyY2UpO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICBpZiAoY21wICE9PSAwIHx8IG9ubHlDb21wYXJlT3JpZ2luYWwpIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIHJldHVybiBzdHJjbXAobWFwcGluZ0EubmFtZSwgbWFwcGluZ0IubmFtZSk7XG59XG5leHBvcnRzLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zID0gY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnM7XG5cbi8qKlxuICogQ29tcGFyYXRvciBiZXR3ZWVuIHR3byBtYXBwaW5ncyB3aXRoIGRlZmxhdGVkIHNvdXJjZSBhbmQgbmFtZSBpbmRpY2VzIHdoZXJlXG4gKiB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9ucyBhcmUgY29tcGFyZWQuXG4gKlxuICogT3B0aW9uYWxseSBwYXNzIGluIGB0cnVlYCBhcyBgb25seUNvbXBhcmVHZW5lcmF0ZWRgIHRvIGNvbnNpZGVyIHR3b1xuICogbWFwcGluZ3Mgd2l0aCB0aGUgc2FtZSBnZW5lcmF0ZWQgbGluZSBhbmQgY29sdW1uLCBidXQgZGlmZmVyZW50XG4gKiBzb3VyY2UvbmFtZS9vcmlnaW5hbCBsaW5lIGFuZCBjb2x1bW4gdGhlIHNhbWUuIFVzZWZ1bCB3aGVuIHNlYXJjaGluZyBmb3IgYVxuICogbWFwcGluZyB3aXRoIGEgc3R1YmJlZCBvdXQgbWFwcGluZy5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQobWFwcGluZ0EsIG1hcHBpbmdCLCBvbmx5Q29tcGFyZUdlbmVyYXRlZCkge1xuICB2YXIgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZSAtIG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICBpZiAoY21wICE9PSAwIHx8IG9ubHlDb21wYXJlR2VuZXJhdGVkKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IHN0cmNtcChtYXBwaW5nQS5zb3VyY2UsIG1hcHBpbmdCLnNvdXJjZSk7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIHN0cmNtcChtYXBwaW5nQS5uYW1lLCBtYXBwaW5nQi5uYW1lKTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQgPSBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZDtcblxuZnVuY3Rpb24gc3RyY21wKGFTdHIxLCBhU3RyMikge1xuICBpZiAoYVN0cjEgPT09IGFTdHIyKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoYVN0cjEgPT09IG51bGwpIHtcbiAgICByZXR1cm4gMTsgLy8gYVN0cjIgIT09IG51bGxcbiAgfVxuXG4gIGlmIChhU3RyMiA9PT0gbnVsbCkge1xuICAgIHJldHVybiAtMTsgLy8gYVN0cjEgIT09IG51bGxcbiAgfVxuXG4gIGlmIChhU3RyMSA+IGFTdHIyKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvciBiZXR3ZWVuIHR3byBtYXBwaW5ncyB3aXRoIGluZmxhdGVkIHNvdXJjZSBhbmQgbmFtZSBzdHJpbmdzIHdoZXJlXG4gKiB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9ucyBhcmUgY29tcGFyZWQuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkKG1hcHBpbmdBLCBtYXBwaW5nQikge1xuICB2YXIgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZSAtIG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IHN0cmNtcChtYXBwaW5nQS5zb3VyY2UsIG1hcHBpbmdCLnNvdXJjZSk7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIHN0cmNtcChtYXBwaW5nQS5uYW1lLCBtYXBwaW5nQi5uYW1lKTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQgPSBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL3V0aWwuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==