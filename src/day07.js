class Solution {
  constructor(input) {
    this.steps = this.getSteps(input);
    this.completedSteps = [];
    this.workLog = [];
  }

  getAnswer() {
    this.completeAllSteps();
    return this.completedSteps.join("");
  }

  //TODO: Refactor with completeAllSteps
  getTotalTime(workers, baseTaskTime) {
    var curSecond = 0;
    var workers = Array.from({ length: workers }, (_, i) => ({
      id: i + 1,
      busy: false,
      doneAt: Infinity
    }));
    while (!this.steps.every(step => step.completed)) {
      for (const worker of workers) {
        // on each tick, need to iterate through all workers and update their work
        if (worker.busy) {
          // if they're already working, need to determine if they're done
          // if they're done, need to mark the step complete
          // the worker will get assigned a new task on the next tick
          if (worker.doneAt === curSecond) {
            this.completeStep(next);
            this.completedSteps.push(next.name);
          }
        } else {
          // See if there is available work to assign
          // if there is available work, assign it to the worker
          const next = this.findNextStep();
          if (next) {
            const stepDuration = baseTaskTime + (next.name.charCodeAt() - 64);
            worker.doneAt = curSecond + stepDuration;
            worker.busy = true;
            next.assigned = true;
          }
        }
      }

      curSecond++;
    }
  }

  reset() {
    for (const step of this.steps) {
      step.completed = false;
    }
    this.completeSteps = [];
  }

  getSteps(input) {
    var steps = input
      .split("\n")
      .map(l => [l.substring(36, 37), l.substring(5, 6)])
      .reduce((prev, curr) => prev.concat(curr));
    steps = Array.from(new Set(steps));
    return steps.map(step => {
      return {
        name: step,
        deps: this.getStepDependencies(step, input),
        completed: false,
        assigned: false
      };
    });
  }

  completeAllSteps() {
    while (this.completedSteps.length < this.steps.length) {
      const next = this.findNextStep();
      this.completeStep(next);
      this.completedSteps.push(next.name);
    }
  }

  completeStep(step) {
    step.completed = true;
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
      .filter(step => this.isEveryDepCompleted(step))
      .sort(sortFn)[0];
    return next;
  }

  isEveryDepCompleted(step) {
    return step.deps.every(dep => this.completedSteps.includes(dep));
  }

  getStepDependencies(step, input) {
    const deps = input
      .split("\n")
      .filter(line => line.substring(36, 37) === step)
      .map(line => line.substring(5, 6));
    return deps;
  }
}

if (require.main === module) {
  const util = require("util");
  const fs = require("fs");
  const readFile = util.promisify(fs.readFile);

  async function tests() {
    const input = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`;
    const theAnswer = "CABDFE";
    const solution = new Solution(input);
    const answer = solution.getAnswer();
    if (answer === theAnswer) {
      console.log("Success!");
    } else {
      throw "YOU FAIL";
    }
    solution.reset();
    const totalTime = solution.getTotalTime(2, 0);
    console.log(totalTime);
  }

  async function test2() {
    const input = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`;
    const theAnswer = 15;
    const solution = new Solution(input);
    const totalTime = solution.getTotalTime(2, 0);
    console.log(totalTime);
  }

  async function main() {
    const input = await readFile(__dirname + "/../input/day07.txt", "utf8");
    const answer = new Solution(input).getAnswer();
    console.log(answer);
  }

  test2();
  // main();
}
