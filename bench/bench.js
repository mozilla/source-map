// Ensure that benchmarks don't get optimized away by calling this blackbox
// function in your benchmark's action.
window.__benchmarkResults = [];
window.benchmarkBlackbox = [].push.bind(window.__benchmarkResults);

// Benchmark running an action n times.
function benchmark(name, action) {
  window.__benchmarkResults = [];

  // Warm up the JIT.
  var start = Date.now();
  while ((Date.now() - start) < 10000 /* 10 seconds */) {
    action();
  }

  var stats = new Stats("ms");

  console.profile(name);
  var start = Date.now();
  while ((Date.now() - start) < 20000 /* 20 seconds */) {
    var thisIterationStart = window.performance.now();
    action();
    stats.take(window.performance.now() - thisIterationStart);
  }
  console.profileEnd(name);

  return stats;
}

// Run a benchmark when the given button is clicked and display results in the
// given element.
function benchOnClick(button, results, name, action) {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    var stats = benchmark(name, action);
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
            <td>${stats.samples()}</td>
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

benchOnClick(consumerButton, consumerResults, "parse source map", function () {
  var smc = new sourceMap.SourceMapConsumer(window.testSourceMap);
  benchmarkBlackbox(smc._generatedMappings);
});

var generatorButton = document.getElementById("bench-generator");
var generatorResults = document.getElementById("generator-results");

benchOnClick(generatorButton, generatorResults, "serialize source map", (function () {
  var smc = new sourceMap.SourceMapConsumer(window.testSourceMap);
  var smg = sourceMap.SourceMapGenerator.fromSourceMap(smc);
  return function () {
    benchmarkBlackbox(smg.toString());
  };
}()));
