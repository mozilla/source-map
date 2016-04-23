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
	
	  var supportsNullProto = (function () {
	    var obj = Object.create(null);
	    return !('__proto__' in obj);
	  })();
	
	  function toSetString(aStr) {
	    if (isProtoString(aStr)) {
	      return '$' + aStr;
	    }
	
	    return aStr;
	  }
	  exports.toSetString = supportsNullProto ? identity : toSetString;
	   function fromSetString(aStr) {
	    if (isProtoString(aStr)) {
	      return aStr.substr(1);
	    }
	
	    return aStr;
	  }
	  exports.fromSetString = supportsNullProto ? identity : fromSetString;
	
	  function identity (s) {
	    return s;
	  }
	
	  function isProtoString(s) {
	    if (typeof s !== 'string') {
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
	}


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDY0NjRhM2I2YTljZmJiOThjYWYiLCJ3ZWJwYWNrOi8vLy4vdGVzdC90ZXN0LXV0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0TkEsaUJBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlEQUFnRCxRQUFRO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBNkIsUUFBUTtBQUNyQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidGVzdF91dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBkNjQ2NGEzYjZhOWNmYmI5OGNhZlxuICoqLyIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxNCBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cbntcbiAgdmFyIGxpYlV0aWwgPSByZXF1aXJlKCcuLi9saWIvdXRpbCcpO1xuXG4gIGV4cG9ydHNbJ3Rlc3QgdXJscyddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICAgIHZhciBhc3NlcnRVcmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICBhc3NlcnQuZXF1YWwodXJsLCBsaWJVdGlsLnVybEdlbmVyYXRlKGxpYlV0aWwudXJsUGFyc2UodXJsKSkpO1xuICAgIH07XG4gICAgYXNzZXJ0VXJsKCdodHRwOi8vJyk7XG4gICAgYXNzZXJ0VXJsKCdodHRwOi8vd3d3LmV4YW1wbGUuY29tJyk7XG4gICAgYXNzZXJ0VXJsKCdodHRwOi8vdXNlcjpwYXNzQHd3dy5leGFtcGxlLmNvbScpO1xuICAgIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbTo4MCcpO1xuICAgIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbS8nKTtcbiAgICBhc3NlcnRVcmwoJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20vZm9vL2JhcicpO1xuICAgIGFzc2VydFVybCgnaHR0cDovL3d3dy5leGFtcGxlLmNvbS9mb28vYmFyLycpO1xuICAgIGFzc2VydFVybCgnaHR0cDovL3VzZXI6cGFzc0B3d3cuZXhhbXBsZS5jb206ODAvZm9vL2Jhci8nKTtcblxuICAgIGFzc2VydFVybCgnLy8nKTtcbiAgICBhc3NlcnRVcmwoJy8vd3d3LmV4YW1wbGUuY29tJyk7XG4gICAgYXNzZXJ0VXJsKCdmaWxlOi8vL3d3dy5leGFtcGxlLmNvbScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJycpLCBudWxsKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnLicpLCBudWxsKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnLi4nKSwgbnVsbCk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2EnKSwgbnVsbCk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2EvYicpLCBudWxsKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnYS8vYicpLCBudWxsKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC51cmxQYXJzZSgnL2EnKSwgbnVsbCk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwudXJsUGFyc2UoJ2RhdGE6Zm9vLGJhcicpLCBudWxsKTtcbiAgfTtcblxuICBleHBvcnRzWyd0ZXN0IG5vcm1hbGl6ZSgpJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLi4nKSwgJy8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uLi8nKSwgJy8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uLi8uLi8uLi8uLicpLCAnLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4uLy4uLy4uLy4uL2EvYi9jJyksICcvYS9iL2MnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy9hL2IvYy8uLi8uLi8uLi9kLy4uLy4uL2UnKSwgJy9lJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4uJyksICcuLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLi4vJyksICcuLi8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4uLy4uL2EvJyksICcuLi8uLi9hLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnYS8uLicpLCAnLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnYS8uLi8uLi8uLicpLCAnLi4vLi4nKTtcblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4nKSwgJy8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uLycpLCAnLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLy4vLi8uLy4nKSwgJy8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy8uLy4vLi8uL2EvYi9jJyksICcvYS9iL2MnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy9hL2IvYy8uLy4vLi9kLy4vLi9lJyksICcvYS9iL2MvZC9lJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJycpLCAnLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLicpLCAnLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLi8nKSwgJy4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5ub3JtYWxpemUoJy4vLi9hJyksICdhJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdhLy4vJyksICdhLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnYS8uLy4vLicpLCAnYScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvYS9iLy9jLy8vL2QvLy8vLycpLCAnL2EvYi9jL2QvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCcvLy9hL2IvL2MvLy8vZC8vLy8vJyksICcvLy9hL2IvYy9kLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnYS9iLy9jLy8vL2QnKSwgJ2EvYi9jL2QnKTtcblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnLi8vLy4uLy4vLi4vYS9iLy8uLy4uJyksICcuLi8uLi9hJylcblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLm5vcm1hbGl6ZSgnaHR0cDovL3d3dy5leGFtcGxlLmNvbS8nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20vJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwubm9ybWFsaXplKCdodHRwOi8vd3d3LmV4YW1wbGUuY29tLy4vLi4vL2EvYi9jLy4uLy4vZC8vJyksICdodHRwOi8vd3d3LmV4YW1wbGUuY29tL2EvYi9kLycpO1xuICB9O1xuXG4gIGV4cG9ydHNbJ3Rlc3Qgam9pbigpJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICdiJyksICdhL2InKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhLycsICdiJyksICdhL2InKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhLy8nLCAnYicpLCAnYS9iJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICdiLycpLCAnYS9iLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnYi8vJyksICdhL2IvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8nLCAnL2InKSwgJy9iJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8vJywgJy8vYicpLCAnLy9iJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJy4uJyksICcuJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICcuLi9iJyksICdiJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS9iJywgJy4uL2MnKSwgJ2EvYycpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICcuJyksICdhJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICcuL2InKSwgJ2EvYicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvYicsICcuL2MnKSwgJ2EvYi9jJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhJywgJ2RhdGE6Zm9vLGJhcicpLCAnZGF0YTpmb28sYmFyJyk7XG5cblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICdiJyksICdiJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICdiJyksICdiJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJ2IvJyksICdiLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnYi8nKSwgJ2IvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJ2IvLycpLCAnYi8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJ2IvLycpLCAnYi8nKTtcblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICcuLicpLCAnLi4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJy4uJyksICcuLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICcuLi9iJyksICcuLi9iJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuLi9iJyksICcuLi9iJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnLicpLCAnLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnLicpLCAnLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICcuL2InKSwgJ2InKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJy4vYicpLCAnYicpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignJywgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcnLCAnZGF0YTpmb28sYmFyJyksICdkYXRhOmZvbyxiYXInKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJ2RhdGE6Zm9vLGJhcicpLCAnZGF0YTpmb28sYmFyJyk7XG5cblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJ2InKSwgJy4uL2InKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICdiLycpLCAnLi4vYi8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICdiLy8nKSwgJy4uL2IvJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICcuLicpLCAnLi4vLi4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICcuLi9iJyksICcuLi8uLi9iJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuLicsICcuJyksICcuLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJy4vYicpLCAnLi4vYicpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJ2RhdGE6Zm9vLGJhcicpLCAnZGF0YTpmb28sYmFyJyk7XG5cblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EnLCAnJyksICdhJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYScsICcuJyksICdhJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8nLCAnJyksICdhJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignYS8nLCAnLicpLCAnYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2EvLycsICcnKSwgJ2EnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdhLy8nLCAnLicpLCAnYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy9hJywgJycpLCAnL2EnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcvYScsICcuJyksICcvYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJycsICcnKSwgJy4nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcuJywgJycpLCAnLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4nLCAnJyksICcuJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLicsICcuJyksICcuJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLi4nLCAnJyksICcuLicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJy4uJywgJy4nKSwgJy4uJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJy4nKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hLycsICcnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hLycsICcuJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8vJywgJycpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvLycsICcuJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcnLCAnJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZycsICcuJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy8nLCAnJyksICdodHRwOi8vZm9vLm9yZy8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy8nLCAnLicpLCAnaHR0cDovL2Zvby5vcmcvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvLycsICcnKSwgJ2h0dHA6Ly9mb28ub3JnLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLy8nLCAnLicpLCAnaHR0cDovL2Zvby5vcmcvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignLy93d3cuZXhhbXBsZS5jb20nLCAnJyksICcvL3d3dy5leGFtcGxlLmNvbS8nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcvL3d3dy5leGFtcGxlLmNvbScsICcuJyksICcvL3d3dy5leGFtcGxlLmNvbS8nKTtcblxuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICdiJyksICdodHRwOi8vZm9vLm9yZy9hL2InKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hLycsICdiJyksICdodHRwOi8vZm9vLm9yZy9hL2InKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hLy8nLCAnYicpLCAnaHR0cDovL2Zvby5vcmcvYS9iJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICdiLycpLCAnaHR0cDovL2Zvby5vcmcvYS9iLycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EnLCAnYi8vJyksICdodHRwOi8vZm9vLm9yZy9hL2IvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS8nLCAnL2InKSwgJ2h0dHA6Ly9mb28ub3JnL2InKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hLy8nLCAnLy9iJyksICdodHRwOi8vYicpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcuLicpLCAnaHR0cDovL2Zvby5vcmcvJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcuLi9iJyksICdodHRwOi8vZm9vLm9yZy9iJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYS9iJywgJy4uL2MnKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYycpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcuJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvYScsICcuL2InKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYicpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnL2EvYicsICcuL2MnKSwgJ2h0dHA6Ly9mb28ub3JnL2EvYi9jJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKSwgJ2h0dHA6Ly93d3cuZXhhbXBsZS5jb20nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy9hJywgJ2RhdGE6Zm9vLGJhcicpLCAnZGF0YTpmb28sYmFyJyk7XG5cblxuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnJywgJ2EnKSwgJ2h0dHA6Ly9mb28ub3JnL2EnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vZm9vLm9yZy8nLCAnYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnLy8nLCAnYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2h0dHA6Ly9mb28ub3JnJywgJy9hJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvJywgJy9hJyksICdodHRwOi8vZm9vLm9yZy9hJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL2Zvby5vcmcvLycsICcvYScpLCAnaHR0cDovL2Zvby5vcmcvYScpO1xuXG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vJywgJ3d3dy5leGFtcGxlLmNvbScpLCAnaHR0cDovL3d3dy5leGFtcGxlLmNvbScpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLmpvaW4oJ2ZpbGU6Ly8vJywgJ3d3dy5leGFtcGxlLmNvbScpLCAnZmlsZTovLy93d3cuZXhhbXBsZS5jb20nKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCdodHRwOi8vJywgJ2Z0cDovL2V4YW1wbGUuY29tJyksICdmdHA6Ly9leGFtcGxlLmNvbScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwuam9pbignaHR0cDovL3d3dy5leGFtcGxlLmNvbScsICcvL2Zvby5vcmcvYmFyJyksICdodHRwOi8vZm9vLm9yZy9iYXInKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5qb2luKCcvL3d3dy5leGFtcGxlLmNvbScsICcvL2Zvby5vcmcvYmFyJyksICcvL2Zvby5vcmcvYmFyJyk7XG4gIH07XG5cbiAgLy8gVE9ETyBJc3N1ZSAjMTI4OiBEZWZpbmUgYW5kIHRlc3QgdGhpcyBmdW5jdGlvbiBwcm9wZXJseS5cbiAgZXhwb3J0c1sndGVzdCByZWxhdGl2ZSgpJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJy90aGUvcm9vdCcsICcvdGhlL3Jvb3Qvb25lLmpzJyksICdvbmUuanMnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnaHR0cDovL3RoZS9yb290JywgJ2h0dHA6Ly90aGUvcm9vdC9vbmUuanMnKSwgJ29uZS5qcycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcvdGhlL3Jvb3QnLCAnL3RoZS9yb290b25lLmpzJyksICcuLi9yb290b25lLmpzJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJ2h0dHA6Ly90aGUvcm9vdCcsICdodHRwOi8vdGhlL3Jvb3RvbmUuanMnKSwgJy4uL3Jvb3RvbmUuanMnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnL3RoZS9yb290JywgJy90aGVyb290b25lLmpzJyksICcvdGhlcm9vdG9uZS5qcycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCdodHRwOi8vdGhlL3Jvb3QnLCAnL3RoZXJvb3RvbmUuanMnKSwgJy90aGVyb290b25lLmpzJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnJywgJy90aGUvcm9vdC9vbmUuanMnKSwgJy90aGUvcm9vdC9vbmUuanMnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnLicsICcvdGhlL3Jvb3Qvb25lLmpzJyksICcvdGhlL3Jvb3Qvb25lLmpzJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGxpYlV0aWwucmVsYXRpdmUoJycsICd0aGUvcm9vdC9vbmUuanMnKSwgJ3RoZS9yb290L29uZS5qcycpO1xuICAgIGFzc2VydC5lcXVhbChsaWJVdGlsLnJlbGF0aXZlKCcuJywgJ3RoZS9yb290L29uZS5qcycpLCAndGhlL3Jvb3Qvb25lLmpzJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnLycsICcvdGhlL3Jvb3Qvb25lLmpzJyksICd0aGUvcm9vdC9vbmUuanMnKTtcbiAgICBhc3NlcnQuZXF1YWwobGliVXRpbC5yZWxhdGl2ZSgnLycsICd0aGUvcm9vdC9vbmUuanMnKSwgJ3RoZS9yb290L29uZS5qcycpO1xuICB9O1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3Rlc3QvdGVzdC11dGlsLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xue1xuICAvKipcbiAgICogVGhpcyBpcyBhIGhlbHBlciBmdW5jdGlvbiBmb3IgZ2V0dGluZyB2YWx1ZXMgZnJvbSBwYXJhbWV0ZXIvb3B0aW9uc1xuICAgKiBvYmplY3RzLlxuICAgKlxuICAgKiBAcGFyYW0gYXJncyBUaGUgb2JqZWN0IHdlIGFyZSBleHRyYWN0aW5nIHZhbHVlcyBmcm9tXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB3ZSBhcmUgZ2V0dGluZy5cbiAgICogQHBhcmFtIGRlZmF1bHRWYWx1ZSBBbiBvcHRpb25hbCB2YWx1ZSB0byByZXR1cm4gaWYgdGhlIHByb3BlcnR5IGlzIG1pc3NpbmdcbiAgICogZnJvbSB0aGUgb2JqZWN0LiBJZiB0aGlzIGlzIG5vdCBzcGVjaWZpZWQgYW5kIHRoZSBwcm9wZXJ0eSBpcyBtaXNzaW5nLCBhblxuICAgKiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAgICovXG4gIGZ1bmN0aW9uIGdldEFyZyhhQXJncywgYU5hbWUsIGFEZWZhdWx0VmFsdWUpIHtcbiAgICBpZiAoYU5hbWUgaW4gYUFyZ3MpIHtcbiAgICAgIHJldHVybiBhQXJnc1thTmFtZV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICByZXR1cm4gYURlZmF1bHRWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBhTmFtZSArICdcIiBpcyBhIHJlcXVpcmVkIGFyZ3VtZW50LicpO1xuICAgIH1cbiAgfVxuICBleHBvcnRzLmdldEFyZyA9IGdldEFyZztcblxuICB2YXIgdXJsUmVnZXhwID0gL14oPzooW1xcdytcXC0uXSspOik/XFwvXFwvKD86KFxcdys6XFx3KylAKT8oW1xcdy5dKikoPzo6KFxcZCspKT8oXFxTKikkLztcbiAgdmFyIGRhdGFVcmxSZWdleHAgPSAvXmRhdGE6LitcXCwuKyQvO1xuXG4gIGZ1bmN0aW9uIHVybFBhcnNlKGFVcmwpIHtcbiAgICB2YXIgbWF0Y2ggPSBhVXJsLm1hdGNoKHVybFJlZ2V4cCk7XG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzY2hlbWU6IG1hdGNoWzFdLFxuICAgICAgYXV0aDogbWF0Y2hbMl0sXG4gICAgICBob3N0OiBtYXRjaFszXSxcbiAgICAgIHBvcnQ6IG1hdGNoWzRdLFxuICAgICAgcGF0aDogbWF0Y2hbNV1cbiAgICB9O1xuICB9XG4gIGV4cG9ydHMudXJsUGFyc2UgPSB1cmxQYXJzZTtcblxuICBmdW5jdGlvbiB1cmxHZW5lcmF0ZShhUGFyc2VkVXJsKSB7XG4gICAgdmFyIHVybCA9ICcnO1xuICAgIGlmIChhUGFyc2VkVXJsLnNjaGVtZSkge1xuICAgICAgdXJsICs9IGFQYXJzZWRVcmwuc2NoZW1lICsgJzonO1xuICAgIH1cbiAgICB1cmwgKz0gJy8vJztcbiAgICBpZiAoYVBhcnNlZFVybC5hdXRoKSB7XG4gICAgICB1cmwgKz0gYVBhcnNlZFVybC5hdXRoICsgJ0AnO1xuICAgIH1cbiAgICBpZiAoYVBhcnNlZFVybC5ob3N0KSB7XG4gICAgICB1cmwgKz0gYVBhcnNlZFVybC5ob3N0O1xuICAgIH1cbiAgICBpZiAoYVBhcnNlZFVybC5wb3J0KSB7XG4gICAgICB1cmwgKz0gXCI6XCIgKyBhUGFyc2VkVXJsLnBvcnRcbiAgICB9XG4gICAgaWYgKGFQYXJzZWRVcmwucGF0aCkge1xuICAgICAgdXJsICs9IGFQYXJzZWRVcmwucGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBleHBvcnRzLnVybEdlbmVyYXRlID0gdXJsR2VuZXJhdGU7XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZXMgYSBwYXRoLCBvciB0aGUgcGF0aCBwb3J0aW9uIG9mIGEgVVJMOlxuICAgKlxuICAgKiAtIFJlcGxhY2VzIGNvbnNlcXV0aXZlIHNsYXNoZXMgd2l0aCBvbmUgc2xhc2guXG4gICAqIC0gUmVtb3ZlcyB1bm5lY2Vzc2FyeSAnLicgcGFydHMuXG4gICAqIC0gUmVtb3ZlcyB1bm5lY2Vzc2FyeSAnPGRpcj4vLi4nIHBhcnRzLlxuICAgKlxuICAgKiBCYXNlZCBvbiBjb2RlIGluIHRoZSBOb2RlLmpzICdwYXRoJyBjb3JlIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIHVybCB0byBub3JtYWxpemUuXG4gICAqL1xuICBmdW5jdGlvbiBub3JtYWxpemUoYVBhdGgpIHtcbiAgICB2YXIgcGF0aCA9IGFQYXRoO1xuICAgIHZhciB1cmwgPSB1cmxQYXJzZShhUGF0aCk7XG4gICAgaWYgKHVybCkge1xuICAgICAgaWYgKCF1cmwucGF0aCkge1xuICAgICAgICByZXR1cm4gYVBhdGg7XG4gICAgICB9XG4gICAgICBwYXRoID0gdXJsLnBhdGg7XG4gICAgfVxuICAgIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpO1xuXG4gICAgdmFyIHBhcnRzID0gcGF0aC5zcGxpdCgvXFwvKy8pO1xuICAgIGZvciAodmFyIHBhcnQsIHVwID0gMCwgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBwYXJ0ID0gcGFydHNbaV07XG4gICAgICBpZiAocGFydCA9PT0gJy4nKSB7XG4gICAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIH0gZWxzZSBpZiAocGFydCA9PT0gJy4uJykge1xuICAgICAgICB1cCsrO1xuICAgICAgfSBlbHNlIGlmICh1cCA+IDApIHtcbiAgICAgICAgaWYgKHBhcnQgPT09ICcnKSB7XG4gICAgICAgICAgLy8gVGhlIGZpcnN0IHBhcnQgaXMgYmxhbmsgaWYgdGhlIHBhdGggaXMgYWJzb2x1dGUuIFRyeWluZyB0byBnb1xuICAgICAgICAgIC8vIGFib3ZlIHRoZSByb290IGlzIGEgbm8tb3AuIFRoZXJlZm9yZSB3ZSBjYW4gcmVtb3ZlIGFsbCAnLi4nIHBhcnRzXG4gICAgICAgICAgLy8gZGlyZWN0bHkgYWZ0ZXIgdGhlIHJvb3QuXG4gICAgICAgICAgcGFydHMuc3BsaWNlKGkgKyAxLCB1cCk7XG4gICAgICAgICAgdXAgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcnRzLnNwbGljZShpLCAyKTtcbiAgICAgICAgICB1cC0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHBhdGggPSBwYXJ0cy5qb2luKCcvJyk7XG5cbiAgICBpZiAocGF0aCA9PT0gJycpIHtcbiAgICAgIHBhdGggPSBpc0Fic29sdXRlID8gJy8nIDogJy4nO1xuICAgIH1cblxuICAgIGlmICh1cmwpIHtcbiAgICAgIHVybC5wYXRoID0gcGF0aDtcbiAgICAgIHJldHVybiB1cmxHZW5lcmF0ZSh1cmwpO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aDtcbiAgfVxuICBleHBvcnRzLm5vcm1hbGl6ZSA9IG5vcm1hbGl6ZTtcblxuICAvKipcbiAgICogSm9pbnMgdHdvIHBhdGhzL1VSTHMuXG4gICAqXG4gICAqIEBwYXJhbSBhUm9vdCBUaGUgcm9vdCBwYXRoIG9yIFVSTC5cbiAgICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIFVSTCB0byBiZSBqb2luZWQgd2l0aCB0aGUgcm9vdC5cbiAgICpcbiAgICogLSBJZiBhUGF0aCBpcyBhIFVSTCBvciBhIGRhdGEgVVJJLCBhUGF0aCBpcyByZXR1cm5lZCwgdW5sZXNzIGFQYXRoIGlzIGFcbiAgICogICBzY2hlbWUtcmVsYXRpdmUgVVJMOiBUaGVuIHRoZSBzY2hlbWUgb2YgYVJvb3QsIGlmIGFueSwgaXMgcHJlcGVuZGVkXG4gICAqICAgZmlyc3QuXG4gICAqIC0gT3RoZXJ3aXNlIGFQYXRoIGlzIGEgcGF0aC4gSWYgYVJvb3QgaXMgYSBVUkwsIHRoZW4gaXRzIHBhdGggcG9ydGlvblxuICAgKiAgIGlzIHVwZGF0ZWQgd2l0aCB0aGUgcmVzdWx0IGFuZCBhUm9vdCBpcyByZXR1cm5lZC4gT3RoZXJ3aXNlIHRoZSByZXN1bHRcbiAgICogICBpcyByZXR1cm5lZC5cbiAgICogICAtIElmIGFQYXRoIGlzIGFic29sdXRlLCB0aGUgcmVzdWx0IGlzIGFQYXRoLlxuICAgKiAgIC0gT3RoZXJ3aXNlIHRoZSB0d28gcGF0aHMgYXJlIGpvaW5lZCB3aXRoIGEgc2xhc2guXG4gICAqIC0gSm9pbmluZyBmb3IgZXhhbXBsZSAnaHR0cDovLycgYW5kICd3d3cuZXhhbXBsZS5jb20nIGlzIGFsc28gc3VwcG9ydGVkLlxuICAgKi9cbiAgZnVuY3Rpb24gam9pbihhUm9vdCwgYVBhdGgpIHtcbiAgICBpZiAoYVJvb3QgPT09IFwiXCIpIHtcbiAgICAgIGFSb290ID0gXCIuXCI7XG4gICAgfVxuICAgIGlmIChhUGF0aCA9PT0gXCJcIikge1xuICAgICAgYVBhdGggPSBcIi5cIjtcbiAgICB9XG4gICAgdmFyIGFQYXRoVXJsID0gdXJsUGFyc2UoYVBhdGgpO1xuICAgIHZhciBhUm9vdFVybCA9IHVybFBhcnNlKGFSb290KTtcbiAgICBpZiAoYVJvb3RVcmwpIHtcbiAgICAgIGFSb290ID0gYVJvb3RVcmwucGF0aCB8fCAnLyc7XG4gICAgfVxuXG4gICAgLy8gYGpvaW4oZm9vLCAnLy93d3cuZXhhbXBsZS5vcmcnKWBcbiAgICBpZiAoYVBhdGhVcmwgJiYgIWFQYXRoVXJsLnNjaGVtZSkge1xuICAgICAgaWYgKGFSb290VXJsKSB7XG4gICAgICAgIGFQYXRoVXJsLnNjaGVtZSA9IGFSb290VXJsLnNjaGVtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1cmxHZW5lcmF0ZShhUGF0aFVybCk7XG4gICAgfVxuXG4gICAgaWYgKGFQYXRoVXJsIHx8IGFQYXRoLm1hdGNoKGRhdGFVcmxSZWdleHApKSB7XG4gICAgICByZXR1cm4gYVBhdGg7XG4gICAgfVxuXG4gICAgLy8gYGpvaW4oJ2h0dHA6Ly8nLCAnd3d3LmV4YW1wbGUuY29tJylgXG4gICAgaWYgKGFSb290VXJsICYmICFhUm9vdFVybC5ob3N0ICYmICFhUm9vdFVybC5wYXRoKSB7XG4gICAgICBhUm9vdFVybC5ob3N0ID0gYVBhdGg7XG4gICAgICByZXR1cm4gdXJsR2VuZXJhdGUoYVJvb3RVcmwpO1xuICAgIH1cblxuICAgIHZhciBqb2luZWQgPSBhUGF0aC5jaGFyQXQoMCkgPT09ICcvJ1xuICAgICAgPyBhUGF0aFxuICAgICAgOiBub3JtYWxpemUoYVJvb3QucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyBhUGF0aCk7XG5cbiAgICBpZiAoYVJvb3RVcmwpIHtcbiAgICAgIGFSb290VXJsLnBhdGggPSBqb2luZWQ7XG4gICAgICByZXR1cm4gdXJsR2VuZXJhdGUoYVJvb3RVcmwpO1xuICAgIH1cbiAgICByZXR1cm4gam9pbmVkO1xuICB9XG4gIGV4cG9ydHMuam9pbiA9IGpvaW47XG5cbiAgZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24gKGFQYXRoKSB7XG4gICAgcmV0dXJuIGFQYXRoLmNoYXJBdCgwKSA9PT0gJy8nIHx8ICEhYVBhdGgubWF0Y2godXJsUmVnZXhwKTtcbiAgfTtcblxuICAvKipcbiAgICogTWFrZSBhIHBhdGggcmVsYXRpdmUgdG8gYSBVUkwgb3IgYW5vdGhlciBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0gYVJvb3QgVGhlIHJvb3QgcGF0aCBvciBVUkwuXG4gICAqIEBwYXJhbSBhUGF0aCBUaGUgcGF0aCBvciBVUkwgdG8gYmUgbWFkZSByZWxhdGl2ZSB0byBhUm9vdC5cbiAgICovXG4gIGZ1bmN0aW9uIHJlbGF0aXZlKGFSb290LCBhUGF0aCkge1xuICAgIGlmIChhUm9vdCA9PT0gXCJcIikge1xuICAgICAgYVJvb3QgPSBcIi5cIjtcbiAgICB9XG5cbiAgICBhUm9vdCA9IGFSb290LnJlcGxhY2UoL1xcLyQvLCAnJyk7XG5cbiAgICAvLyBJdCBpcyBwb3NzaWJsZSBmb3IgdGhlIHBhdGggdG8gYmUgYWJvdmUgdGhlIHJvb3QuIEluIHRoaXMgY2FzZSwgc2ltcGx5XG4gICAgLy8gY2hlY2tpbmcgd2hldGhlciB0aGUgcm9vdCBpcyBhIHByZWZpeCBvZiB0aGUgcGF0aCB3b24ndCB3b3JrLiBJbnN0ZWFkLCB3ZVxuICAgIC8vIG5lZWQgdG8gcmVtb3ZlIGNvbXBvbmVudHMgZnJvbSB0aGUgcm9vdCBvbmUgYnkgb25lLCB1bnRpbCBlaXRoZXIgd2UgZmluZFxuICAgIC8vIGEgcHJlZml4IHRoYXQgZml0cywgb3Igd2UgcnVuIG91dCBvZiBjb21wb25lbnRzIHRvIHJlbW92ZS5cbiAgICB2YXIgbGV2ZWwgPSAwO1xuICAgIHdoaWxlIChhUGF0aC5pbmRleE9mKGFSb290ICsgJy8nKSAhPT0gMCkge1xuICAgICAgdmFyIGluZGV4ID0gYVJvb3QubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICByZXR1cm4gYVBhdGg7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZSBvbmx5IHBhcnQgb2YgdGhlIHJvb3QgdGhhdCBpcyBsZWZ0IGlzIHRoZSBzY2hlbWUgKGkuZS4gaHR0cDovLyxcbiAgICAgIC8vIGZpbGU6Ly8vLCBldGMuKSwgb25lIG9yIG1vcmUgc2xhc2hlcyAoLyksIG9yIHNpbXBseSBub3RoaW5nIGF0IGFsbCwgd2VcbiAgICAgIC8vIGhhdmUgZXhoYXVzdGVkIGFsbCBjb21wb25lbnRzLCBzbyB0aGUgcGF0aCBpcyBub3QgcmVsYXRpdmUgdG8gdGhlIHJvb3QuXG4gICAgICBhUm9vdCA9IGFSb290LnNsaWNlKDAsIGluZGV4KTtcbiAgICAgIGlmIChhUm9vdC5tYXRjaCgvXihbXlxcL10rOlxcLyk/XFwvKiQvKSkge1xuICAgICAgICByZXR1cm4gYVBhdGg7XG4gICAgICB9XG5cbiAgICAgICsrbGV2ZWw7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBzdXJlIHdlIGFkZCBhIFwiLi4vXCIgZm9yIGVhY2ggY29tcG9uZW50IHdlIHJlbW92ZWQgZnJvbSB0aGUgcm9vdC5cbiAgICByZXR1cm4gQXJyYXkobGV2ZWwgKyAxKS5qb2luKFwiLi4vXCIpICsgYVBhdGguc3Vic3RyKGFSb290Lmxlbmd0aCArIDEpO1xuICB9XG4gIGV4cG9ydHMucmVsYXRpdmUgPSByZWxhdGl2ZTtcblxuICAvKipcbiAgICogQmVjYXVzZSBiZWhhdmlvciBnb2VzIHdhY2t5IHdoZW4geW91IHNldCBgX19wcm90b19fYCBvbiBvYmplY3RzLCB3ZVxuICAgKiBoYXZlIHRvIHByZWZpeCBhbGwgdGhlIHN0cmluZ3MgaW4gb3VyIHNldCB3aXRoIGFuIGFyYml0cmFyeSBjaGFyYWN0ZXIuXG4gICAqXG4gICAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL3B1bGwvMzEgYW5kXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3NvdXJjZS1tYXAvaXNzdWVzLzMwXG4gICAqXG4gICAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICAgKi9cblxuICB2YXIgc3VwcG9ydHNOdWxsUHJvdG8gPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBvYmogPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHJldHVybiAhKCdfX3Byb3RvX18nIGluIG9iaik7XG4gIH0pKCk7XG5cbiAgZnVuY3Rpb24gdG9TZXRTdHJpbmcoYVN0cikge1xuICAgIGlmIChpc1Byb3RvU3RyaW5nKGFTdHIpKSB7XG4gICAgICByZXR1cm4gJyQnICsgYVN0cjtcbiAgICB9XG5cbiAgICByZXR1cm4gYVN0cjtcbiAgfVxuICBleHBvcnRzLnRvU2V0U3RyaW5nID0gc3VwcG9ydHNOdWxsUHJvdG8gPyBpZGVudGl0eSA6IHRvU2V0U3RyaW5nO1xuICAgZnVuY3Rpb24gZnJvbVNldFN0cmluZyhhU3RyKSB7XG4gICAgaWYgKGlzUHJvdG9TdHJpbmcoYVN0cikpIHtcbiAgICAgIHJldHVybiBhU3RyLnN1YnN0cigxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYVN0cjtcbiAgfVxuICBleHBvcnRzLmZyb21TZXRTdHJpbmcgPSBzdXBwb3J0c051bGxQcm90byA/IGlkZW50aXR5IDogZnJvbVNldFN0cmluZztcblxuICBmdW5jdGlvbiBpZGVudGl0eSAocykge1xuICAgIHJldHVybiBzO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNQcm90b1N0cmluZyhzKSB7XG4gICAgaWYgKHR5cGVvZiBzICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBsZW5ndGggPSBzLmxlbmd0aDtcblxuICAgIGlmIChsZW5ndGggPCA5IC8qIFwiX19wcm90b19fXCIubGVuZ3RoICovKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHMuY2hhckNvZGVBdChsZW5ndGggLSAxKSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gMikgIT09IDk1ICAvKiAnXycgKi8gfHxcbiAgICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDMpICE9PSAxMTEgLyogJ28nICovIHx8XG4gICAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA0KSAhPT0gMTE2IC8qICd0JyAqLyB8fFxuICAgICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNSkgIT09IDExMSAvKiAnbycgKi8gfHxcbiAgICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDYpICE9PSAxMTQgLyogJ3InICovIHx8XG4gICAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA3KSAhPT0gMTEyIC8qICdwJyAqLyB8fFxuICAgICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gOCkgIT09IDk1ICAvKiAnXycgKi8gfHxcbiAgICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDkpICE9PSA5NSAgLyogJ18nICovKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IGxlbmd0aCAtIDEwOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKHMuY2hhckNvZGVBdChpKSAhPT0gMzYgLyogJyQnICovKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdoZXJlIHRoZSBvcmlnaW5hbCBwb3NpdGlvbnMgYXJlIGNvbXBhcmVkLlxuICAgKlxuICAgKiBPcHRpb25hbGx5IHBhc3MgaW4gYHRydWVgIGFzIGBvbmx5Q29tcGFyZUdlbmVyYXRlZGAgdG8gY29uc2lkZXIgdHdvXG4gICAqIG1hcHBpbmdzIHdpdGggdGhlIHNhbWUgb3JpZ2luYWwgc291cmNlL2xpbmUvY29sdW1uLCBidXQgZGlmZmVyZW50IGdlbmVyYXRlZFxuICAgKiBsaW5lIGFuZCBjb2x1bW4gdGhlIHNhbWUuIFVzZWZ1bCB3aGVuIHNlYXJjaGluZyBmb3IgYSBtYXBwaW5nIHdpdGggYVxuICAgKiBzdHViYmVkIG91dCBtYXBwaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMobWFwcGluZ0EsIG1hcHBpbmdCLCBvbmx5Q29tcGFyZU9yaWdpbmFsKSB7XG4gICAgdmFyIGNtcCA9IG1hcHBpbmdBLnNvdXJjZSAtIG1hcHBpbmdCLnNvdXJjZTtcbiAgICBpZiAoY21wICE9PSAwKSB7XG4gICAgICByZXR1cm4gY21wO1xuICAgIH1cblxuICAgIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgICBpZiAoY21wICE9PSAwKSB7XG4gICAgICByZXR1cm4gY21wO1xuICAgIH1cblxuICAgIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gICAgaWYgKGNtcCAhPT0gMCB8fCBvbmx5Q29tcGFyZU9yaWdpbmFsKSB7XG4gICAgICByZXR1cm4gY21wO1xuICAgIH1cblxuICAgIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZENvbHVtbiAtIG1hcHBpbmdCLmdlbmVyYXRlZENvbHVtbjtcbiAgICBpZiAoY21wICE9PSAwKSB7XG4gICAgICByZXR1cm4gY21wO1xuICAgIH1cblxuICAgIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICAgIGlmIChjbXAgIT09IDApIHtcbiAgICAgIHJldHVybiBjbXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcHBpbmdBLm5hbWUgLSBtYXBwaW5nQi5uYW1lO1xuICB9XG4gIGV4cG9ydHMuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMgPSBjb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucztcblxuICAvKipcbiAgICogQ29tcGFyYXRvciBiZXR3ZWVuIHR3byBtYXBwaW5ncyB3aXRoIGRlZmxhdGVkIHNvdXJjZSBhbmQgbmFtZSBpbmRpY2VzIHdoZXJlXG4gICAqIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAgICpcbiAgICogT3B0aW9uYWxseSBwYXNzIGluIGB0cnVlYCBhcyBgb25seUNvbXBhcmVHZW5lcmF0ZWRgIHRvIGNvbnNpZGVyIHR3b1xuICAgKiBtYXBwaW5ncyB3aXRoIHRoZSBzYW1lIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4sIGJ1dCBkaWZmZXJlbnRcbiAgICogc291cmNlL25hbWUvb3JpZ2luYWwgbGluZSBhbmQgY29sdW1uIHRoZSBzYW1lLiBVc2VmdWwgd2hlbiBzZWFyY2hpbmcgZm9yIGFcbiAgICogbWFwcGluZyB3aXRoIGEgc3R1YmJlZCBvdXQgbWFwcGluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkKG1hcHBpbmdBLCBtYXBwaW5nQiwgb25seUNvbXBhcmVHZW5lcmF0ZWQpIHtcbiAgICB2YXIgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZSAtIG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gICAgaWYgKGNtcCAhPT0gMCkge1xuICAgICAgcmV0dXJuIGNtcDtcbiAgICB9XG5cbiAgICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gICAgaWYgKGNtcCAhPT0gMCB8fCBvbmx5Q29tcGFyZUdlbmVyYXRlZCkge1xuICAgICAgcmV0dXJuIGNtcDtcbiAgICB9XG5cbiAgICBjbXAgPSBtYXBwaW5nQS5zb3VyY2UgLSBtYXBwaW5nQi5zb3VyY2U7XG4gICAgaWYgKGNtcCAhPT0gMCkge1xuICAgICAgcmV0dXJuIGNtcDtcbiAgICB9XG5cbiAgICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbExpbmUgLSBtYXBwaW5nQi5vcmlnaW5hbExpbmU7XG4gICAgaWYgKGNtcCAhPT0gMCkge1xuICAgICAgcmV0dXJuIGNtcDtcbiAgICB9XG5cbiAgICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbENvbHVtbiAtIG1hcHBpbmdCLm9yaWdpbmFsQ29sdW1uO1xuICAgIGlmIChjbXAgIT09IDApIHtcbiAgICAgIHJldHVybiBjbXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcHBpbmdBLm5hbWUgLSBtYXBwaW5nQi5uYW1lO1xuICB9XG4gIGV4cG9ydHMuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQgPSBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZDtcblxuICBmdW5jdGlvbiBzdHJjbXAoYVN0cjEsIGFTdHIyKSB7XG4gICAgaWYgKGFTdHIxID09PSBhU3RyMikge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgaWYgKGFTdHIxID4gYVN0cjIpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdpdGggaW5mbGF0ZWQgc291cmNlIGFuZCBuYW1lIHN0cmluZ3Mgd2hlcmVcbiAgICogdGhlIGdlbmVyYXRlZCBwb3NpdGlvbnMgYXJlIGNvbXBhcmVkLlxuICAgKi9cbiAgZnVuY3Rpb24gY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQobWFwcGluZ0EsIG1hcHBpbmdCKSB7XG4gICAgdmFyIGNtcCA9IG1hcHBpbmdBLmdlbmVyYXRlZExpbmUgLSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICAgIGlmIChjbXAgIT09IDApIHtcbiAgICAgIHJldHVybiBjbXA7XG4gICAgfVxuXG4gICAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkQ29sdW1uIC0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICAgIGlmIChjbXAgIT09IDApIHtcbiAgICAgIHJldHVybiBjbXA7XG4gICAgfVxuXG4gICAgY21wID0gc3RyY21wKG1hcHBpbmdBLnNvdXJjZSwgbWFwcGluZ0Iuc291cmNlKTtcbiAgICBpZiAoY21wICE9PSAwKSB7XG4gICAgICByZXR1cm4gY21wO1xuICAgIH1cblxuICAgIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsTGluZSAtIG1hcHBpbmdCLm9yaWdpbmFsTGluZTtcbiAgICBpZiAoY21wICE9PSAwKSB7XG4gICAgICByZXR1cm4gY21wO1xuICAgIH1cblxuICAgIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gICAgaWYgKGNtcCAhPT0gMCkge1xuICAgICAgcmV0dXJuIGNtcDtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyY21wKG1hcHBpbmdBLm5hbWUsIG1hcHBpbmdCLm5hbWUpO1xuICB9XG4gIGV4cG9ydHMuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQgPSBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZDtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9saWIvdXRpbC5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=