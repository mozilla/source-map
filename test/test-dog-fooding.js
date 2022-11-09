/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const util = require("./util");
const SourceMapConsumer =
  require("../lib/source-map-consumer").SourceMapConsumer;
const SourceMapGenerator =
  require("../lib/source-map-generator").SourceMapGenerator;

exports["test eating our own dog food"] = async function (assert) {
  const smg = new SourceMapGenerator({
    file: "testing.js",
    sourceRoot: "/wu/tang",
  });

  smg.addMapping({
    source: "gza.coffee",
    original: { line: 1, column: 0 },
    generated: { line: 2, column: 2 },
  });

  smg.addMapping({
    source: "gza.coffee",
    original: { line: 2, column: 0 },
    generated: { line: 3, column: 2 },
  });

  smg.addMapping({
    source: "gza.coffee",
    original: { line: 3, column: 0 },
    generated: { line: 4, column: 2 },
  });

  smg.addMapping({
    source: "gza.coffee",
    original: { line: 4, column: 0 },
    generated: { line: 5, column: 2 },
  });

  smg.addMapping({
    source: "gza.coffee",
    original: { line: 5, column: 10 },
    generated: { line: 6, column: 12 },
  });

  const smc = await new SourceMapConsumer(smg.toString());

  // Exact
  util.assertMapping(
    2,
    2,
    "/wu/tang/gza.coffee",
    1,
    0,
    null,
    null,
    smc,
    assert
  );
  util.assertMapping(
    3,
    2,
    "/wu/tang/gza.coffee",
    2,
    0,
    null,
    null,
    smc,
    assert
  );
  util.assertMapping(
    4,
    2,
    "/wu/tang/gza.coffee",
    3,
    0,
    null,
    null,
    smc,
    assert
  );
  util.assertMapping(
    5,
    2,
    "/wu/tang/gza.coffee",
    4,
    0,
    null,
    null,
    smc,
    assert
  );
  util.assertMapping(
    6,
    12,
    "/wu/tang/gza.coffee",
    5,
    10,
    null,
    null,
    smc,
    assert
  );

  // Fuzzy

  // Generated to original with default (glb) bias.
  util.assertMapping(2, 0, null, null, null, null, null, smc, assert, true);
  util.assertMapping(
    2,
    9,
    "/wu/tang/gza.coffee",
    1,
    0,
    null,
    null,
    smc,
    assert,
    true
  );
  util.assertMapping(3, 0, null, null, null, null, null, smc, assert, true);
  util.assertMapping(
    3,
    9,
    "/wu/tang/gza.coffee",
    2,
    0,
    null,
    null,
    smc,
    assert,
    true
  );
  util.assertMapping(4, 0, null, null, null, null, null, smc, assert, true);
  util.assertMapping(
    4,
    9,
    "/wu/tang/gza.coffee",
    3,
    0,
    null,
    null,
    smc,
    assert,
    true
  );
  util.assertMapping(5, 0, null, null, null, null, null, smc, assert, true);
  util.assertMapping(
    5,
    9,
    "/wu/tang/gza.coffee",
    4,
    0,
    null,
    null,
    smc,
    assert,
    true
  );
  util.assertMapping(6, 0, null, null, null, null, null, smc, assert, true);
  util.assertMapping(6, 9, null, null, null, null, null, smc, assert, true);
  util.assertMapping(
    6,
    13,
    "/wu/tang/gza.coffee",
    5,
    10,
    null,
    null,
    smc,
    assert,
    true
  );

  // Generated to original with lub bias.
  util.assertMapping(
    2,
    0,
    "/wu/tang/gza.coffee",
    1,
    0,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    true
  );
  util.assertMapping(
    2,
    9,
    null,
    null,
    null,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    true
  );
  util.assertMapping(
    3,
    0,
    "/wu/tang/gza.coffee",
    2,
    0,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    true
  );
  util.assertMapping(
    3,
    9,
    null,
    null,
    null,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    true
  );
  util.assertMapping(
    4,
    0,
    "/wu/tang/gza.coffee",
    3,
    0,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    true
  );
  util.assertMapping(
    4,
    9,
    null,
    null,
    null,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    true
  );
  util.assertMapping(
    5,
    0,
    "/wu/tang/gza.coffee",
    4,
    0,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    true
  );
  util.assertMapping(
    5,
    9,
    null,
    null,
    null,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    true
  );
  util.assertMapping(
    6,
    0,
    "/wu/tang/gza.coffee",
    5,
    10,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    true
  );
  util.assertMapping(
    6,
    9,
    "/wu/tang/gza.coffee",
    5,
    10,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    true
  );
  util.assertMapping(
    6,
    13,
    null,
    null,
    null,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    true
  );

  // Original to generated with default (glb) bias
  util.assertMapping(
    2,
    2,
    "/wu/tang/gza.coffee",
    1,
    1,
    null,
    null,
    smc,
    assert,
    null,
    true
  );
  util.assertMapping(
    3,
    2,
    "/wu/tang/gza.coffee",
    2,
    3,
    null,
    null,
    smc,
    assert,
    null,
    true
  );
  util.assertMapping(
    4,
    2,
    "/wu/tang/gza.coffee",
    3,
    6,
    null,
    null,
    smc,
    assert,
    null,
    true
  );
  util.assertMapping(
    5,
    2,
    "/wu/tang/gza.coffee",
    4,
    9,
    null,
    null,
    smc,
    assert,
    null,
    true
  );
  util.assertMapping(
    5,
    2,
    "/wu/tang/gza.coffee",
    5,
    9,
    null,
    null,
    smc,
    assert,
    null,
    true
  );
  util.assertMapping(
    6,
    12,
    "/wu/tang/gza.coffee",
    6,
    19,
    null,
    null,
    smc,
    assert,
    null,
    true
  );

  // Original to generated with lub bias.
  util.assertMapping(
    3,
    2,
    "/wu/tang/gza.coffee",
    1,
    1,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    null,
    true
  );
  util.assertMapping(
    4,
    2,
    "/wu/tang/gza.coffee",
    2,
    3,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    null,
    true
  );
  util.assertMapping(
    5,
    2,
    "/wu/tang/gza.coffee",
    3,
    6,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    null,
    true
  );
  util.assertMapping(
    6,
    12,
    "/wu/tang/gza.coffee",
    4,
    9,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    null,
    true
  );
  util.assertMapping(
    6,
    12,
    "/wu/tang/gza.coffee",
    5,
    9,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    null,
    true
  );
  util.assertMapping(
    null,
    null,
    "/wu/tang/gza.coffee",
    6,
    19,
    null,
    SourceMapConsumer.LEAST_UPPER_BOUND,
    smc,
    assert,
    null,
    true
  );

  smc.destroy();
};
