// Ensure that benchmarks don't get optimized away by calling this blackbox
// function in your benchmark's action.
window.__benchmarkResults = [];
window.benchmarkBlackbox = [].push.bind(window.__benchmarkResults);

// Benchmark running an action n times.
function benchmark(name, n, action) {
  window.__benchmarkResults = [];

  // Warm up the JIT.
  for (var i = 0; i < n; i++) {
    action();
  }

  var stats = new Stats("ms");

  console.profile(name);
  for (var i = 0; i < n; i++) {
    var start = window.performance.now();
    action();
    stats.take(window.performance.now() - start);
  }
  console.profileEnd(name);

  return stats;
}

// Run a benchmark when the given button is clicked and display results in the
// given element.
function benchOnClick(button, results, name, n, action) {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    var stats = benchmark(name, n, action);
    results.innerHTML = `
      <table>
        <thead>
          <tr>
            <td>Samples</td>
            <td>Total (${stats.unit})</th>
            <td>Mean (${stats.unit})</th>
            <td>Standard Deviation (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${n}</td>
            <td>${stats.total().toFixed(3)}</td>
            <td>${stats.mean().toFixed(3)}</td>
            <td>${stats.stddev().toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    `;
  }, false);
}

var consumerButton = document.getElementById("bench-consumer");
var consumerResults = document.getElementById("consumer-results");

benchOnClick(consumerButton, consumerResults, "parse source map", 100, function () {
  var smc = new sourceMap.SourceMapConsumer(window.jQuerySourceMap);
  benchmarkBlackbox(smc._generatedMappings);
});

var generatorButton = document.getElementById("bench-generator");
var generatorResults = document.getElementById("generator-results");

benchOnClick(generatorButton, generatorResults, "serialize source map", 100, (function () {
  var smc = new sourceMap.SourceMapConsumer(window.jQuerySourceMap);
  var smg = sourceMap.SourceMapGenerator.fromSourceMap(smc);
  return function () {
    benchmarkBlackbox(smg.toString());
  };
}()));
