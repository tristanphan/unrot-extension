import { Card } from '../shared/card.ts';
import { v4 as uuidv4 } from 'uuid';

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

    const resultCard: Card = question === 'term' ?
      {
        question: term,
        question_img: null,
        answer: def,
        answer_img: img,
        confidence: 0,
        id: uuidv4(),
      } :
      {
        question: def,
        question_img: img,
        answer: term,
        answer_img: null,
        confidence: 0,
        id: uuidv4(),
      };

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