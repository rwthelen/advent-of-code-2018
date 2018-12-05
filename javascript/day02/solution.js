const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

class BoxChecker {
    constructor(input){
        this.input = input;
        this.analyzedInput = this.input.map((boxID) => this.analyzeBoxID(boxID));
    }

    calculateChecksum() {
        const countWithDoubles = this.countBoxesWith(2);
        const countWithTriples = this.countBoxesWith(3);
        const solution = countWithDoubles * countWithTriples;
        console.log(`The solution for Day 2, Part 1 is: ${solution}`);
    }

    findBoxes() {
        const idLength = 26;
        for (let i = 0; i < idLength; i++) {
            let sliced = this.input.map((boxID) => boxID.slice(0, i) + boxID.slice(i + 1))
            let filtered = sliced.filter((boxID, boxIndex) => {
                let others = sliced.filter((boxID, index) => index !== boxIndex);
                return others.includes(boxID);
            })
            if (filtered.length) {
                console.log(`The solution for Day 2, Part 2 is: ${filtered[0]}`);
                break;
            }
        }
    }

    countBoxesWith(occurences) {
        return this.analyzedInput.reduce((sum, box) => {
            let counted = false;
            for (let key in box) {
                if (box[key] == occurences && counted == false) {
                    counted = true;
                    return sum + 1;
                } else {
                    continue;
                }
            }
            return sum;
        }, 0)
    }

    analyzeBoxID(id) {
        let charCounts = {};
        for (const letter of id) {
            charCounts[letter] = charCounts[letter] ? charCounts[letter] + 1 : 1;
        }
        return charCounts;
    }
}

async function getInput(inputPath) {
    let input = await readFile(inputPath, "utf8");
    input = input
        .split("\n");
    return input;
}

async function main() {
    const input = await getInput("../../input/day02.txt");
    const solution = new BoxChecker(input);
    solution.calculateChecksum();
    solution.findBoxes();
}

main();