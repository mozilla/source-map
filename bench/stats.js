// Original author: Jim Blandy

function Stats(unit) {
  this.unit = unit || "";
  this.xs = [];
  this.x0 = this.x1 = this.x2 = 0;
}

Stats.prototype.take = function (x) {
  this.xs.push(x);
  this.x0 += 1;
  this.x1 += x;
  this.x2 += x*x;
}

Stats.prototype.samples = function () {
  return this.x0;
};

Stats.prototype.total = function () {
  return this.x1;
};

Stats.prototype.mean = function () {
  return this.x1 / this.x0;
};

Stats.prototype.stddev = function () {
  return Math.sqrt(this.x0 * this.x2 - this.x1 * this.x1) / (this.x0 - 1);
};

Stats.prototype.toString = function () {
  return "[Stats " +
    "samples: " + this.samples() +             ", " +
    "total: "   + this.total()   + " " + this.unit + ", " +
    "mean: "    + this.mean()    + " " + this.unit + ", " +
    "stddev: "  + this.stddev()  + " " + this.unit + "]";
};
