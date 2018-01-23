# Benchmarking

This directory contains helpers for benchmarking the `mozilla/source-map`
library.

Ensure that you have built the library, as these benchmarks rely on
`dist/source-map.js`. See the main README.md for detais on building.

Run a local webserver from the root of the repository:

```
$ cd source-map/
$ python2 -m SimpleHTTPServer # or `python3 -m http.server`
```

Open
[http://localhost:8000/bench/bench.html](http://localhost:8000/bench/bench.html)
in your browser.

Open `bench.html` in a browser and click on the appropriate button.
