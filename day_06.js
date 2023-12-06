const inputString = document.querySelector('pre').innerText.trim();

// These solutions heavily favor simplicity over runtime

// Part 1
const [timeLine, distanceLine] = inputString.split('\n');

const times = timeLine.split(/\s+/).map(s => Number(s)).filter(n => !isNaN(n));
const distances = distanceLine.split(/\s+/).map(s => Number(s)).filter(n => !isNaN(n));

const races = times.map((time, i) => ({time, distance: distances[i]}));

const raceOptions = races.map(
  ({time, distance}) => new Array(time + 1).fill(0)
    .map((_, timeHeld) => timeHeld * (time - timeHeld) > distance ? 1 : 0)
    .reduce((t, n) => t + n)
);

console.log(`Final product of races = ${raceOptions.reduce((p, n) => p * n)}`);

// Part 2
const time = Number([...timeLine].filter(c => /\d/.test(c)).join(''));
const distance = Number([...distanceLine].filter(c => /\d/.test(c)).join(''));

const lastRaceOptions = new Array(time + 1).fill(0)
  .map((_, timeHeld) => timeHeld * (time - timeHeld) > distance ? 1 : 0)
  .reduce((t, n) => t + n);

console.log(`Number of options for one race = ${lastRaceOptions}`);
