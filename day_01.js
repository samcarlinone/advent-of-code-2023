const inputString = document.querySelector('pre').innerText.trim();
const lines = inputString.split('\n');

const isNumber = s => /\d/.test(s);

const numbers = lines.map(line => {
  const chars = [...line];
  return Number(chars.find(isNumber)) * 10 + Number(chars.findLast(isNumber));
});

console.log(`Sum of numbers is ${numbers.reduce((t, n) => t + n)}`);

// Part 2
const digitMap = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const digitStrings = Object.keys(digitMap).join('|');

const firstRegex = new RegExp(`(${digitStrings})`);
const lastRegex = new RegExp(`.*(${digitStrings})`);

const part2Numbers = lines.map(line => {
  const [_i, digit1] = firstRegex.exec(line);
  const [_j, digit2] = lastRegex.exec(line);

  return digitMap[digit1] * 10 + digitMap[digit2];
});

console.log(`Sum of numbers and words is ${part2Numbers.reduce((t, n) => t + n)}`);

