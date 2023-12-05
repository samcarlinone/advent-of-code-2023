const inputString = document.querySelector('pre').innerText.trim();

const [seedsLine, ...mapStrings] = inputString.split('\n\n');

const mapObject = Object.fromEntries(mapStrings.map(str => {
  const [nameLine, ...rangeStrings] = str.split('\n');

  const [_, name, target] = /^(\w+)-to-(\w+) map:$/.exec(nameLine);

  const ranges = rangeStrings.map(r => {
    const [dest, src, len] = r.split(' ').map(s => Number(s));
    return {dest, src, len};
  });

  return [name, {
    target,
    ranges,
  }];
}));

const seedNumbers = seedsLine.split(':')[1].trim().split(' ').map(n => Number(n));

// Part 1
const locations = seedNumbers.map(n => {
  let index = n;
  let currentMapName = 'seed';

  while (currentMapName !== 'location') {
    for (const range of mapObject[currentMapName].ranges) {
      if (range.src <= index && index < range.src + range.len) {
        index += range.dest - range.src;
        break;
      }
    }

    currentMapName = mapObject[currentMapName].target;
  }

  return index;
});

console.log(`Lowest location = ${locations.reduce((min, n) => Math.min(min, n))}`);

// Part 2
const ranges = seedNumbers
  .reduce((arr, n, i) => {
    if (i % 2 === 0) arr.push([n]);
    else arr[Math.floor(i / 2)].push(n);

    return arr;
  }, [])
  .map(range => {
    let currentRanges = [range];
    let currentMapName = 'seed';

    while (currentMapName !== 'location') {
      let newRanges = [];

      for (const cr of currentRanges) {
        let unmappedRanges = new Set([cr]); // Stop Set from "destructuring" our tuple

        for (const range of mapObject[currentMapName].ranges) {
          for (const ur of unmappedRanges) {
            if (ur[0] < range.src + range.len && range.src < ur[0] + ur[1]) {
              // Create mapped range
              const offset = range.dest - range.src;

              newRanges.push([
                Math.max(ur[0], range.src) + offset,
                Math.min(ur[0] + ur[1], range.src + range.len) - Math.max(ur[0], range.src),
              ]);

              unmappedRanges.delete(ur);

              // Handle "leftover" on left
              if (ur[0] < range.src) {
                unmappedRanges.add([ur[0], range.src - ur[0]]);
              }

              // Handle "leftover" on right
              if (range.src + range.len < ur[0] + ur[1]) {
                unmappedRanges.add([range.src + range.len, (ur[0] + ur[1]) - (range.src + range.len)]);
              }
            }
          }
        }

        newRanges.push(...unmappedRanges);
      }

      currentRanges = newRanges;
      currentMapName = mapObject[currentMapName].target;
    }

    return currentRanges;
  })
  .flat(1);

console.log(`Lowest range start = ${ranges.reduce((min, r) => Math.min(min, r[0]), Number.MAX_SAFE_INTEGER)}`);
