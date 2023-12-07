const inputString = document.querySelector('pre').innerText.trim();

const handTypes = {
  fiveOfAKind: 0,
  fourOfAKind: 1,
  fullHouse: 2,
  threeOfAKind: 3,
  twoPair: 4,
  onePair: 5,
  highCard: 6,
};

// Part 1
const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const getHandType = (hand) => {
  const cardCounts = hand.reduce((m, c) => ({...m, [c]: (m[c] ?? 0) + 1}), {});

  const countList = Object.values(cardCounts);

  if (countList.includes(5)) return handTypes.fiveOfAKind;
  if (countList.includes(4)) return handTypes.fourOfAKind;

  if (countList.includes(3)) {
    if (countList.includes(2)) return handTypes.fullHouse;
    else return handTypes.threeOfAKind;
  }

  const pairCount = countList.filter(n => n === 2).length;

  if (pairCount === 2) return handTypes.twoPair;
  if (pairCount === 1) return handTypes.onePair;

  return handTypes.highCard;
};

const hands = inputString.split('\n').map(line => {
  const [hand, bidStr] = line.split(' ');

  return {
    hand,
    handType: getHandType(hand.split('')),
    cardIndexes: hand.split('').map(c => cards.indexOf(c)),
    bid: Number(bidStr),
  }
});

const orderedHands = [...hands]
  .sort((hand1, hand2) => {
    if (hand1.handType > hand2.handType) return -1;
    if (hand1.handType < hand2.handType) return 1;

    for (let i = 0; i < 5; i++)
      if (hand1.cardIndexes[i] !== hand2.cardIndexes[i])
        return Math.sign(hand2.cardIndexes[i] - hand1.cardIndexes[i]);

    return 0;
  });

const totalWinnings = orderedHands
  .map((hand, index) => hand.bid * (index + 1))
  .reduce((t, n) => t + n);

console.log(`Total winnings = ${totalWinnings}`);

// Part 2
const cardsPt2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

const getHandTypePt2 = (hand) => {
  const {J: jokerCount, ...cardCounts} = hand.reduce((m, c) => ({...m, [c]: (m[c] ?? 0) + 1}), {J: 0});

  const countList = Object.values(cardCounts);

  if (countList.length === 0 || countList.includes(5 - jokerCount)) return handTypes.fiveOfAKind;
  if (countList.includes(4 - jokerCount)) return handTypes.fourOfAKind;

  // 0 jokers > normal
  if (jokerCount === 0 && countList.includes(3)) {
    if (countList.includes(2)) return handTypes.fullHouse;
    else return handTypes.threeOfAKind;
  }

  const pairCount = countList.filter(n => n === 2).length;

  // 1 joker > 2 pairs / 3 set, 2 jokers > 1 pair, 3 jokers > impossible
  if (jokerCount === 1 && (pairCount === 2 || countList.includes(3))) return handTypes.fullHouse;
  if (jokerCount === 2 && pairCount === 1) return handTypes.fullHouse;

  if (countList.includes(3 - jokerCount)) return handTypes.threeOfAKind;

  // at most 1 joker
  if (pairCount >= 2 - jokerCount) return handTypes.twoPair;
  if (pairCount >= 1 - jokerCount) return handTypes.onePair;

  return handTypes.highCard;
};

const handsPt2 = inputString.split('\n').map(line => {
  const [hand, bidStr] = line.split(' ');

  return {
    hand,
    handType: getHandTypePt2(hand.split('')),
    cardIndexes: hand.split('').map(c => cardsPt2.indexOf(c)),
    bid: Number(bidStr),
  }
});

const orderedHandsPt2 = [...handsPt2]
  .sort((hand1, hand2) => {
    if (hand1.handType > hand2.handType) return -1;
    if (hand1.handType < hand2.handType) return 1;

    for (let i = 0; i < 5; i++)
      if (hand1.cardIndexes[i] !== hand2.cardIndexes[i])
        return Math.sign(hand2.cardIndexes[i] - hand1.cardIndexes[i]);

    return 0;
  });

const totalWinningsPt2 = orderedHandsPt2
  .map((hand, index) => hand.bid * (index + 1))
  .reduce((t, n) => t + n);

console.log(`Total winnings (part 2) = ${totalWinningsPt2}`);
