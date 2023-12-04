const inputString = document.querySelector('pre').innerText.trim();

const lines = inputString.split('\n');

const lineLength = lines[0].length;
const length = lines.length * lineLength;

const isCharDigit = c => /\d/.test(c);
const isCharSymbol = c => /[^\d.]/.test(c);
const isGearSymbol = c => c === '*';

const adjacentOffsets = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1]
];

const hasAdjacentSymbol = (row, col) => {
  for (const [dR, dC] of adjacentOffsets) {
    if (isCharSymbol(lines[row + dR]?.[col + dC] ?? '.')) return true;
  }

  return false;
}

const getAdjacentGearIds = (row, col) => {
  const coords = [];

  for (const [dR, dC] of adjacentOffsets) {
    if (isGearSymbol(lines[row + dR]?.[col + dC] ?? '.')) coords.push(`${row + dR}, ${col + dC}`);
  }

  return coords;
}

let sum = 0;

const gearMap = new Map();

for (let row = 0; row < lines.length; row++) {
  let currentNumber = '';
  let adjacentSymbol = false;
  let gearCoords = new Set();

  for (let col = 0; col < lineLength; col++) {
    const c = lines[row][col];

    if (isCharDigit(c)) {
      currentNumber += c;

      if (!adjacentSymbol) adjacentSymbol = hasAdjacentSymbol(row, col);

      getAdjacentGearIds(row, col).forEach(id => gearCoords.add(id));
    } else {
      if (currentNumber !== '') {
        if (adjacentSymbol) sum += Number(currentNumber);

        gearCoords.forEach(id => gearMap.set(id, [...(gearMap.get(id) ?? []), Number(currentNumber)]));

        currentNumber = '';
        adjacentSymbol = false;
        gearCoords = new Set();
      }
    }
  }

  if (currentNumber !== '') {
    if (adjacentSymbol) sum += Number(currentNumber);

    gearCoords.forEach(id => gearMap.set(id, [...(gearMap.get(id) ?? []), Number(currentNumber)]));
  }
}

console.log(`Part 1 sum = ${sum}`); 

const gearSum = [...gearMap.values()]
  .filter(v => v.length === 2)
  .map(([v1, v2]) => v1 * v2)
  .reduce((t, n) => t + n);

console.log(`Part 2 gear sum = ${gearSum}`);
