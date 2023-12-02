const inputString = document.querySelector('pre').innerText.trim();
const lines = inputString.split('\n');

// Part 1
const part1Bag = {
  red: 12,
  green: 13,
  blue: 14,
};

const gameScores = lines.map((line, index) => {
  const [_, subsets] = line.split(':');

  const hasInvalidEntry = subsets.split(';')
    .some(subset =>
      subset
        .split(',')
        .some(e => {
          const [n, color] = e.trim().split(' ');

          return Number(n) > part1Bag[color];
        })
    );

  if (hasInvalidEntry) return 0;

  return index + 1;
});

console.log(`Part 1 sum = ${gameScores.reduce((t, n) => t + n)}`);

// Part 2
const gamePowers = lines.map((line) => {
  const [_, subsets] = line.split(':');

  const counts = {
    red: 0,
    blue: 0,
    green: 0,
  };

  subsets.split(';')
    .forEach(subset =>
      subset
        .split(',')
        .forEach(e => {
          const [n, color] = e.trim().split(' ');

          counts[color] = Math.max(counts[color], Number(n));
        })
    );

  return Object.values(counts).reduce((p, n) => p * n);
});

console.log(`Part 2 sum = ${gamePowers.reduce((t, n) => t + n)}`);
