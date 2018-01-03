sourceMap.SourceMapConsumer.initialize({
  "lib/mappings.wasm": "../lib/mappings.wasm",
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

var testSourceMap = SCALA_JS_RUNTIME_SOURCE_MAP;
document.getElementById("input-map").addEventListener("input", e => {
  e.preventDefault();
  testSourceMap = window[e.target.value];
});

// Run a benchmark when the given button is clicked and display results in the
// given element.
function benchOnClick(button, results, bencher) {
  button.addEventListener("click", async function (e) {
    e.preventDefault();

    const buttons = [...document.querySelectorAll("button")];
    buttons.forEach(b => b.setAttribute("disabled", true));
    results.innerHTML = "";
    await new Promise(r => requestAnimationFrame(r));

    var stats = await bencher();

    buttons.forEach(b => b.removeAttribute("disabled"));

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
      <pre style="overflow:hidden">${stats.xs}</pre>
    `;
  }, false);
}

for (let bench of Object.keys(benchmarks)) {
  const hr = document.createElement("hr");
  document.body.appendChild(hr);

  const button = document.createElement("button");
  button.innerHTML = `<h2>${bench}</h2>`;
  document.body.appendChild(button);

  const results = document.createElement("div");
  document.body.appendChild(results);

  benchOnClick(button, results, benchmarks[bench]);
}
