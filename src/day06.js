const minReducer = (curMin, current) => current < curMin ? current : curMin
const maxReducer = (curMax, current) => current > curMax ? current : curMax

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.grid = null
  }

  toString() {
    return `${this.x}, ${this.y}`
  }

  getManhattanDistanceTo(point) {
    return Math.abs(this.x - point.x) + Math.abs(this.y - point.y)
  }

  isBorderPoint() {
    const [xMin, xMax, yMin, yMax] = [this.grid.xMin, this.grid.xMax, this.grid.yMin, this.grid.yMax]
    return ([xMin, xMax].includes(this.x) || [yMin, yMax].includes(this.y))
  }

  // returns sorted array of input points and their distances to this point
  getDistances() {
    return this.grid.inputPoints
      .map(inputPoint => {
        return {
          inputPoint: inputPoint,
          distance: this.getManhattanDistanceTo(inputPoint)
        }
      })
      .sort((a, b) => a.distance - b.distance)
  }

  findClosestInputPoint() {
    // returns Point, or undefined if multiple points are closest
    const distances = this.getDistances()
    if (distances[0].distance === distances[1].distance) {
      return undefined
    } else {
      return distances[0].inputPoint
    }
  }

  getTotalDistanceToAllPoints() {
    const totalDistance = this.getDistances()
      .map(el => el.distance)
      .reduce((total, current) => total + current)
    return totalDistance
  }
}

// A collection of coordinates representing a rectangular area
// Takes a list of coordinates as input and returns a grid that encapsulates those coordinates
class Grid {
  constructor(inputPoints) {
    if (!inputPoints.every(p => p instanceof Point)) {
      throw "points must be an Array of Points"
    }
    this.inputPoints = inputPoints;
    this.xMin = this.inputPoints.map(point => point.x).reduce(minReducer)
    this.xMax = this.inputPoints.map(point => point.x).reduce(maxReducer)
    this.yMin = this.inputPoints.map(point => point.y).reduce(minReducer)
    this.yMax = this.inputPoints.map(point => point.y).reduce(maxReducer)
    this.points = this.generatePoints();
    this.borderPoints = this.selectBorderPoints();
  }

  generatePoints() {
    let points = []
    for (let y = this.yMin; y <= this.yMax; y++) {
      for (let x = this.xMin; x <= this.xMax; x++) {
        let point = new Point(x, y)
        point.grid = this
        points = points.concat(point)
      }
    }
    return points;
  }

  selectBorderPoints() {
    return this.points.filter(point => point.isBorderPoint())
  }

  getClosestInputPointsForEach() {
    return this.points.map(point => point.findClosestInputPoint())
      // remove undefined (indicates multiple input points are tied in distance to this point)
      .filter(p => !(p === undefined))
  }

  findLargestArea() {
    const areaSumsReducer = (accumulator, current) => {
      const coords = current.toString()
      accumulator[coords] ? accumulator[coords]++ : accumulator[coords] = 1
      return accumulator
    }
    const closestPointForEach = this.getClosestInputPointsForEach()
    const areaSums = closestPointForEach.reduce(areaSumsReducer, {})
    return Object.values(areaSums).reduce(maxReducer);
  }

  findSafestRegion(limit) {
    const totalDistances = this.points.map(p => p.getTotalDistanceToAllPoints())
    const sizeOfSafestRegion = totalDistances.filter(d => d < limit).length
    return sizeOfSafestRegion;
  }
}

if (require.main === module) {
  const util = require("util");
  const fs = require("fs");
  const readFile = util.promisify(fs.readFile);

  async function tests() {
    const input = [
      new Point(1, 1),
      new Point(1, 6),
      new Point(8, 3),
      new Point(3, 4),
      new Point(5, 5),
      new Point(8, 9)
    ]
    const myGrid = new Grid(input)
    const partOneSolution = myGrid.findLargestArea();
    const partTwoSolution = myGrid.findSafestRegion(32);
    if (partOneSolution === 17) {
      console.log(`The Part One test passed, the solution is ${partOneSolution}`)
    } else {
      throw "Part One test failed"
    }
    if (partTwoSolution === 16) {
      console.log(`The Part Two test passed, the solution is ${partTwoSolution}`)
    } else {
      throw "Part Two test failed"
    }
  }

  async function main() {
      let input = await readFile(__dirname + "/../input/day06.txt", "utf8");
      input = input
          .split("\n")
          .map(line => line.split(", "))
          .map(coords => new Point(parseInt(coords[0]), parseInt(coords[1])));
      const myGrid = new Grid(input)
      const partOneSolution = myGrid.findLargestArea();
      const partTwoSolution = myGrid.findSafestRegion(10000);
      if (partOneSolution === 4186) {
        console.log(`Part One Success! The solution is: ${partOneSolution}`)
      } else {
        throw "Part One failed"
      }
      if (partTwoSolution === 45509) {
        console.log(`Part Two success! The solution is: ${partTwoSolution}`)
      } else {
        throw "Part Two failed"
      }
  }

  tests()
  main()
}