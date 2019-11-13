const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);
const appendFile = util.promisify(fs.appendFile);

const minReducer = (curMin, current) => (current < curMin ? current : curMin);
const maxReducer = (curMax, current) => (current > curMax ? current : curMax);

function parseCoords(str) {
  return str
    .split(", ")
    .map(e => e.trim())
    .map(e => parseInt(e));
}

function parsePoint(line) {
  const split = line.split(/[<>]/g);
  const position = parseCoords(split[1]);
  const velocity = parseCoords(split[3]);
  const point = new Point(position, velocity);
  return point;
}

class Message {
  constructor(input) {
    this.originalInput = input;
    this.reset();
  }

  reset() {
    const input = this.originalInput;
    this.outputPath = __dirname + "/../output/day10_output.txt";
    this.input = input.split("\n").map(parsePoint);
    this.second = 0;
    this.prevWidth = Infinity;
    this.setBounds();
  }

  setBounds() {
    this.xMin = this.input.map(point => point.position[0]).reduce(minReducer);
    this.xMax = this.input.map(point => point.position[0]).reduce(maxReducer);
    this.yMin = this.input.map(point => point.position[1]).reduce(minReducer);
    this.yMax = this.input.map(point => point.position[1]).reduce(maxReducer);
  }

  print() {
    const input = this.input.map(p => p.position);
    const { xMin, xMax, yMin, yMax } = this;
    console.log(`${this.second} seconds:\n`);
    for (let y = yMin; y <= yMax; y++) {
      let line = "";
      for (let x = xMin; x <= xMax; x++) {
        if (input.find(e => e[0] === x && e[1] === y)) {
          line += "#";
        } else {
          line += ".";
        }
      }
      console.log(line);
    }
    console.log("\n\n");
  }

  tick() {
    this.second += 1;
    this.input = this.input.map(p => {
      p.position[0] += p.velocity[0];
      p.position[1] += p.velocity[1];
      return p;
    });
    this.setBounds();
  }

  get width() {
    return this.xMax - this.xMin;
  }
}

class Point {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
  }
}

async function testPart1() {
  const INPUT = await readFile(__dirname + "/../input/day10_test.txt", "utf8");
  const message = new Message(INPUT);
  let bestTime;
  do {
    message.prevWidth = message.width;
    message.tick();
    bestTime = message.second - 1;
  } while (message.prevWidth > message.width);
  message.reset();
  for (let i = 0; i !== bestTime; i++) {
    message.tick();
  }
  message.print();
}

async function part1() {
  const INPUT = await readFile(__dirname + "/../input/day10.txt", "utf8");
  const message = new Message(INPUT);
  let bestTime;
  do {
    message.prevWidth = message.width;
    message.tick();
    bestTime = message.second - 1;
  } while (message.prevWidth > message.width);
  message.reset();
  for (let i = 0; i !== bestTime; i++) {
    message.tick();
  }
  message.print();
}

if (require.main === module) {
  testPart1();
  part1();
}
