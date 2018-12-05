class Solution {
    constructor(input){
        this.frequency = 0;
        this.input = input.map((frequencyChange) => parseInt(frequencyChange));
        this.frequencyLog = [this.frequency];
        this.repeatedFrequency = null;
    }

    calculateFrequency() {
        const reducer = (frequency, frequencyChange) => frequency + frequencyChange;
        const finalFrequency = this.input.reduce(reducer, this.frequency);
        console.log(`The solution for Day 1, Part 1 is: ${finalFrequency}`);
    }

    calibrateFrequency() {
        const reducer = (frequency, frequencyChange) => {
            const newFrequency = frequency + frequencyChange;
            if (this.frequencyLog.includes(newFrequency) && this.repeatedFrequency == null) {
                this.repeatedFrequency = newFrequency;
            }
            this.frequencyLog.push(newFrequency);
            return newFrequency;
        }

        while (this.repeatedFrequency == null) {
            this.frequency = this.input.reduce(reducer, this.frequency);
        }

        console.log(`The solution for Day 1, Part 2 is: ${this.repeatedFrequency}`);
    }
}

if (require.main === module) {
    const util = require("util");
    const fs = require("fs");
    const readFile = util.promisify(fs.readFile);

    async function getInput(inputPath) {
        let input = await readFile(inputPath, "utf8")
            .then((input) => input.split("\n"))
        return input;
    }
    
    async function main() {
        const input = await getInput(__dirname + "/../../input/day01.txt");
        const solution = new Solution(input);
        solution.calculateFrequency();
        solution.calibrateFrequency();
    }

    main();
}

module.exports = Solution;