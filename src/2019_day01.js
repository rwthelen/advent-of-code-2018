const assert = require("assert");
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

function calcFuel(mass) {
  return Math.floor(mass / 3) - 2;
}

function calcFuelRecursive(mass) {
  let cur = mass;
  let allFuel = [];
  while (calcFuel(cur) > 0) {
    cur = calcFuel(cur);
    allFuel.push(cur);
  }
  return allFuel.reduce((acc, cur) => acc + cur);
}

async function solvePart1() {
  const input = await readFile(__dirname + "/../input/2019_day01.txt", "utf-8");
  const solution = input
    .split("\n")
    .map(e => calcFuel(e))
    .reduce((acc, cur) => acc + cur);
  console.log(solution);
}

function testPart1() {
  assert.equal(calcFuel(12), 2);
  assert.equal(calcFuel(14), 2);
  assert.equal(calcFuel(1969), 654);
  assert.equal(calcFuel(100756), 33583);
}

function testPart2() {
  assert.equal(calcFuelRecursive(14), 2);
  assert.equal(calcFuelRecursive(1969), 966);
  assert.equal(calcFuelRecursive(100756), 50346);
}

async function solvePart2() {
  const input = await readFile(__dirname + "/../input/2019_day01.txt", "utf-8");
  const solution = input
    .split("\n")
    .map(e => calcFuelRecursive(e))
    .reduce((acc, cur) => acc + cur);
  console.log(solution);
}

if (require.main === module) {
  testPart1();
  solvePart1();
  testPart2();
  solvePart2();
}
