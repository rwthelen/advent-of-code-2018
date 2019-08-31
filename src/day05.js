class Solution {
    constructor(input){
        this.input = input[0]
    }

    scanPolymer(input) {
        let prevChar;
        let allDone = false;
        let output = input ? input : this.input;

        while (!allDone) {
            allDone = true;
            for (const char of output) {
                if (prevChar && char !== prevChar) {
                    if (char == prevChar.toLowerCase() || char == prevChar.toUpperCase()) {
                        output = output.replace(prevChar + char, "");
                        allDone = false;
                        prevChar = char;
                        break;
                    }
                }
                prevChar = char;
            }
        }

        if (!input) {
            console.log(`The solution to Day 5, Part 1 is ${output.length}`);
        }

        return output;
    }

    produceShortestPolymer() {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        let results = {};
        for (const char of alphabet) {
            let output = this.input;
            const re = new RegExp(char, 'gi')
            output = output.replace(re, "");
            output = this.scanPolymer(output);
            results[char] = output.length;
        }
        const shortest = Object.values(results).sort((a,b) => a-b)[0];
        console.log(`The solution to Day 5, Part 1 is ${shortest}`);
    }
}

if (require.main === module) {
    const util = require("util");
    const fs = require("fs");
    const readFile = util.promisify(fs.readFile);

    async function getInput(inputPath) {
        let input = await readFile(inputPath, "utf8");
        input = input
            .split("\n");
        return input;
    }
    
    async function main() {
        const input = await getInput(__dirname + "/../input/day05.txt");
        const solution = new Solution(input);
        // solution.scanPolymer();
        solution.produceShortestPolymer();
    }
    
    main();
}

module.exports = Solution;
