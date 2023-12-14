const inputString = document.querySelector('pre').innerText.trim();

const calculateDifferences = list =>
  list.slice(0, -1).map((n, i) => list[i + 1] - n);


const getNextInSeries = list => {
  const differenceSequences = [calculateDifferences(list)];

  while (!differenceSequences[0].every(n => n === 0)) {
    differenceSequences.unshift(calculateDifferences(differenceSequences[0]));
  }

  return differenceSequences.reduce((t, seq) => t + seq[seq.length - 1], list[list.length - 1]);
};

const getPreviousInSeries = list => {
  const differenceSequences = [calculateDifferences(list)];

  while (!differenceSequences[0].every(n => n === 0)) {
    differenceSequences.unshift(calculateDifferences(differenceSequences[0]));
  }

  return list[0] - differenceSequences
    .slice(1)
    .reduce((t, seq) => seq[0] - t, 0);
};

const lists = inputString
  .split('\n')
  .map(line => line.split(' ').map(n => Number(n)));

const nextValues = lists.map(getNextInSeries);
const prevValues = lists.map(getPreviousInSeries);

console.log(`Sum of extrapolated values = ${nextValues.reduce((t, n) => t + n)}`);
console.log(`Sum of extrapolated backwards values = ${prevValues.reduce((t, n) => t + n)}`);
