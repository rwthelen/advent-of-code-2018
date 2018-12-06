class Solution {
    constructor(input){
        this.input = this.mapInput(input);
        this.guardLog = {};
        this.guardSums = {};
    }

    strategy1() {
        let currentGuardID;
        let fellAsleepAt;
        let wokeUpAt;

        for (const entry of this.input) {
            if (entry.description.includes("begins shift")) {
                currentGuardID = entry.description.replace(" begins shift", "").split(" #")[1]
            } else if (entry.description.includes("falls asleep")) {
                fellAsleepAt = entry.date.getMinutes();
            } else if (entry.description.includes("wakes up")) {
                wokeUpAt = entry.date.getMinutes();
                if (!this.guardLog[currentGuardID]) {
                    this.guardLog[currentGuardID] = []
                }
                for (let minute = fellAsleepAt; minute < wokeUpAt; minute++) {
                    this.guardLog[currentGuardID].push({minute, date: entry.date})
                }
            }
        }
        
        this.guardSums = Object.keys(this.guardLog).map((guardID) => {
            let sum = this.guardLog[guardID].length;
            let minuteSums = this.guardLog[guardID].reduce((sums, currentEntry) => {
                sums[currentEntry.minute] = sums[currentEntry.minute] ? sums[currentEntry.minute] + 1 : 1;
                return sums;
            }, {});
            let sleepiestMinute = Object.keys(minuteSums).sort((a, b) => minuteSums[b] - minuteSums[a])[0];
            let sleepiestMinuteSum = minuteSums[sleepiestMinute];
            return {
                guardID,
                sum,
                minuteSums,
                sleepiestMinute,
                sleepiestMinuteSum
            }
        }).sort((a, b) => b.sum - a.sum)

        console.log(`The solution to Day 4, Part 1 is ${this.guardSums[0].guardID * this.guardSums[0].sleepiestMinute}`)
    }

    strategy2() {
        // depends upon strategy1 running beforehand
        let solution = this.guardSums.sort((a, b) => b.sleepiestMinuteSum - a.sleepiestMinuteSum)[0];
        console.log(`The solution to Day 4, Part 2 is ${solution.guardID * solution.sleepiestMinute}`)
    }

    mapInput(input) {
        return input.map((entry) => {
            const timestamp = entry.slice(1, 17);
            const description = entry.slice(19);
            const date = new Date(timestamp);

            return {
                date,
                description
            }
        }).sort((a, b) => a.date - b.date)
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
        const input = await getInput(__dirname + "/../input/day04.txt");
        const solution = new Solution(input);
        solution.strategy1();
        solution.strategy2();
    }
    
    main();
}

module.exports = Solution;
