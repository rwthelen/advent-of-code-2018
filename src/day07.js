const assert = require("assert");
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

const TEST_INPUT = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`;
const TEST_PART_1_WORKERS = 1;
const TEST_PART_1_BASE_TASK_TIME = 0;
const TEST_PART_1_SOLUTION = "CABDFE";

const TEST_PART_2_WORKERS = 2;
const TEST_PART_2_BASE_TASK_TIME = 0;
const TEST_PART_2_SOLUTION = 15;

class Worker {
  constructor(id) {
    this.id = "w" + (id + 1);
    this.assignment = null;
    this.timeDone = Infinity;
  }

  completeAssignment() {
    this.assignment.complete();
    this.assignment = null;
    this.doneAt = Infinity;
  }

  setAssignment(step, timeDone) {
    this.assignment = step;
    this.assignment.assigned = true;
    this.timeDone = timeDone;
  }

  getAssignment() {
    if (this.assignment) {
      return this.assignment;
    } else {
      return { name: "-" };
    }
  }

  isEveryDepCompleted() {}
}

class Step {
  constructor(name, deps, job) {
    this.name = name;
    this.deps = deps;
    this.completed = false;
    this.assigned = false;
    this.job = job;
  }

  complete() {
    this.completed = true;
  }

  isEveryDepCompleted() {
    return this.deps.every(dep => this.job.completedSteps.includes(dep));
  }

  getDependencies() {
    const deps = this.job.input
      .split("\n")
      .filter(line => line.substring(36, 37) === this.name)
      .map(line => line.substring(5, 6));
    return deps;
  }
}

class Job {
  constructor(input) {
    this.steps = this.getSteps(input);
    this.completedSteps = [];
    this.timeLog = [];
  }

  getSteps(input) {
    function reducer(accumulator, steps) {
      for (const step of steps) {
        if (!accumulator[step]) {
          accumulator[step] = [];
        }
      }
      const [dep, step] = steps;
      accumulator[step].push(dep);
      return accumulator;
    }

    const stepsMap = input
      .split("\n")
      .map(l => [l.substring(5, 6), l.substring(36, 37)])
      .reduce(reducer, {});

    const steps = Object.keys(stepsMap).map(
      key => new Step(key, stepsMap[key], this)
    );
    return steps;
  }

  execute(numWorkers, baseTaskTime) {
    let curTime = 0;
    const workers = Array.from({ length: numWorkers }, (_, i) => new Worker(i));
    while (!this.steps.every(step => step.completed)) {
      let curState = {};
      for (const worker of workers) {
        if (worker.assignment) {
          if (worker.timeDone === curTime) {
            this.completedSteps.push(worker.assignment.name);
            worker.completeAssignment();
          }
        }

        if (worker.assignment === null) {
          const next = this.findNextStep();
          if (next) {
            const stepDuration = baseTaskTime + (next.name.charCodeAt() - 64);
            const timeDone = curTime + stepDuration;
            worker.setAssignment(next, timeDone);
          }
        }
        curState[worker.id] = worker.getAssignment();
      }
      curState["Second"] = curTime;
      curState["Done"] = this.completedSteps.join("");
      this.timeLog.push(curState);
      curTime++;
    }
  }

  findNextStep() {
    function sortFn(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (b.name < a.name) {
        return 1;
      } else {
        return 0;
      }
    }
    const next = this.steps
      .filter(step => !step.completed && !step.assigned)
      .filter(step => step.isEveryDepCompleted())
      .sort(sortFn)[0];
    return next;
  }
}

class Main {
  constructor(input, numWorkers, baseTaskTime) {
    this.input = input;
    this.numWorkers = numWorkers;
    this.baseTaskTime = baseTaskTime;
  }

  main() {
    const job = new Job(this.input);
    job.execute(this.numWorkers, this.baseTaskTime);
    return job.completedSteps.join("");
  }
}

function testPart1() {
  const solution = new Main(
    TEST_INPUT,
    TEST_PART_1_WORKERS,
    TEST_PART_1_BASE_TASK_TIME
  ).main();
  assert.equal(solution, TEST_PART_1_SOLUTION);
  console.log(`The Part One test passed, the solution is ${solution}`);
}

async function testPart2() {
  const job = new Job(TEST_INPUT);
  job.execute(TEST_PART_2_WORKERS, TEST_PART_2_BASE_TASK_TIME);
  const solution = job.timeLog[job.timeLog.length - 1].Second;
  assert.equal(solution, TEST_PART_2_SOLUTION);
  console.log(`The Part Two test passed, the solution is ${solution}`);
}

async function solvePart2() {
  const input = await readFile(__dirname + "/../input/day07.txt", "utf8");
  const job = new Job(input);
  job.execute(5, 60);
  const solution = job.timeLog[job.timeLog.length - 1].Second;
  // assert.equal(solution, TEST_PART_2_SOLUTION);
  console.log(`Part Two Success! The solution is ${solution}`);
}

async function solvePart1() {
  const input = await readFile(__dirname + "/../input/day07.txt", "utf8");
  const solution = new Main(input, 1, 0).main();
  console.log(`Part One Success! The solution is: ${solution}`);
}

if (require.main === module) {
  testPart1();
  solvePart1();
  testPart2();
  solvePart2();
}
