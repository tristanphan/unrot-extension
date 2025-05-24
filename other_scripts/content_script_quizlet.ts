import { Card } from '../shared/card.ts'; 

console.log("This is a content script that runs on Quizlet");

function parse() {
  const cards: HTMLCollection = document.getElementsByClassName('SetPageTermsList-term');
  const results: Card[] = [];

  Array.from(cards).forEach((card) => {
    const cardTexts = card.querySelectorAll('.TermText');
    const imgCollection = card.getElementsByClassName('SetPageTerm-image');
    const img = imgCollection.length === 0 ? null : imgCollection[0].getAttribute('src');
    const word = cardTexts[0]?.textContent !== null ? cardTexts[0]?.textContent.replace(/[\n\r]+/g, '/') : '';
    const def = cardTexts[1]?.textContent !== null ? cardTexts[1]?.textContent.replace(/[\n\r]+/g, '/') : '';

    const resultCard: Card = {
        word: word,
        def: def,
        img: img,
    }

    results.push(resultCard);
  });

  chrome.storage.local.set({'results': results});
}