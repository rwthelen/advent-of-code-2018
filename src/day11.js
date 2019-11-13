const assert = require("assert");

const minReducer = (curMin, current) => (current < curMin ? current : curMin);
const maxReducer = (curMax, current) => (current > curMax ? current : curMax);

class Grid {
  constructor(serialNumber, size, startingCoord = [1, 1]) {
    this.serialNumber = serialNumber;
    this.size = size;
    this.startingCoord = startingCoord;
    this.setBounds();
    this.cells = this.generateCells();
  }

  setBounds() {
    this.xMin = this.startingCoord[0];
    this.xMax = this.xMin + (this.size - 1);
    this.yMin = this.startingCoord[1];
    this.yMax = this.yMin + (this.size - 1);
  }

  generateCells() {
    let points = [];
    for (let y = this.yMin; y <= this.yMax; y++) {
      for (let x = this.xMin; x <= this.xMax; x++) {
        points.push(new Cell(x, y, this));
      }
    }
    return points;
  }

  getTotalPowerLevel() {
    return this.cells
      .map(c => c.calcPowerLevel())
      .reduce((accumulator, current) => accumulator + current);
  }

  calcBestSquare() {
    let powerLevels = [];
    for (let y = this.yMin; y <= this.yMax; y++) {
      for (let x = this.xMin; x <= this.xMax; x++) {
        if (x <= this.xMax - 2) {
          let grid = new Grid(this.serialNumber, 3, [x, y]);
          powerLevels.push({ coord: [x, y], value: grid.getTotalPowerLevel() });
        }
      }
    }
    const best = powerLevels.reduce((accumulator, current) => {
      if (current.value > accumulator.value) {
        return current;
      } else {
        return accumulator;
      }
    });
    return best;
  }
}

class Cell {
  constructor(x, y, grid = null) {
    this.x = x;
    this.y = y;
    this.rackId = this.x + 10;
    this.grid = grid;
  }

  calcPowerLevel() {
    let powerLevel = this.rackId * this.y;
    powerLevel += this.grid.serialNumber;
    powerLevel *= this.rackId;
    powerLevel = Math.floor((powerLevel / 100) % 10);
    powerLevel -= 5;
    return powerLevel;
  }
}

function testFuelCells() {
  const cell1 = new Cell(122, 79);
  cell1.grid = { serialNumber: 57 };
  assert.equal(cell1.calcPowerLevel(), -5);
  const cell2 = new Cell(217, 196);
  cell2.grid = { serialNumber: 39 };
  assert.equal(cell2.calcPowerLevel(), 0);
  const cell3 = new Cell(101, 153);
  cell3.grid = { serialNumber: 71 };
  assert.equal(cell3.calcPowerLevel(), 4);
}

function part1(serialNumber, coords) {
  const SERIAL_NUMBER = serialNumber;
  const COORDS = coords;
  const SIZE = 300;
  const grid = new Grid(SERIAL_NUMBER, SIZE);
  if (coords) {
    assert.equal(grid.calcBestSquare().coord.join(", "), COORDS.join(", "));
  } else {
    console.log(grid.calcBestSquare().coord);
  }
}

function testPart1() {
  const SERIAL_NUMBER = 18;
  const COORDS = [33, 45];
  part1(SERIAL_NUMBER, COORDS);
}

function testPart1_2() {
  const SERIAL_NUMBER = 42;
  const COORDS = [21, 61];
  part1(SERIAL_NUMBER, COORDS);
}

function solvePart1() {
  const SERIAL_NUMBER = 7672;
  part1(SERIAL_NUMBER);
}

if (require.main === module) {
  testFuelCells();
  testPart1();
  testPart1_2();
  solvePart1();
}
