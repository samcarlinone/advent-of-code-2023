const inputString = document.querySelector('pre').innerText.trim();

const lines = inputString.split('\n');

// Part 1
const cardMatchCounts = lines.map(line => {
  const NAME_LENGTH = 8;

  const [winningStr, haveStr] = line.slice(NAME_LENGTH).split(' | ');

  const winningSet = new Set(winningStr.split(/\s+/));

  return haveStr.split(/\s+/).filter(n => winningSet.has(n)).length;
});

const calculateScore = n => n === 0 ? 0 : (2 ** (n - 1));

const cardScores = cardMatchCounts.map(calculateScore);

console.log(`Total card score = ${cardScores.reduce((t, n) => t + n)}`);

// Part 2
const cardMemo = new Map();

const countCards = index => {
  const memoCount = cardMemo.get(index);

  if (memoCount !== undefined) return memoCount;

  let count = 1;

  for (let offset = 1; offset <= cardMatchCounts[index]; offset++) {
    count += countCards(index + offset);
  }

  cardMemo.set(index, count);
  return count;
}

const cardCounts = cardScores.map((_, i) => countCards(i));

console.log(`Total card count = ${cardCounts.reduce((t, n) => t + n)}`);
