class Solution {
    constructor(input){
        this.input = this.mapInput(input);
        this.ledger = {};
    }

    markClaims() {
        let ledger = {};

        this.input.forEach((claim) => {
            for (let row = 0; row < claim.height; row++) {
                for (let col = 0; col < claim.width; col++) {
                    let coord = [claim.leftEdge + 1 + col, claim.topEdge + 1 + row];
                    ledger[coord.join(",")] = ledger[coord.join(",")] ? ledger[coord.join(",")] + 1 : 1;
                }
            }
        })

        let sumOverlaps = Object.keys(ledger).reduce((sumOverlaps, coord) => {
            if (ledger[coord] >= 2) {
                return sumOverlaps + 1;
            } else {
                return sumOverlaps
            }
        }, 0);

        this.ledger = ledger;

        console.log(`The solution for Day 3, Part 1 is: ${sumOverlaps}`);
    }

    findStandaloneClaim() {
        this.input.forEach((claim) => {
            let coordClaimCounts = [];

            for (let row = 0; row < claim.height; row++) {
                for (let col = 0; col < claim.width; col++) {
                    let coord = [claim.leftEdge + 1 + col, claim.topEdge + 1 + row];
                    coordClaimCounts.push(this.ledger[coord.join(",")]);
                }
            }

            if (coordClaimCounts.every((count) => count == 1)) {
                console.log(`The solution for Day 3, Part 2 is: ${claim.id}`);
            }
        })
    }

    mapInput(input) {
        return input.map((claim) => {
            // "#123 @ 3,2: 5x4"
            return {
                leftEdge: parseInt(claim.split(" @ ")[1].split(": ")[0].split(",")[0]),
                topEdge: parseInt(claim.split(" @ ")[1].split(": ")[0].split(",")[1]),
                width: parseInt(claim.split(" @ ")[1].split(": ")[1].split("x")[0]),
                height: parseInt(claim.split(" @ ")[1].split(": ")[1].split("x")[1]),
                id: claim.split(" @ ")[0].split("#")[1]
            }
        })
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
        const input = await getInput(__dirname + "/../input/day03.txt");
        const solution = new Solution(input);
        solution.markClaims();
        solution.findStandaloneClaim();
    }
    
    main();
}

module.exports = Solution;
