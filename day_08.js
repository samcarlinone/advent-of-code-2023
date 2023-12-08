const inputString = document.querySelector('pre').innerText.trim();

const [directionsLine, _, ...mapLines] = inputString.split('\n');

const network = Object.fromEntries(mapLines.map(line => {
  const [_, label, L, R] = /(\w+) = \((\w+), (\w+)\)/.exec(line);

  return [label, {L, R}];
}));

// Part 1
const START_LABEL = 'AAA';
const END_LABEL = 'ZZZ';

const directions = directionsLine.trim().split('');

const countTraversal = () => {
  let label = START_LABEL;
  let stepCount = 0;
  let directionIndex = 0;

  while (label !== END_LABEL) {
    const direction = directions[directionIndex];
    directionIndex = (directionIndex + 1) % directions.length;

    label = network[label][direction];

    stepCount += 1;
  }

  return stepCount;
};

console.log(`Took ${countTraversal()} steps to escape`);

// Part 2 (given the problem description this doesn't handle all possible inputs)
const countGhostTraversal = (startLabel) => {
  let label = startLabel;
  let stepCount = 0;
  let directionIndex = 0;

  while (label[2] !== 'Z') {
    const direction = directions[directionIndex];
    directionIndex = (directionIndex + 1) % directions.length;

    label = network[label][direction];

    stepCount += 1;
  }

  return stepCount;
};

// Greatest Common Divisor
const gcd = (a, b) => {
  if (b === 0) {
    return a;
  }

  return gcd(b, a % b);
}

const countAllGhostsTraversal = () => {
  const ghosts = Object.keys(network) 
    .filter(label => label[2] === 'A')
    .map(countGhostTraversal);

  return ghosts.reduce((lcm, period) => lcm * period / gcd(lcm, period));
};

console.log(`Took the ghosts ${countAllGhostsTraversal()} steps to escape`);
