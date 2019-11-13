const assert = require("assert");

class CircularLinkedList {
  constructor() {
    this.current = null;
  }

  insert(value) {
    const node = new Node(value);
    if (this.current == null) {
      // Insert the new node into the linked list as the only node
      // The new node has circular references to itself as prev and next
      this.current = node;
      node.next = this.current;
      node.prev = this.current;
    } else {
      // Set prev and next on the new node
      node.prev = this.current;
      node.next = this.current.next;

      // Insert the new node into the linked list
      this.current.next.prev = node;
      this.current.next = node;
      this.current = node;
    }
  }

  remove() {
    const removed = this.current;
    // Update the surrounding nodes to skip the current node
    removed.prev.next = removed.next;
    removed.next.prev = removed.prev;

    this.current = removed.next;
    return removed;
  }

  next() {
    this.current = this.current.next;
  }

  prev() {
    this.current = this.current.prev;
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
    this.circle.insert(this.marbles.pop());
    this.circle.next(); // hacky, sets current to head
  }

  placeNextMarble() {
    const marble = this.marbles.pop();
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
