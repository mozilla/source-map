const {SourceMapConsumer, SourceMapGenerator} = require("../");

const TS_MAP = {
  version: 3,
  file: "blah.js",
  sourceRoot: "",
  sources: ["blah.tsx"],
  names: [],
  mappings:
    ";;AAKA;IACE,MAAM,CAAC,EAAC,MAAM,EAAE,SAAS,EAAC,CAAC;AAC7B,CAAC;AAFD,yBAEC",
  sourcesContent: [
    "\ntype Cheese = {\n  readonly cheese: string\n}\n\nexport default function Cheese(): Cheese {\n  return {cheese: 'stilton'};\n}\n"
  ]
};

const BABEL_MAP = {
  version: 3,
  sources: ["blah.tsx"],
  names: [
    "Object",
    "defineProperty",
    "exports",
    "value",
    "Cheese",
    "cheese",
    "default"
  ],
  mappings:
    "AAAA;;AACAA,OAAOC,cAAP,CAAsBC,OAAtB,EAA+B,YAA/B,EAA6C,EAAEC,OAAO,IAAT,EAA7C;AACA,SAASC,MAAT,GAAkB;AACd,WAAO,EAAEC,QAAQ,SAAV,EAAP;AACH;AACDH,QAAQI,OAAR,GAAkBF,MAAlB",
  sourcesContent: [
    '"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\nfunction Cheese() {\n    return { cheese: \'stilton\' };\n}\nexports.default = Cheese;\n//# sourceMappingURL=blah.js.map'
  ]
};


async function composeSourceMaps(
  tsMap,
  babelMap,
  tsFileName,
) {
  const tsConsumer = await new SourceMapConsumer(tsMap);
  const babelConsumer = await new SourceMapConsumer(babelMap);
  const map = new SourceMapGenerator();
  babelConsumer.eachMapping(
    ({
      source,
      generatedLine,
      generatedColumn,
      originalLine,
      originalColumn,
      name,
    }) => {
      if (originalLine) {
        const original = tsConsumer.originalPositionFor({
          line: originalLine,
          column: originalColumn,
        });
        if (original.line) {
          map.addMapping({
            generated: {
              line: generatedLine,
              column: generatedColumn,
            },
            original: {
              line: original.line,
              column: original.column,
            },
            source: tsFileName,
            name,
          });
        }
      }
    }
  );
  return map.toJSON();
}

exports["test nested consumer usage"] = async function(assert) {
  await composeSourceMaps(TS_MAP, BABEL_MAP, "blah.tsx");
};
