const inputString = document.querySelector('pre').innerText.trim();

const grid = inputString.split('\n');

const rowMax = grid.length;
const colMax = grid[0].length;

const DIRECTIONS = {
  NORTH: 0,
  WEST: 1,
  SOUTH: 2,
  EAST: 3,
};

const DIRECTION_TRAVEL_TO_PIPE = {
  [DIRECTIONS.NORTH]: DIRECTIONS.SOUTH,
  [DIRECTIONS.SOUTH]: DIRECTIONS.NORTH,
  [DIRECTIONS.WEST]: DIRECTIONS.EAST,
  [DIRECTIONS.EAST]: DIRECTIONS.WEST,
};

const DIRECTION_OFFSETS = {
  [DIRECTIONS.NORTH]: [-1, 0],
  [DIRECTIONS.SOUTH]: [ 1, 0],
  [DIRECTIONS.WEST]: [0, -1],
  [DIRECTIONS.EAST]: [0,  1],
};

const TILES = {
  '|': [DIRECTIONS.NORTH, DIRECTIONS.SOUTH],
  '-': [DIRECTIONS.EAST, DIRECTIONS.WEST],
  'L': [DIRECTIONS.NORTH, DIRECTIONS.EAST],
  'J': [DIRECTIONS.NORTH, DIRECTIONS.WEST],
  '7': [DIRECTIONS.SOUTH, DIRECTIONS.WEST],
  'F': [DIRECTIONS.SOUTH, DIRECTIONS.EAST],
};

const START_TILE = 'S';

const findStart = () => {
  for (let row = 0; row < rowMax; row++) {
    for (let col = 0; col < colMax; col++) {
      if (grid[row][col] === START_TILE) return [row, col];
    }
  }
}

const applyOffset = (pos, offset) => [pos[0] + offset[0], pos[1] + offset[1]];

const traceLoop = () => {
  const start = findStart();

  let runners = Object.values(DIRECTIONS).map(direction => ({
    pos: start,
    dir: direction,
    visited: [start],
  }));

  for (let distance = 0; distance < 100_000; distance++) {
    // Check if loop is closed
    for (let runner of runners) {
      const isLoopClosed = runners.some(r => {
        if (r === runner) return false;

        return runner.pos[0] === r.pos[0] && runner.pos[1] === r.pos[1];
      });

      if (isLoopClosed && distance > 0) {
        if (runners.length > 2) console.warn('Should not be more than 2 runners');

        const loopPoints = new Set();

        runners.forEach(r => r.visited.forEach(p => loopPoints.add(`${p[0]}, ${p[1]}`)));

        return {distance, loopPoints};
      }
    }

    // Move runners
    for (let runner of runners) {
      const nextPos = applyOffset(runner.pos, DIRECTION_OFFSETS[runner.dir]);

      const pipeDirections = TILES[grid[nextPos[0]]?.[nextPos[1]]];

      const runnerPipeSide = DIRECTION_TRAVEL_TO_PIPE[runner.dir]

      if (pipeDirections && pipeDirections.includes(runnerPipeSide)) {
        runner.pos = nextPos;
        runner.dir = pipeDirections[pipeDirections[0] === runnerPipeSide ? 1 : 0];

        runner.visited.push(nextPos);
      } else {
        runner.dead = true;
      }
    }

    // Remove dead runners
    runners = runners.filter(r => !r.dead);
    if (runners.length === 0) throw new Error('All runners died');
  }
};

const {distance, loopPoints} = traceLoop();

console.log(`Farthest distance = ${distance}`);

// Could be more efficient!
// based on point in polygon raycast crossing number
// go diagonally to simplify geometric calculations
// imagine that corners are pushed slightly beyond the midpoint and
// L and 7 are ignored since the ray crosses twice
let pointsInsideLoop = 0;

for (let row = 0; row < rowMax; row++) {
  for (let col = 0; col < colMax; col++) {
    if (loopPoints.has(`${row}, ${col}`)) continue;

    let wallCount = 0;

    for (let offset = 1; (row + offset < rowMax) && (col + offset < colMax); offset++) {
      if (loopPoints.has(`${row + offset}, ${col + offset}`)) {
        const tile = grid[row + offset][col + offset];

        if (tile !== 'L' && tile !== '7') wallCount++;
      }
    }

    if (wallCount % 2 === 1) pointsInsideLoop += 1;
  }
}

console.log(`Points inside loop = ${pointsInsideLoop}`);
