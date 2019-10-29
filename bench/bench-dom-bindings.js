sourceMap.SourceMapConsumer.initialize({
  "lib/mappings.wasm": "../lib/mappings.wasm?bust_cache=" + String(Math.random()).replace(/0\./, "")
});

function bindRange(labelId, updater) {
  const label = document.getElementById(labelId);
  const input = label.querySelector("input");

  input.addEventListener("input", e => {
    e.preventDefault();
    updater(input.value);
  });

  updater(input.value);
}

bindRange("warm-up-iters", input => {
  const value = parseInt(input, 10);
  WARM_UP_ITERATIONS = value;
});

bindRange("bench-iters", input => {
  const value = parseInt(input, 10);
  BENCH_ITERATIONS = value;
});

const whichMap = document.getElementById("input-map");
const multiplyBy = document.getElementById("multiply-size-by");

var testSourceMap = SCALA_JS_RUNTIME_SOURCE_MAP;

const updateTestSourceMap = () => {
  const origMap = window[whichMap.value];
  testSourceMap = JSON.parse(JSON.stringify(origMap));

  const factor = parseInt(multiplyBy.value, 10);
  if (factor === 1) {
    return;
  }

  const mappings = new Array(factor);
  mappings.fill(origMap.mappings);
  testSourceMap.mappings = mappings.join(";");

  for (let i = 0; i < factor; i++) {
    testSourceMap.sources.splice(testSourceMap.sources.length, 0, ...origMap.sources);
    testSourceMap.names.splice(testSourceMap.names.length, 0, ...origMap.names);
  }
};
updateTestSourceMap();

whichMap.addEventListener("input", e => {
  e.preventDefault();
  updateTestSourceMap();
});

multiplyBy.addEventListener("input", e => {
  e.preventDefault();
  updateTestSourceMap();
});

var implAndBrowser = "<unknown>";

const implAndBrowserInput = document.getElementById("impl-and-browser");
const updateImplAndBrowser = () => {
  implAndBrowser = implAndBrowserInput.value;
};
implAndBrowserInput.addEventListener("input", updateImplAndBrowser);
updateImplAndBrowser();

// Run a benchmark when the given button is clicked and display results in the
// given element.
function benchOnClick(button, results, benchName, bencher) {
  button.addEventListener(
    "click",
    async function(e) {
      e.preventDefault();

      const buttons = [...document.querySelectorAll("button")];
      buttons.forEach(b => b.setAttribute("disabled", true));
      results.innerHTML = "";
      await new Promise(r => requestAnimationFrame(r));

      var stats = await bencher();

      buttons.forEach(b => b.removeAttribute("disabled"));

      const csv = stats.xs
        .map(x => `"${implAndBrowser}",${testSourceMap.mappings.length},"${benchName}",${x}`)
        .join("\n");

      results.innerHTML = `
      <table>
        <thead>
          <tr>
            <td>Samples</td>
            <td>Total (${stats.unit})</th>
            <td>Mean (${stats.unit})</th>
            <td>Standard Deviation (${stats.unit})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${stats.samples()}</td>
            <td>${stats.total().toFixed(2)}</td>
            <td>${stats.mean().toFixed(2)}</td>
            <td>${stats.stddev().toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <pre style="overflow:scroll;max-height:100px; max-width:500px;outline:1px solid black">${csv}</pre>
    `;
    },
    false
  );
}

for (let bench of Object.keys(benchmarks)) {
  const hr = document.createElement("hr");
  document.body.appendChild(hr);

  const button = document.createElement("button");
  button.innerHTML = `<h2>${bench}</h2>`;
  document.body.appendChild(button);

  const results = document.createElement("div");
  document.body.appendChild(results);

  benchOnClick(button, results, bench, benchmarks[bench]);
}
