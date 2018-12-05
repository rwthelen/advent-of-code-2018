const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);
    
const Day01Solution = require("./day01");
const Day02Solution = require("./day02");
const Day03Solution = require("./day03");

async function getInput(inputPath) {
    let input = await readFile(inputPath, "utf8")
        .then((input) => input.split("\n"));
    return input;
}

async function main() {
    console.log("Day 01:")
    const day01Input = await getInput("./input/day01.txt");
    const day01 = new Day01Solution(day01Input);
    day01.calculateFrequency();
    console.log("Skipping Day 1, Part 2...")
    // day01.calibrateFrequency(); // too slow

    console.log("\nDay 02:")
    const day02Input = await getInput("./input/day02.txt");
    const day02 = new Day02Solution(day02Input);
    day02.calculateChecksum();
    day02.findBoxes();

    console.log("\nDay 03:")
    const day03Input = await getInput("./input/day03.txt");
    const day03 = new Day03Solution(day03Input);
    day03.markClaims();
    day03.findStandaloneClaim();
}

main();