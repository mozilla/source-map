// Run a benchmark when the given button is clicked and display results in the
// given element.
function benchOnClick(button, results, bencher) {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    var stats = bencher();
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
    `;
  }, false);
}

benchOnClick(document.getElementById("bench-consumer"),
             document.getElementById("consumer-results"),
             benchmarkParseSourceMap);

benchOnClick(document.getElementById("bench-generator"),
             document.getElementById("generator-results"),
             benchmarkSerializeSourceMap);
