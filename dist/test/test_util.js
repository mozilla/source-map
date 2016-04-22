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
/***/ function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	{
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
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	{
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
	   * - Replaces consequtive slashes with one slash.
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
	  exports.toSetString = supportsNullProto() ? identity : toSetString;
	   function fromSetString(aStr) {
	    if (isProtoString(aStr)) {
	      return aStr.substr(1);
	    }
	
	    return aStr;
	  }
	  exports.fromSetString = supportsNullProto() ? identity : fromSetString;
	
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
	
	  function identity (s) {
	    return s;
	  }
	
	  function supportsNullProto() {
	    var obj = Object.create(null);
	    return !('__proto__' in obj);
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
	}


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWY1YjU2NTUyM2E2OGZiNzFkNDciLCJ3ZWJwYWNrOi8vLy4vdGVzdC90ZXN0LXV0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0TkEsaUJBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlEQUFnRCxRQUFRO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBNkIsUUFBUTtBQUNyQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InRlc3RfdXRpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNWY1YjU2NTUyM2E2OGZiNzFkNDdcbiAqKi8iLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTQgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG57XG4gIHZhciBsaWJVdGlsID0gcmVxdWlyZSgnLi4vbGliL3V0aWwnKTtcblxuICBleHBvcnRzWyd0ZXN0IHVybHMnXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgICB2YXIgYXNzZXJ0VXJsID0gZnVuY3Rpb24gKHVybCkge1xuICAgICAgYXNzZXJ0LmVxdWFsKHVybCwgbGliVXRpbC51cmxHZW5lcmF0ZShsaWJVdGlsLnVybFBhcnNlKHVybCkpKTtcbiAgICB9O1xuICAgIGFzc2VydFVybCgnaHR0cDovLycpO1xuICAgIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpO1xuICAgIGFzc2VydFVybCgnaHR0cDovL3VzZXI6cGFzc0B3d3cuZXhhbXBsZS5jb20nKTtcbiAgICBhc3NlcnRVcmwoJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb206ODAnKTtcbiAgICBhc3NlcnRVcmwoJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20vJyk7XG4gICAgYXNzZXJ0VXJsKCdodHRwOi8vd3d3LmV4YW1wbGUuY29tL2Zvby9iYXInKTtcbiAgICBhc3NlcnRVcmwoJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20vZm9vL2Jhci8nKTtcbiAgICBhc3NlcnRVcmwoJ2h0dHA6Ly91c2VyOnBhc3NAd3d3LmV4YW1wbGUuY29tOjgwL2Zvby9iYXIvJyk7XG5cbiAgICBhc3NlcnRVcmwoJy8vJyk7XG4gICAgYXNzZXJ0VXJsKCcvL3d3dy5leGFtcGxlLmNvbScpO1xuICAgIGFzc2VydFVybCgnZmlsZTovLy93d3cuZXhhbXBsZS5jb20nKTtcblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLnVybFBhcnNlKCcnKSwgbnVsbCk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJy4nKSwgbnVsbCk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJy4uJyksIG51bGwpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLnVybFBhcnNlKCdhJyksIG51bGwpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLnVybFBhcnNlKCdhL2InKSwgbnVsbCk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2EvL2InKSwgbnVsbCk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJy9hJyksIG51bGwpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLnVybFBhcnNlKCdkYXRhOmZvbyxiYXInKSwgbnVsbCk7XG4gIH07XG5cbiAgZXhwb3J0c1sndGVzdCBub3JtYWxpemUoKSddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4uJyksICcvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLi4vJyksICcvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLi4vLi4vLi4vLi4nKSwgJy8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uLi8uLi8uLi8uLi9hL2IvYycpLCAnL2EvYi9jJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvYS9iL2MvLi4vLi4vLi4vZC8uLi8uLi9lJyksICcvZScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcuLicpLCAnLi4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4uLycpLCAnLi4vJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcuLi8uLi9hLycpLCAnLi4vLi4vYS8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJ2EvLi4nKSwgJy4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJ2EvLi4vLi4vLi4nKSwgJy4uLy4uJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uJyksICcvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLi8nKSwgJy8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uLy4vLi8uJyksICcvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLi8uLy4vLi9hL2IvYycpLCAnL2EvYi9jJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvYS9iL2MvLi8uLy4vZC8uLy4vZScpLCAnL2EvYi9jL2QvZScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcnKSwgJy4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4nKSwgJy4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4vJyksICcuJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcuLy4vYScpLCAnYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnYS8uLycpLCAnYS8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJ2EvLi8uLy4nKSwgJ2EnKTtcblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnL2EvYi8vYy8vLy9kLy8vLy8nKSwgJy9hL2IvYy9kLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy8vYS9iLy9jLy8vL2QvLy8vLycpLCAnLy8vYS9iL2MvZC8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJ2EvYi8vYy8vLy9kJyksICdhL2IvYy9kJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4vLy8uLi8uLy4uL2EvYi8vLi8uLicpLCAnLi4vLi4vYScpXG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20vJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnaHR0cDovL3d3dy5leGFtcGxlLmNvbS8uLy4uLy9hL2IvYy8uLi8uL2QvLycpLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbS9hL2IvZC8nKTtcbiAgfTtcblxuICBleHBvcnRzWyd0ZXN0IGpvaW4oKSddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnYicpLCAnYS9iJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8nLCAnYicpLCAnYS9iJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8vJywgJ2InKSwgJ2EvYicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnYi8nKSwgJ2EvYi8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJ2IvLycpLCAnYS9iLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvJywgJy9iJyksICcvYicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvLycsICcvL2InKSwgJy8vYicpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICcuLicpLCAnLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnLi4vYicpLCAnYicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvYicsICcuLi9jJyksICdhL2MnKTtcblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnLicpLCAnYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnLi9iJyksICdhL2InKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhL2InLCAnLi9jJyksICdhL2IvYycpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICdkYXRhOmZvbyxiYXInKSwgJ2RhdGE6Zm9vLGJhcicpO1xuXG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnYicpLCAnYicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnYicpLCAnYicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICdiLycpLCAnYi8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJ2IvJyksICdiLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICdiLy8nKSwgJ2IvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICdiLy8nKSwgJ2IvJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnLi4nKSwgJy4uJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuLicpLCAnLi4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnLi4vYicpLCAnLi4vYicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnLi4vYicpLCAnLi4vYicpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJy4nKSwgJy4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJy4nKSwgJy4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnLi9iJyksICdiJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuL2InKSwgJ2InKTtcblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJ2RhdGE6Zm9vLGJhcicpLCAnZGF0YTpmb28sYmFyJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICdkYXRhOmZvbyxiYXInKSwgJ2RhdGE6Zm9vLGJhcicpO1xuXG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICdiJyksICcuLi9iJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnYi8nKSwgJy4uL2IvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnYi8vJyksICcuLi9iLycpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnLi4nKSwgJy4uLy4uJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnLi4vYicpLCAnLi4vLi4vYicpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnLicpLCAnLi4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICcuL2InKSwgJy4uL2InKTtcblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICdkYXRhOmZvbyxiYXInKSwgJ2RhdGE6Zm9vLGJhcicpO1xuXG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJycpLCAnYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnLicpLCAnYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvJywgJycpLCAnYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvJywgJy4nKSwgJ2EnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhLy8nLCAnJyksICdhJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8vJywgJy4nKSwgJ2EnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcvYScsICcnKSwgJy9hJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignL2EnLCAnLicpLCAnL2EnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnJyksICcuJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcnKSwgJy4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJycpLCAnLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnLicpLCAnLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJycpLCAnLi4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICcuJyksICcuLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcuJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8nLCAnJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8nLCAnLicpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvLycsICcnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hLy8nLCAnLicpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnJywgJycpLCAnaHR0cDovL2Zvby5vcmcvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcnLCAnLicpLCAnaHR0cDovL2Zvby5vcmcvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvJywgJycpLCAnaHR0cDovL2Zvby5vcmcvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvJywgJy4nKSwgJ2h0dHA6Ly9mb28ub3JnLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLy8nLCAnJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy8vJywgJy4nKSwgJ2h0dHA6Ly9mb28ub3JnLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy8vd3d3LmV4YW1wbGUuY29tJywgJycpLCAnLy93d3cuZXhhbXBsZS5jb20vJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLy93d3cuZXhhbXBsZS5jb20nLCAnLicpLCAnLy93d3cuZXhhbXBsZS5jb20vJyk7XG5cblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnYicpLCAnaHR0cDovL2Zvby5vcmcvYS9iJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8nLCAnYicpLCAnaHR0cDovL2Zvby5vcmcvYS9iJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8vJywgJ2InKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnYi8nKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYi8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJ2IvLycpLCAnaHR0cDovL2Zvby5vcmcvYS9iLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvJywgJy9iJyksICdodHRwOi8vZm9vLm9yZy9iJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8vJywgJy8vYicpLCAnaHR0cDovL2InKTtcblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnLi4nKSwgJ2h0dHA6Ly9mb28ub3JnLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnLi4vYicpLCAnaHR0cDovL2Zvby5vcmcvYicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvYicsICcuLi9jJyksICdodHRwOi8vZm9vLm9yZy9hL2MnKTtcblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnLicpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnLi9iJyksICdodHRwOi8vZm9vLm9yZy9hL2InKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hL2InLCAnLi9jJyksICdodHRwOi8vZm9vLm9yZy9hL2IvYycpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICdkYXRhOmZvbyxiYXInKSwgJ2RhdGE6Zm9vLGJhcicpO1xuXG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZycsICdhJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvJywgJ2EnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy8vJywgJ2EnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZycsICcvYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLycsICcvYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLy8nLCAnL2EnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcblxuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovLycsICd3d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdmaWxlOi8vLycsICd3d3cuZXhhbXBsZS5jb20nKSwgJ2ZpbGU6Ly8vd3d3LmV4YW1wbGUuY29tJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovLycsICdmdHA6Ly9leGFtcGxlLmNvbScpLCAnZnRwOi8vZXhhbXBsZS5jb20nKTtcblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nLCAnLy9mb28ub3JnL2JhcicpLCAnaHR0cDovL2Zvby5vcmcvYmFyJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLy93d3cuZXhhbXBsZS5jb20nLCAnLy9mb28ub3JnL2JhcicpLCAnLy9mb28ub3JnL2JhcicpO1xuICB9O1xuXG4gIC8vIFRPRE8gSXNzdWUgIzEyODogRGVmaW5lIGFuZCB0ZXN0IHRoaXMgZnVuY3Rpb24gcHJvcGVybHkuXG4gIGV4cG9ydHNbJ3Rlc3QgcmVsYXRpdmUoKSddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcvdGhlL3Jvb3QnLCAnL3RoZS9yb290L29uZS5qcycpLCAnb25lLmpzJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJ2h0dHA6Ly90aGUvcm9vdCcsICdodHRwOi8vdGhlL3Jvb3Qvb25lLmpzJyksICdvbmUuanMnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnL3RoZS9yb290JywgJy90aGUvcm9vdG9uZS5qcycpLCAnLi4vcm9vdG9uZS5qcycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCdodHRwOi8vdGhlL3Jvb3QnLCAnaHR0cDovL3RoZS9yb290b25lLmpzJyksICcuLi9yb290b25lLmpzJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy90aGUvcm9vdCcsICcvdGhlcm9vdG9uZS5qcycpLCAnL3RoZXJvb3RvbmUuanMnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnaHR0cDovL3RoZS9yb290JywgJy90aGVyb290b25lLmpzJyksICcvdGhlcm9vdG9uZS5qcycpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJycsICcvdGhlL3Jvb3Qvb25lLmpzJyksICcvdGhlL3Jvb3Qvb25lLmpzJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy4nLCAnL3RoZS9yb290L29uZS5qcycpLCAnL3RoZS9yb290L29uZS5qcycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcnLCAndGhlL3Jvb3Qvb25lLmpzJyksICd0aGUvcm9vdC9vbmUuanMnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnLicsICd0aGUvcm9vdC9vbmUuanMnKSwgJ3RoZS9yb290L29uZS5qcycpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy8nLCAnL3RoZS9yb290L29uZS5qcycpLCAndGhlL3Jvb3Qvb25lLmpzJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy8nLCAndGhlL3Jvb3Qvb25lLmpzJyksICd0aGUvcm9vdC9vbmUuanMnKTtcbiAgfTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi90ZXN0L3Rlc3QtdXRpbC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cbntcbiAgLyoqXG4gICAqIFRoaXMgaXMgYSBoZWxwZXIgZnVuY3Rpb24gZm9yIGdldHRpbmcgdmFsdWVzIGZyb20gcGFyYW1ldGVyL29wdGlvbnNcbiAgICogb2JqZWN0cy5cbiAgICpcbiAgICogQHBhcmFtIGFyZ3MgVGhlIG9iamVjdCB3ZSBhcmUgZXh0cmFjdGluZyB2YWx1ZXMgZnJvbVxuICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgd2UgYXJlIGdldHRpbmcuXG4gICAqIEBwYXJhbSBkZWZhdWx0VmFsdWUgQW4gb3B0aW9uYWwgdmFsdWUgdG8gcmV0dXJuIGlmIHRoZSBwcm9wZXJ0eSBpcyBtaXNzaW5nXG4gICAqIGZyb20gdGhlIG9iamVjdC4gSWYgdGhpcyBpcyBub3Qgc3BlY2lmaWVkIGFuZCB0aGUgcHJvcGVydHkgaXMgbWlzc2luZywgYW5cbiAgICogZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gICAqL1xuICBmdW5jdGlvbiBnZXRBcmcoYUFyZ3MsIGFOYW1lLCBhRGVmYXVsdFZhbHVlKSB7XG4gICAgaWYgKGFOYW1lIGluIGFBcmdzKSB7XG4gICAgICByZXR1cm4gYUFyZ3NbYU5hbWVdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgcmV0dXJuIGFEZWZhdWx0VmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCInICsgYU5hbWUgKyAnXCIgaXMgYSByZXF1aXJlZCBhcmd1bWVudC4nKTtcbiAgICB9XG4gIH1cbiAgZXhwb3J0cy5nZXRBcmcgPSBnZXRBcmc7XG5cbiAgdmFyIHVybFJlZ2V4cCA9IC9eKD86KFtcXHcrXFwtLl0rKTopP1xcL1xcLyg/OihcXHcrOlxcdyspQCk/KFtcXHcuXSopKD86OihcXGQrKSk/KFxcUyopJC87XG4gIHZhciBkYXRhVXJsUmVnZXhwID0gL15kYXRhOi4rXFwsLiskLztcblxuICBmdW5jdGlvbiB1cmxQYXJzZShhVXJsKSB7XG4gICAgdmFyIG1hdGNoID0gYVVybC5tYXRjaCh1cmxSZWdleHApO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc2NoZW1lOiBtYXRjaFsxXSxcbiAgICAgIGF1dGg6IG1hdGNoWzJdLFxuICAgICAgaG9zdDogbWF0Y2hbM10sXG4gICAgICBwb3J0OiBtYXRjaFs0XSxcbiAgICAgIHBhdGg6IG1hdGNoWzVdXG4gICAgfTtcbiAgfVxuICBleHBvcnRzLnVybFBhcnNlID0gdXJsUGFyc2U7XG5cbiAgZnVuY3Rpb24gdXJsR2VuZXJhdGUoYVBhcnNlZFVybCkge1xuICAgIHZhciB1cmwgPSAnJztcbiAgICBpZiAoYVBhcnNlZFVybC5zY2hlbWUpIHtcbiAgICAgIHVybCArPSBhUGFyc2VkVXJsLnNjaGVtZSArICc6JztcbiAgICB9XG4gICAgdXJsICs9ICcvLyc7XG4gICAgaWYgKGFQYXJzZWRVcmwuYXV0aCkge1xuICAgICAgdXJsICs9IGFQYXJzZWRVcmwuYXV0aCArICdAJztcbiAgICB9XG4gICAgaWYgKGFQYXJzZWRVcmwuaG9zdCkge1xuICAgICAgdXJsICs9IGFQYXJzZWRVcmwuaG9zdDtcbiAgICB9XG4gICAgaWYgKGFQYXJzZWRVcmwucG9ydCkge1xuICAgICAgdXJsICs9IFwiOlwiICsgYVBhcnNlZFVybC5wb3J0XG4gICAgfVxuICAgIGlmIChhUGFyc2VkVXJsLnBhdGgpIHtcbiAgICAgIHVybCArPSBhUGFyc2VkVXJsLnBhdGg7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgZXhwb3J0cy51cmxHZW5lcmF0ZSA9IHVybEdlbmVyYXRlO1xuXG4gIC8qKlxuICAgKiBOb3JtYWxpemVzIGEgcGF0aCwgb3IgdGhlIHBhdGggcG9ydGlvbiBvZiBhIFVSTDpcbiAgICpcbiAgICogLSBSZXBsYWNlcyBjb25zZXF1dGl2ZSBzbGFzaGVzIHdpdGggb25lIHNsYXNoLlxuICAgKiAtIFJlbW92ZXMgdW5uZWNlc3NhcnkgJy4nIHBhcnRzLlxuICAgKiAtIFJlbW92ZXMgdW5uZWNlc3NhcnkgJzxkaXI+Ly4uJyBwYXJ0cy5cbiAgICpcbiAgICogQmFzZWQgb24gY29kZSBpbiB0aGUgTm9kZS5qcyAncGF0aCcgY29yZSBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciB1cmwgdG8gbm9ybWFsaXplLlxuICAgKi9cbiAgZnVuY3Rpb24gbm9ybWFsaXplKGFQYXRoKSB7XG4gICAgdmFyIHBhdGggPSBhUGF0aDtcbiAgICB2YXIgdXJsID0gdXJsUGFyc2UoYVBhdGgpO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIGlmICghdXJsLnBhdGgpIHtcbiAgICAgICAgcmV0dXJuIGFQYXRoO1xuICAgICAgfVxuICAgICAgcGF0aCA9IHVybC5wYXRoO1xuICAgIH1cbiAgICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKTtcblxuICAgIHZhciBwYXJ0cyA9IHBhdGguc3BsaXQoL1xcLysvKTtcbiAgICBmb3IgKHZhciBwYXJ0LCB1cCA9IDAsIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgcGFydCA9IHBhcnRzW2ldO1xuICAgICAgaWYgKHBhcnQgPT09ICcuJykge1xuICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB9IGVsc2UgaWYgKHBhcnQgPT09ICcuLicpIHtcbiAgICAgICAgdXArKztcbiAgICAgIH0gZWxzZSBpZiAodXAgPiAwKSB7XG4gICAgICAgIGlmIChwYXJ0ID09PSAnJykge1xuICAgICAgICAgIC8vIFRoZSBmaXJzdCBwYXJ0IGlzIGJsYW5rIGlmIHRoZSBwYXRoIGlzIGFic29sdXRlLiBUcnlpbmcgdG8gZ29cbiAgICAgICAgICAvLyBhYm92ZSB0aGUgcm9vdCBpcyBhIG5vLW9wLiBUaGVyZWZvcmUgd2UgY2FuIHJlbW92ZSBhbGwgJy4uJyBwYXJ0c1xuICAgICAgICAgIC8vIGRpcmVjdGx5IGFmdGVyIHRoZSByb290LlxuICAgICAgICAgIHBhcnRzLnNwbGljZShpICsgMSwgdXApO1xuICAgICAgICAgIHVwID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMik7XG4gICAgICAgICAgdXAtLTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBwYXRoID0gcGFydHMuam9pbignLycpO1xuXG4gICAgaWYgKHBhdGggPT09ICcnKSB7XG4gICAgICBwYXRoID0gaXNBYnNvbHV0ZSA/ICcvJyA6ICcuJztcbiAgICB9XG5cbiAgICBpZiAodXJsKSB7XG4gICAgICB1cmwucGF0aCA9IHBhdGg7XG4gICAgICByZXR1cm4gdXJsR2VuZXJhdGUodXJsKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cbiAgZXhwb3J0cy5ub3JtYWxpemUgPSBub3JtYWxpemU7XG5cbiAgLyoqXG4gICAqIEpvaW5zIHR3byBwYXRocy9VUkxzLlxuICAgKlxuICAgKiBAcGFyYW0gYVJvb3QgVGhlIHJvb3QgcGF0aCBvciBVUkwuXG4gICAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciBVUkwgdG8gYmUgam9pbmVkIHdpdGggdGhlIHJvb3QuXG4gICAqXG4gICAqIC0gSWYgYVBhdGggaXMgYSBVUkwgb3IgYSBkYXRhIFVSSSwgYVBhdGggaXMgcmV0dXJuZWQsIHVubGVzcyBhUGF0aCBpcyBhXG4gICAqICAgc2NoZW1lLXJlbGF0aXZlIFVSTDogVGhlbiB0aGUgc2NoZW1lIG9mIGFSb290LCBpZiBhbnksIGlzIHByZXBlbmRlZFxuICAgKiAgIGZpcnN0LlxuICAgKiAtIE90aGVyd2lzZSBhUGF0aCBpcyBhIHBhdGguIElmIGFSb290IGlzIGEgVVJMLCB0aGVuIGl0cyBwYXRoIHBvcnRpb25cbiAgICogICBpcyB1cGRhdGVkIHdpdGggdGhlIHJlc3VsdCBhbmQgYVJvb3QgaXMgcmV0dXJuZWQuIE90aGVyd2lzZSB0aGUgcmVzdWx0XG4gICAqICAgaXMgcmV0dXJuZWQuXG4gICAqICAgLSBJZiBhUGF0aCBpcyBhYnNvbHV0ZSwgdGhlIHJlc3VsdCBpcyBhUGF0aC5cbiAgICogICAtIE90aGVyd2lzZSB0aGUgdHdvIHBhdGhzIGFyZSBqb2luZWQgd2l0aCBhIHNsYXNoLlxuICAgKiAtIEpvaW5pbmcgZm9yIGV4YW1wbGUgJ2h0dHA6Ly8nIGFuZCAnd3d3LmV4YW1wbGUuY29tJyBpcyBhbHNvIHN1cHBvcnRlZC5cbiAgICovXG4gIGZ1bmN0aW9uIGpvaW4oYVJvb3QsIGFQYXRoKSB7XG4gICAgaWYgKGFSb290ID09PSBcIlwiKSB7XG4gICAgICBhUm9vdCA9IFwiLlwiO1xuICAgIH1cbiAgICBpZiAoYVBhdGggPT09IFwiXCIpIHtcbiAgICAgIGFQYXRoID0gXCIuXCI7XG4gICAgfVxuICAgIHZhciBhUGF0aFVybCA9IHVybFBhcnNlKGFQYXRoKTtcbiAgICB2YXIgYVJvb3RVcmwgPSB1cmxQYXJzZShhUm9vdCk7XG4gICAgaWYgKGFSb290VXJsKSB7XG4gICAgICBhUm9vdCA9IGFSb290VXJsLnBhdGggfHwgJy8nO1xuICAgIH1cblxuICAgIC8vIGBqb2luKGZvbywgJy8vd3d3LmV4YW1wbGUub3JnJylgXG4gICAgaWYgKGFQYXRoVXJsICYmICFhUGF0aFVybC5zY2hlbWUpIHtcbiAgICAgIGlmIChhUm9vdFVybCkge1xuICAgICAgICBhUGF0aFVybC5zY2hlbWUgPSBhUm9vdFVybC5zY2hlbWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdXJsR2VuZXJhdGUoYVBhdGhVcmwpO1xuICAgIH1cblxuICAgIGlmIChhUGF0aFVybCB8fCBhUGF0aC5tYXRjaChkYXRhVXJsUmVnZXhwKSkge1xuICAgICAgcmV0dXJuIGFQYXRoO1xuICAgIH1cblxuICAgIC8vIGBqb2luKCdodHRwOi8vJywgJ3d3dy5leGFtcGxlLmNvbScpYFxuICAgIGlmIChhUm9vdFVybCAmJiAhYVJvb3RVcmwuaG9zdCAmJiAhYVJvb3RVcmwucGF0aCkge1xuICAgICAgYVJvb3RVcmwuaG9zdCA9IGFQYXRoO1xuICAgICAgcmV0dXJuIHVybEdlbmVyYXRlKGFSb290VXJsKTtcbiAgICB9XG5cbiAgICB2YXIgam9pbmVkID0gYVBhdGguY2hhckF0KDApID09PSAnLydcbiAgICAgID8gYVBhdGhcbiAgICAgIDogbm9ybWFsaXplKGFSb290LnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgYVBhdGgpO1xuXG4gICAgaWYgKGFSb290VXJsKSB7XG4gICAgICBhUm9vdFVybC5wYXRoID0gam9pbmVkO1xuICAgICAgcmV0dXJuIHVybEdlbmVyYXRlKGFSb290VXJsKTtcbiAgICB9XG4gICAgcmV0dXJuIGpvaW5lZDtcbiAgfVxuICBleHBvcnRzLmpvaW4gPSBqb2luO1xuXG4gIGV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uIChhUGF0aCkge1xuICAgIHJldHVybiBhUGF0aC5jaGFyQXQoMCkgPT09ICcvJyB8fCAhIWFQYXRoLm1hdGNoKHVybFJlZ2V4cCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIE1ha2UgYSBwYXRoIHJlbGF0aXZlIHRvIGEgVVJMIG9yIGFub3RoZXIgcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIGFSb290IFRoZSByb290IHBhdGggb3IgVVJMLlxuICAgKiBAcGFyYW0gYVBhdGggVGhlIHBhdGggb3IgVVJMIHRvIGJlIG1hZGUgcmVsYXRpdmUgdG8gYVJvb3QuXG4gICAqL1xuICBmdW5jdGlvbiByZWxhdGl2ZShhUm9vdCwgYVBhdGgpIHtcbiAgICBpZiAoYVJvb3QgPT09IFwiXCIpIHtcbiAgICAgIGFSb290ID0gXCIuXCI7XG4gICAgfVxuXG4gICAgYVJvb3QgPSBhUm9vdC5yZXBsYWNlKC9cXC8kLywgJycpO1xuXG4gICAgLy8gSXQgaXMgcG9zc2libGUgZm9yIHRoZSBwYXRoIHRvIGJlIGFib3ZlIHRoZSByb290LiBJbiB0aGlzIGNhc2UsIHNpbXBseVxuICAgIC8vIGNoZWNraW5nIHdoZXRoZXIgdGhlIHJvb3QgaXMgYSBwcmVmaXggb2YgdGhlIHBhdGggd29uJ3Qgd29yay4gSW5zdGVhZCwgd2VcbiAgICAvLyBuZWVkIHRvIHJlbW92ZSBjb21wb25lbnRzIGZyb20gdGhlIHJvb3Qgb25lIGJ5IG9uZSwgdW50aWwgZWl0aGVyIHdlIGZpbmRcbiAgICAvLyBhIHByZWZpeCB0aGF0IGZpdHMsIG9yIHdlIHJ1biBvdXQgb2YgY29tcG9uZW50cyB0byByZW1vdmUuXG4gICAgdmFyIGxldmVsID0gMDtcbiAgICB3aGlsZSAoYVBhdGguaW5kZXhPZihhUm9vdCArICcvJykgIT09IDApIHtcbiAgICAgIHZhciBpbmRleCA9IGFSb290Lmxhc3RJbmRleE9mKFwiL1wiKTtcbiAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgcmV0dXJuIGFQYXRoO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgb25seSBwYXJ0IG9mIHRoZSByb290IHRoYXQgaXMgbGVmdCBpcyB0aGUgc2NoZW1lIChpLmUuIGh0dHA6Ly8sXG4gICAgICAvLyBmaWxlOi8vLywgZXRjLiksIG9uZSBvciBtb3JlIHNsYXNoZXMgKC8pLCBvciBzaW1wbHkgbm90aGluZyBhdCBhbGwsIHdlXG4gICAgICAvLyBoYXZlIGV4aGF1c3RlZCBhbGwgY29tcG9uZW50cywgc28gdGhlIHBhdGggaXMgbm90IHJlbGF0aXZlIHRvIHRoZSByb290LlxuICAgICAgYVJvb3QgPSBhUm9vdC5zbGljZSgwLCBpbmRleCk7XG4gICAgICBpZiAoYVJvb3QubWF0Y2goL14oW15cXC9dKzpcXC8pP1xcLyokLykpIHtcbiAgICAgICAgcmV0dXJuIGFQYXRoO1xuICAgICAgfVxuXG4gICAgICArK2xldmVsO1xuICAgIH1cblxuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhZGQgYSBcIi4uL1wiIGZvciBlYWNoIGNvbXBvbmVudCB3ZSByZW1vdmVkIGZyb20gdGhlIHJvb3QuXG4gICAgcmV0dXJuIEFycmF5KGxldmVsICsgMSkuam9pbihcIi4uL1wiKSArIGFQYXRoLnN1YnN0cihhUm9vdC5sZW5ndGggKyAxKTtcbiAgfVxuICBleHBvcnRzLnJlbGF0aXZlID0gcmVsYXRpdmU7XG5cbiAgLyoqXG4gICAqIEJlY2F1c2UgYmVoYXZpb3IgZ29lcyB3YWNreSB3aGVuIHlvdSBzZXQgYF9fcHJvdG9fX2Agb24gb2JqZWN0cywgd2VcbiAgICogaGF2ZSB0byBwcmVmaXggYWxsIHRoZSBzdHJpbmdzIGluIG91ciBzZXQgd2l0aCBhbiBhcmJpdHJhcnkgY2hhcmFjdGVyLlxuICAgKlxuICAgKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvc291cmNlLW1hcC9wdWxsLzMxIGFuZFxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL2lzc3Vlcy8zMFxuICAgKlxuICAgKiBAcGFyYW0gU3RyaW5nIGFTdHJcbiAgICovXG5cbiAgZnVuY3Rpb24gdG9TZXRTdHJpbmcoYVN0cikge1xuICAgIGlmIChpc1Byb3RvU3RyaW5nKGFTdHIpKSB7XG4gICAgICByZXR1cm4gJyQnICsgYVN0cjtcbiAgICB9XG5cbiAgICByZXR1cm4gYVN0cjtcbiAgfVxuICBleHBvcnRzLnRvU2V0U3RyaW5nID0gc3VwcG9ydHNOdWxsUHJvdG8oKSA/IGlkZW50aXR5IDogdG9TZXRTdHJpbmc7XG4gICBmdW5jdGlvbiBmcm9tU2V0U3RyaW5nKGFTdHIpIHtcbiAgICBpZiAoaXNQcm90b1N0cmluZyhhU3RyKSkge1xuICAgICAgcmV0dXJuIGFTdHIuc3Vic3RyKDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhU3RyO1xuICB9XG4gIGV4cG9ydHMuZnJvbVNldFN0cmluZyA9IHN1cHBvcnRzTnVsbFByb3RvKCkgPyBpZGVudGl0eSA6IGZyb21TZXRTdHJpbmc7XG5cbiAgZnVuY3Rpb24gaXNQcm90b1N0cmluZyhzKSB7XG4gICAgaWYgKCFzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGxlbmd0aCA9IHMubGVuZ3RoO1xuXG4gICAgaWYgKGxlbmd0aCA8IDkgLyogXCJfX3Byb3RvX19cIi5sZW5ndGggKi8pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocy5jaGFyQ29kZUF0KGxlbmd0aCAtIDEpICE9PSA5NSAgLyogJ18nICovIHx8XG4gICAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSAyKSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gMykgIT09IDExMSAvKiAnbycgKi8gfHxcbiAgICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDQpICE9PSAxMTYgLyogJ3QnICovIHx8XG4gICAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA1KSAhPT0gMTExIC8qICdvJyAqLyB8fFxuICAgICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNikgIT09IDExNCAvKiAncicgKi8gfHxcbiAgICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDcpICE9PSAxMTIgLyogJ3AnICovIHx8XG4gICAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA4KSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gOSkgIT09IDk1ICAvKiAnXycgKi8pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gbGVuZ3RoIC0gMTA7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAocy5jaGFyQ29kZUF0KGkpICE9PSAzNiAvKiAnJCcgKi8pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gaWRlbnRpdHkgKHMpIHtcbiAgICByZXR1cm4gcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHN1cHBvcnRzTnVsbFByb3RvKCkge1xuICAgIHZhciBvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHJldHVybiAhKCdfX3Byb3RvX18nIGluIG9iaik7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyYXRvciBiZXR3ZWVuIHR3byBtYXBwaW5ncyB3aGVyZSB0aGUgb3JpZ2luYWwgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAgICpcbiAgICogT3B0aW9uYWxseSBwYXNzIGluIGB0cnVlYCBhcyBgb25seUNvbXBhcmVHZW5lcmF0ZWRgIHRvIGNvbnNpZGVyIHR3b1xuICAgKiBtYXBwaW5ncyB3aXRoIHRoZSBzYW1lIG9yaWdpbmFsIHNvdXJjZS9saW5lL2NvbHVtbiwgYnV0IGRpZmZlcmVudCBnZW5lcmF0ZWRcbiAgICogbGluZSBhbmQgY29sdW1uIHRoZSBzYW1lLiBVc2VmdWwgd2hlbiBzZWFyY2hpbmcgZm9yIGEgbWFwcGluZyB3aXRoIGFcbiAgICogc3R1YmJlZCBvdXQgbWFwcGluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKG1hcHBpbmdBLCBtYXBwaW5nQiwgb25seUNvbXBhcmVPcmlnaW5hbCkge1xuICAgIHZhciBjbXAgPSBtYXBwaW5nQS5zb3VyY2UgLSBtYXBwaW5nQi5zb3VyY2U7XG4gICAgaWYgKGNtcCAhPT0gMCkge1xuICAgICAgcmV0dXJuIGNtcDtcbiAgICB9XG5cbiAgICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbExpbmUgLSBtYXBwaW5nQi5vcmlnaW5hbExpbmU7XG4gICAgaWYgKGNtcCAhPT0gMCkge1xuICAgICAgcmV0dXJuIGNtcDtcbiAgICB9XG5cbiAgICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICAgIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVPcmlnaW5hbCkge1xuICAgICAgcmV0dXJuIGNtcDtcbiAgICB9XG5cbiAgICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gICAgaWYgKGNtcCAhPT0gMCkge1xuICAgICAgcmV0dXJuIGNtcDtcbiAgICB9XG5cbiAgICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lIC0gbWFwcGluZ0IuZ2VuZXJhdGVkTGluZTtcbiAgICBpZiAoY21wICE9PSAwKSB7XG4gICAgICByZXR1cm4gY21wO1xuICAgIH1cblxuICAgIHJldHVybiBtYXBwaW5nQS5uYW1lIC0gbWFwcGluZ0IubmFtZTtcbiAgfVxuICBleHBvcnRzLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zID0gY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnM7XG5cbiAgLyoqXG4gICAqIENvbXBhcmF0b3IgYmV0d2VlbiB0d28gbWFwcGluZ3Mgd2l0aCBkZWZsYXRlZCBzb3VyY2UgYW5kIG5hbWUgaW5kaWNlcyB3aGVyZVxuICAgKiB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9ucyBhcmUgY29tcGFyZWQuXG4gICAqXG4gICAqIE9wdGlvbmFsbHkgcGFzcyBpbiBgdHJ1ZWAgYXMgYG9ubHlDb21wYXJlR2VuZXJhdGVkYCB0byBjb25zaWRlciB0d29cbiAgICogbWFwcGluZ3Mgd2l0aCB0aGUgc2FtZSBnZW5lcmF0ZWQgbGluZSBhbmQgY29sdW1uLCBidXQgZGlmZmVyZW50XG4gICAqIHNvdXJjZS9uYW1lL29yaWdpbmFsIGxpbmUgYW5kIGNvbHVtbiB0aGUgc2FtZS4gVXNlZnVsIHdoZW4gc2VhcmNoaW5nIGZvciBhXG4gICAqIG1hcHBpbmcgd2l0aCBhIHN0dWJiZWQgb3V0IG1hcHBpbmcuXG4gICAqL1xuICBmdW5jdGlvbiBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IsIG9ubHlDb21wYXJlR2VuZXJhdGVkKSB7XG4gICAgdmFyIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICAgIGlmIChjbXAgIT09IDApIHtcbiAgICAgIHJldHVybiBjbXA7XG4gICAgfVxuXG4gICAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICAgIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVHZW5lcmF0ZWQpIHtcbiAgICAgIHJldHVybiBjbXA7XG4gICAgfVxuXG4gICAgY21wID0gbWFwcGluZ0Euc291cmNlIC0gbWFwcGluZ0Iuc291cmNlO1xuICAgIGlmIChjbXAgIT09IDApIHtcbiAgICAgIHJldHVybiBjbXA7XG4gICAgfVxuXG4gICAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICAgIGlmIChjbXAgIT09IDApIHtcbiAgICAgIHJldHVybiBjbXA7XG4gICAgfVxuXG4gICAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxDb2x1bW4gLSBtYXBwaW5nQi5vcmlnaW5hbENvbHVtbjtcbiAgICBpZiAoY21wICE9PSAwKSB7XG4gICAgICByZXR1cm4gY21wO1xuICAgIH1cblxuICAgIHJldHVybiBtYXBwaW5nQS5uYW1lIC0gbWFwcGluZ0IubmFtZTtcbiAgfVxuICBleHBvcnRzLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkID0gY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQ7XG5cbiAgZnVuY3Rpb24gc3RyY21wKGFTdHIxLCBhU3RyMikge1xuICAgIGlmIChhU3RyMSA9PT0gYVN0cjIpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGlmIChhU3RyMSA+IGFTdHIyKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyYXRvciBiZXR3ZWVuIHR3byBtYXBwaW5ncyB3aXRoIGluZmxhdGVkIHNvdXJjZSBhbmQgbmFtZSBzdHJpbmdzIHdoZXJlXG4gICAqIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkKG1hcHBpbmdBLCBtYXBwaW5nQikge1xuICAgIHZhciBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lIC0gbWFwcGluZ0IuZ2VuZXJhdGVkTGluZTtcbiAgICBpZiAoY21wICE9PSAwKSB7XG4gICAgICByZXR1cm4gY21wO1xuICAgIH1cblxuICAgIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZENvbHVtbiAtIG1hcHBpbmdCLmdlbmVyYXRlZENvbHVtbjtcbiAgICBpZiAoY21wICE9PSAwKSB7XG4gICAgICByZXR1cm4gY21wO1xuICAgIH1cblxuICAgIGNtcCA9IHN0cmNtcChtYXBwaW5nQS5zb3VyY2UsIG1hcHBpbmdCLnNvdXJjZSk7XG4gICAgaWYgKGNtcCAhPT0gMCkge1xuICAgICAgcmV0dXJuIGNtcDtcbiAgICB9XG5cbiAgICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbExpbmUgLSBtYXBwaW5nQi5vcmlnaW5hbExpbmU7XG4gICAgaWYgKGNtcCAhPT0gMCkge1xuICAgICAgcmV0dXJuIGNtcDtcbiAgICB9XG5cbiAgICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICAgIGlmIChjbXAgIT09IDApIHtcbiAgICAgIHJldHVybiBjbXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmNtcChtYXBwaW5nQS5uYW1lLCBtYXBwaW5nQi5uYW1lKTtcbiAgfVxuICBleHBvcnRzLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkID0gY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQ7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vbGliL3V0aWwuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9