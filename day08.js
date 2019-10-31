const assert = require("assert");

class Tree {
  constructor(input) {
    this.input = input.split(" ");
    this.root = new Node(this.input);
  }

  getSumOfMetadataEntries() {}
}

class Node {
  constructor(input) {
    this.input = input;
    this.header = this.parseHeader();
    this.childNodes = this.parseChildNodes();
    this.metadataEntries = null;
  }

  parseHeader() {
    const [numNodes, numMetadataEntries] = this.input.slice(0, 2);
    return { numNodes, numMetadataEntries };
  }

  parseChildNodes() {
    const inputBody = this.input.slice(
      2,
      this.input.length - this.header.numMetadataEntries
    );
    const numNodes = this.header.numNodes;
    const nodes = Array.from({ length: numNodes }, (_, i) => {});
  }
}

async function testPart1() {
  TEST_INPUT = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2";
  const tree = new Tree(TEST_INPUT);
  assert.equal(tree.getSumOfMetadataEntries(), 138);
}

if (require.main === module) {
  testPart1();
}
