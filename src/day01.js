const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

class Solution {
  constructor(input) {
    this.input = input.split("\n").map(n => parseInt(n));
  }

  calculateFrequency() {
    const finalFrequency = this.input.reduce((a, b) => a + b, 0);
    console.log(`The solution for Day 1, Part 1 is: ${finalFrequency}`);
  }

  calibrateFrequency() {
    let frequency = 0;
    let duplicate = null;
    let seen = new Set();
    while (!duplicate) {
      for (let f of this.input) {
        if (seen.has(frequency)) {
          duplicate = true;
          break;
        } else {
          seen.add(frequency);
          frequency += f;
        }
      }
    }
    console.log(`The solution for Day 1, Part 2 is: ${frequency}`);
  }
}

async function main() {
  const input = await readFile(__dirname + "/../input/day01.txt", "utf-8");
  const solution = new Solution(input);
  solution.calculateFrequency();
  solution.calibrateFrequency();
}

main();
