const assert = require("assert");

class Circular extends Array {
  constructor(...baseArray) {
    super(...baseArray);
    this.currentIndex = 0;
  }

  current() {
    return this[this.currentIndex];
  }

  next(n = 1) {
    this.currentIndex = this.modulo(n);
    return this.current();
  }

  prev(n = 1) {
    this.currentIndex = this.modulo(-n);
    return this.current();
  }

  modulo(n) {
    return (
      (((this.currentIndex + n) % this.length) + this.length) % this.length
    );
  }

  insert(value) {
    const index = this.currentIndex + 1;
    this.splice(index, 0, value);
    this.currentIndex = index;
  }

  remove() {
    const v = this.splice(this.currentIndex, 1)[0];
    return v;
  }

  slice() {
    const sliced = super.slice();

    sliced.currentIndex = this.currentIndex;

    return sliced;
  }

  toString() {
    const clone = this.slice();
    clone[clone.currentIndex] = "(" + clone[clone.currentIndex] + ")";
    return clone.join(" ");
  }
}

class Game {
  constructor(input) {
    const [players, marbles] = input
      .split(" ")
      .map(e => parseInt(e))
      .filter(e => !isNaN(e))
      .map(e => Array.from({ length: e }, (_, i) => i));
    this.marbles = marbles.concat(marbles[marbles.length - 1] + 1);
    this.players = new Circular(...players).fill(0);
    this.circle = new Circular();

    //   first turn
    this.circle.push(this.marbles.shift());
  }

  placeNextMarble() {
    let current = this.marbles.shift();
    if (current % 23 === 0) {
      this.circle.prev(7);
      let m = this.circle.remove();
      this.players[this.players.currentIndex] += m + current;
      // this.printTurn();
    } else {
      this.circle.next();
      this.circle.insert(current);
      console.log();
    }
    this.players.next();
  }

  complete() {
    while (this.marbles.length) {
      this.placeNextMarble();
    }
  }

  get highScore() {
    return this.players.sort().reverse()[0];
  }

  printTurn() {
    const current = this.circle[this.circle.currentIndex];
    const circle = this.circle;
    console.log(`[${current}] ${circle}`);
  }
}

function basicTest() {
  const INPUT = "9 players; last marble is worth 25 points";
  const game = new Game(INPUT);
  game.complete();
  assert.equal(game.highScore, 32);
}

async function testPart1() {
  const INPUT_1 = "10 players; last marble is worth 1618 points";
  const INPUT_2 = "13 players; last marble is worth 7999 points";
  const INPUT_3 = "17 players; last marble is worth 1104 points";
  const INPUT_4 = "21 players; last marble is worth 6111 points";
  const INPUT_5 = "30 players; last marble is worth 5807 points";
  const game_1 = new Game(INPUT_1);
  const game_2 = new Game(INPUT_2);
  const game_3 = new Game(INPUT_3);
  const game_4 = new Game(INPUT_4);
  const game_5 = new Game(INPUT_5);
  // game_1.complete();
  game_2.complete();
  // game_3.complete();
  // game_4.complete();
  // game_5.complete();
  // assert.equal(game_1.highScore, 8317);
  assert.equal(game_2.highScore, 146373);
  // assert.equal(game_3.highScore, 2764);
  // assert.equal(game_4.highScore, 54718);
  // assert.equal(game_5.highScore, 37305);
}

async function part1() {
  const INPUT = "418 players; last marble is worth 71339 points";
  const game = new Game(INPUT);
  game.complete();
  console.log(game.highScore);
}

if (require.main === module) {
  basicTest();
  testPart1();
  // part1();
}
