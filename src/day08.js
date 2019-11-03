// Length of A: 16
// Length of B: 5 (header.length + metadata)
// Length of C: 6 (header.length + metadata + child.header.length + child.metadata)
// Length of D: 3

const assert = require("assert");
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

class Node {
  constructor(input) {
    this.input = input.split(" ").map(str => parseInt(str));
    this.header = this.parseHeader();
    this.childNodes = [];
    this.metadata = [];

    this.parseChildNodes();
    this.parseMetadata();
  }

  get lengthOfAllChildren() {
    let lengthOfAllChildren;
    if (this.childNodes.length > 0) {
      lengthOfAllChildren = this.childNodes
        .map(child => child.length)
        .reduce((sum, child) => sum + child);
    } else {
      lengthOfAllChildren = 0;
    }
    return lengthOfAllChildren;
  }

  get length() {
    return 2 + this.lengthOfAllChildren + this.header.numMetadataEntries;
  }

  get sumMetadata() {
    return this.metadata.reduce((sum, n) => sum + n, 0);
  }

  get value() {
    if (this.childNodes.length === 0) {
      return this.sumMetadata;
    } else {
      let value = 0;
      for (const entry of this.metadata) {
        const child = this.childNodes[entry - 1];
        if (child) {
          value += child.value;
        }
      }
      return value;
    }
  }

  sumAllMetadata() {
    let sum = this.sumMetadata;
    for (const child of this.childNodes) {
      sum += child.sumAllMetadata();
    }
    return sum;
  }

  parseHeader() {
    const [numNodes, numMetadataEntries] = this.input.slice(0, 2);
    return { numNodes, numMetadataEntries };
  }

  parseMetadata() {
    this.metadata = this.input.slice(2 + this.lengthOfAllChildren, this.length);
  }

  parseChildNodes() {
    if (this.header.numNodes === 0) {
      return;
    } else {
      for (let i = 0; i < this.header.numNodes; i++) {
        while (this.childNodes.length < this.header.numNodes) {
          let input = this.input.slice(
            2 + this.lengthOfAllChildren,
            this.input.length - this.header.numNodes
          );
          let child = new Node(input.join(" "));
          this.childNodes.push(child);
        }
      }
    }
  }
}

async function testPart1() {
  const TEST_INPUT = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2";
  const tree = new Node(TEST_INPUT);
  assert.equal(tree.sumAllMetadata(), 138);
}

async function solvePart1() {
  const input = await readFile(__dirname + "/../input/day08.txt", "utf8");
  const tree = new Node(input);
  console.log(tree.sumAllMetadata());
}

async function testPart2() {
  const NODE_C = "1 1 0 1 99 2";
  const treeC = new Node(NODE_C);
  assert.equal(treeC.value, 0);
  const NODE_A = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2";
  const treeA = new Node(NODE_A);
  assert.equal(treeA.value, 66);
}

async function solvePart2() {
  const input = await readFile(__dirname + "/../input/day08.txt", "utf8");
  const tree = new Node(input);
  console.log(tree.value);
}

if (require.main === module) {
  testPart1();
  solvePart1();
  testPart2();
  solvePart2();
}
