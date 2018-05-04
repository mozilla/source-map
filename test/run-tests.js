#!/usr/bin/env node
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

async function run(tests) {
  let total = 0;
  let passed = 0;

  for (let i = 0; i < tests.length; i++) {
    for (const k in tests[i].testCase) {
      if (/^test/.test(k)) {
        total++;
        try {
          await tests[i].testCase[k](assert);
          passed++;
        } catch (e) {
          console.log("FAILED " + tests[i].name + ": " + k + "!");
          console.log(e.stack);
        }
      }
    }
  }

  console.log("");
  console.log(passed + " / " + total + " tests passed.");
  console.log("");

  return total - passed;
}

function isTestFile(f) {
  const testToRun = process.argv[2];
  return testToRun
    ? path.basename(testToRun) === f
    : /^test\-.*?\.js/.test(f);
}

function toRelativeModule(f) {
  return "./" + f.replace(/\.js$/, "");
}

const requires = fs.readdirSync(__dirname)
  .filter(isTestFile)
  .map(toRelativeModule);

run(requires.map(require).map(function(mod, i) {
  return {
    name: requires[i],
    testCase: mod
  };
})).then(
  code => process.exit(code),
  e => {
    console.error(e);
    process.exit(1);
  }
);
