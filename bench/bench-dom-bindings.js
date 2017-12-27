sourceMap.SourceMapConsumer.initialize({
  "lib/mappings.wasm": "../lib/mappings.wasm",
});

// Run a benchmark when the given button is clicked and display results in the
// given element.
function benchOnClick(button, results, bencher) {
  button.addEventListener("click", async function (e) {
    e.preventDefault();

    const buttons = [...document.querySelectorAll("button")];
    buttons.forEach(b => b.setAttribute("disabled", true));

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
