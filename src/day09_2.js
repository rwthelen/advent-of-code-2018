const assert = require("assert");
const { PerformanceObserver, performance } = require("perf_hooks");

const obs = new PerformanceObserver(items => {
  // console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ entryTypes: ["measure"] });

class CircularLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.length = 0;
  }

  add(value) {
    const node = new Node(value);
    if (this.head == null) {
      this.head = node;
      this.tail = node;
      node.next = this.head;
    } else {
      const prevTail = this.tail;
      prevTail.next = node;
      node.prev = prevTail;
      node.next = this.head;
      this.tail = node;
      this.head.prev = node;
    }
    this.length += 1;
  }

  insert(value) {
    const node = new Node(value);
    node.prev = this.current;
    node.next = this.current.next;

    this.current.next.prev = node;
    this.current.next = node;
    this.current = node;
  }

  remove() {
    const removed = this.current;
    const left = removed.prev;
    const right = removed.next;
    left.next = right;
    right.prev = left;
    this.current = right;
    return removed;
  }

  next() {
    if (this.current) {
      this.current = this.current.next;
    } else {
      this.current = this.head;
    }
  }

  prev() {
    if (this.current) {
      this.current = this.current.prev;
    } else {
      this.current = this.head;
    }
  }
}

class Node {
  constructor(value, next = null, prev = null) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}

class Game {
  constructor(input) {
    const [players, marbles] = input
      .split(" ")
      .map(e => parseInt(e))
      .filter(e => !isNaN(e));
    // set up marbles
    this.marbles = Array.from({ length: marbles + 1 }, (_, i) => marbles - i);
    // set up players
    this.players = {
      currentIndex: 0,
      arr: Array.from({ length: players }).fill(0)
    };
    // set up linked list
    this.circle = new CircularLinkedList();
    this.circle.add(this.marbles.pop());
    this.circle.next(); // hacky, sets current to head
  }

  placeNextMarble() {
    performance.mark("A");
    const marble = this.marbles.pop();
    performance.mark("B");
    performance.measure("A to B", "A", "B");
    if (marble % 23 === 0) {
      for (let i = 0; i < 7; i++) {
        this.circle.prev();
      }
      let m = this.circle.remove();
      this.players.arr[this.players.currentIndex] += m.value + marble;
    } else {
      this.circle.next();
      this.circle.insert(marble);
    }
    this.nextPlayer();
  }

  nextPlayer() {
    const length = this.players.arr.length;
    const index = this.players.currentIndex;
    this.players.currentIndex = (((index + 1) % length) + length) % length;
  }

  complete() {
    while (this.marbles.length) {
      this.placeNextMarble();
    }
  }

  get highScore() {
    return this.players.arr.sort().reverse()[0];
  }
}

function basicTest() {
  const INPUT = "9 players; last marble is worth 25 points";
  const game = new Game(INPUT);
  game.complete();
  assert.equal(game.highScore, 32);
}

function testPart1() {
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
  game_1.complete();
  game_2.complete();
  game_3.complete();
  game_4.complete();
  game_5.complete();
  assert.equal(game_1.highScore, 8317);
  assert.equal(game_2.highScore, 146373);
  assert.equal(game_3.highScore, 2764);
  assert.equal(game_4.highScore, 54718);
  assert.equal(game_5.highScore, 37305);
}

function part1() {
  const INPUT = "418 players; last marble is worth 71339 points";
  const game = new Game(INPUT);
  game.complete();
  console.log(game.highScore);
}

function part2() {
  const INPUT = `418 players; last marble is worth 7133900 points`;
  const game = new Game(INPUT);
  game.complete();
  console.log(game.highScore);
}

if (require.main === module) {
  basicTest();
  testPart1();
  part1();
  part2();
}
