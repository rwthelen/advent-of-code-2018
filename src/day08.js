const assert = require("assert");
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

const HEADER_LENGTH = 2;

class Node {
  constructor(input) {
    this.input = input.split(" ").map(str => parseInt(str));
    this.numNodes = this.input[0];
    this.numMetadataEntries = this.input[1];
    this.childNodes = [];
    this.metadata = [];

    this.parseChildNodes();
    this.parseMetadata();
  }

  get lengthOfChildNodes() {
    return this.childNodes
      .map(child => child.length)
      .reduce((sum, child) => sum + child, 0);
  }

  get length() {
    return HEADER_LENGTH + this.lengthOfChildNodes + this.numMetadataEntries;
  }

  get sumMetadata() {
    return this.metadata.reduce((sum, n) => sum + n, 0);
  }

  get value() {
    if (this.childNodes.length === 0) {
      return this.sumMetadata;
    } else {
      return this.metadata
        .map(n => this.childNodes[n - 1])
        .filter(child => child !== undefined)
        .map(child => child.value)
        .reduce((sum, value) => sum + value, 0);
    }
  }

  sumAllMetadata() {
    return this.childNodes
      .map(child => child.sumAllMetadata())
      .reduce((sum, current) => sum + current, this.sumMetadata);
  }

  parseMetadata() {
    this.metadata = this.input.slice(
      HEADER_LENGTH + this.lengthOfChildNodes,
      this.length
    );
  }

  parseChildNodes() {
    if (this.numNodes === 0) {
      return;
    } else {
      for (let i = 0; i < this.numNodes; i++) {
        while (this.childNodes.length < this.numNodes) {
          let input = this.input.slice(
            HEADER_LENGTH + this.lengthOfChildNodes,
            this.input.length - this.numMetadataEntries
          );
          let child = new Node(input.join(" "));
          this.childNodes.push(child);
        }
      }
    }
  }
}

function part1(input) {
  const tree = new Node(input);
  return tree.sumAllMetadata();
}

async function testPart1() {
  const input = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2";
  const solution = part1(input);
  assert.equal(solution, 138);
}

async function solvePart1() {
  const input = await readFile(__dirname + "/../input/day08.txt", "utf8");
  const solution = part1(input);
  console.log(solution);
}

function part2(input) {
  const tree = new Node(input);
  return tree.value;
}

async function testPart2() {
  const input1 = "1 1 0 1 99 2";
  const test1 = part2(input1);
  assert.equal(test1, 0);
  const input2 = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2";
  const test2 = part2(input2);
  assert.equal(test2, 66);
}

async function solvePart2() {
  const input = await readFile(__dirname + "/../input/day08.txt", "utf8");
  const solution = part2(input);
  console.log(solution);
}

if (require.main === module) {
  testPart1();
  solvePart1();
  testPart2();
  solvePart2();
}
