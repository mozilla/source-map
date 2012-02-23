/*globals console define*/

define([], function() {

  var assert = {
    ok: function(value) {
      console.assert(value);
    },
    strictEqual: function(actual, expected) {
      console.assert(actual === expected);
    },
    equal: function(actual, expected) {
     console.assert(actual == expected);
    },
    throws: function(mustThrow) {
      try {
        mustThrow();
        console.assert("must throw");
      } catch(exc) {
        // success
      }
    },
    doesNotThrow: function(mustNotThrow) {
      try {
        mustNotThrow();
      } catch(exc) {
        console.assert("must Not throw");
      }
    },
    deepEqual: function(actual, expected) {
      Object.keys(actual).forEach(function(key) {
        if (actual[key] !== expected) {
          console.assert("deepEqual fails");
        }
        if(typeof actual[key] === 'object') {
          assert.deepEqual(actual[key], expected[key]);
        }
      });
    },
  };
    
  return assert;
});