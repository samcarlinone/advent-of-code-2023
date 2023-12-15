const inputString = document.querySelector('pre').innerText.trim();

const grid = inputString.split('\n');

const rowMax = grid.length;
const colMax = grid[0].length;

const GALAXY = '#';

const galaxies = [];

const emptyRows = new Set(new Array(rowMax).fill(0).map((_, i) => i));
const emptyCols = new Set(new Array(colMax).fill(0).map((_, i) => i));

for (let row = 0; row < rowMax; row++) {
  for (let col = 0; col < colMax; col++) {
    if (grid[row][col] === GALAXY) {
      galaxies.push([row, col]);

      emptyRows.delete(row);
      emptyCols.delete(col);
    }
  }
}

const calculateDistances = expansionFactor => {
  let distanceSum = 0;

  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const [r1, c1] = galaxies[i];
      const [r2, c2] = galaxies[j];
  
      const cMin = Math.min(c1, c2);
      const cMax = Math.max(c1, c2);
      const rMin = Math.min(r1, r2);
      const rMax = Math.max(r1, r2);
  
      distanceSum += (rMax - rMin) + (cMax - cMin);
  
      distanceSum += [...emptyRows.values()].filter(row => rMin < row && row < rMax).length * (expansionFactor - 1);
      distanceSum += [...emptyCols.values()].filter(col => cMin < col && col < cMax).length * (expansionFactor - 1);
    }
  }

  return distanceSum;
}

console.log(`Young galaxies are ${calculateDistances(2)}`);
console.log(`Old galaxies are ${calculateDistances(1_000_000)}`);
