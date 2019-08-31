const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);
    
const Day01Solution = require("./day01");
const Day02Solution = require("./day02");
const Day03Solution = require("./day03");
const Day04Solution = require("./day04");
const Day05Solution = require("./day05");

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
    day01.calibrateFrequency(); // TODO: optimize

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

    console.log("\nDay 04:")
    const day04Input = await getInput("./input/day04.txt");
    const day04 = new Day04Solution(day04Input);
    day04.strategy1();
    day04.strategy2();

    console.log("\nDay 05:")
    const day05Input = await getInput("./input/day05.txt");
    const day05 = new Day05Solution(day05Input);
    day05.scanPolymer(); // TODO: optimize
    day05.produceShortestPolymer(); // TODO: optimize
}

main();