import { Card } from '../shared/card.ts'; 

console.log("This is a content script that runs on Quizlet");

function parse(question : string) {
  console.log('parsing');
  // const seeMoreButton: HTMLButtonElement | null = document.getElementsByClassName('w151px1v')[0]?.querySelector('.AssemblyButtonBase');
  // seeMoreButton?.click();

  const cards: HTMLCollection = document.getElementsByClassName('SetPageTermsList-term');
  const results: Card[] = [];

  Array.from(cards).forEach((card) => {
    const cardTexts = card.querySelectorAll('.TermText');
    const imgCollection = card.getElementsByClassName('SetPageTerm-image');
    const img = imgCollection.length === 0 ? null : imgCollection[0].getAttribute('src');
    const term = cardTexts[0]?.textContent !== null ? cardTexts[0]?.textContent.replace(/[\n\r]+/g, '/') : '';
    const def = cardTexts[1]?.textContent !== null ? cardTexts[1]?.textContent.replace(/[\n\r]+/g, '/') : '';

    const resultCard: Card = {
      question: question === 'term' ? term : def,
      answer: question === 'term' ? def : term,
      img: img,
    }

    results.push(resultCard);
  });

  chrome.storage.local.set({'results': results}, () => {
    chrome.storage.local.get(['results']).then((result) => {console.log(result)});
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('messaged received', message);
  if (message === 'parse-cards-term') {
    console.log('parse cards term message received');
    parse('term');
    sendResponse('success');
  }
  else if (message === 'parse-cards-def') {
    console.log('parse cards def message received');
    parse('def');
    sendResponse('success');
  }
})