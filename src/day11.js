const assert = require("assert");

function calcGrid(size = 300, sn = 18, anySize = false) {
  // create the summed-area table
  let grid = [];
  for (let y = 0; y < size; y++) {
    grid[y] = [];
    for (let x = 0; x < size; x++) {
      const ll = (grid[y] || [])[x - 1] || 0;
      const ur = (grid[y - 1] || [])[x] || 0;
      const ul = (grid[y - 1] || [])[x - 1] || 0;
      let summedArea = calcPowerLevel(x + 1, y + 1, sn) + ll + ur - ul;
      grid[y][x] = summedArea;
    }
  }
  // create the grid of power levels for each subSize,
  // using the summed-area table to calculate each one
  let best = { total: -Infinity };
  for (let subSize = 1; subSize <= size; subSize++) {
    if (!anySize && subSize !== 3) {
      continue;
    }
    for (let y = 0; y < size - subSize; y++) {
      for (let x = 0; x < size - subSize; x++) {
        const ul = (grid[y - 1] || [])[x - 1] || 0;
        const ur = (grid[y - 1] || [])[x + (subSize - 1)] || 0;
        const lr = (grid[y + (subSize - 1)] || [])[x + (subSize - 1)] || 0;
        const ll = (grid[y + (subSize - 1)] || [])[x - 1] || 0;
        const total = ul + lr - ur - ll;
        if (total > best.total) {
          best = { x: x + 1, y: y + 1, total: total, subSize: subSize };
        }
      }
    }
  }
  return best;
}

function calcPowerLevel(x, y, sn) {
  let rackId = x + 10;
  return Math.floor((((rackId * y + sn) * rackId) / 100) % 10) - 5;
}

function testFuelCells() {
  const test1 = calcPowerLevel(122, 79, 57);
  const test2 = calcPowerLevel(217, 196, 39);
  const test3 = calcPowerLevel(101, 153, 71);
  assert.equal(test1, -5);
  assert.equal(test2, 0);
  assert.equal(test3, 4);
}

function testPart1() {
  const solution = calcGrid();
  const coords = [solution.x, solution.y].join(",");
  assert.equal(coords, "33,45");
}

function testPart1_2() {
  const solution = calcGrid(300, 42);
  const coords = [solution.x, solution.y].join(",");
  assert.equal(coords, "21,61");
}

function solvePart1() {
  const solution = calcGrid(300, 7672);
  const coords = [solution.x, solution.y].join(",");
  assert.equal(coords, "22,18");
  console.log(coords);
}

function testPart2() {
  const solution = calcGrid(300, 18, true);
  const coords = [solution.x, solution.y, solution.subSize].join(",");
  assert.equal(coords, "90,269,16");
}

function solvePart2() {
  const solution = calcGrid(300, 7672, true);
  const coords = [solution.x, solution.y, solution.subSize].join(",");
  console.log(coords);
  assert.equal(coords, "234,197,14");
}

if (require.main === module) {
  testFuelCells();
  testPart1();
  testPart1_2();
  solvePart1();
  testPart2();
  solvePart2();
}
