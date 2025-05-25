import { Card as CardStruct } from "../../shared/card.ts";

export interface Question {
    question: string,
    answers: string[],
    correctIndex: number,
    image: string | undefined,
}

export async function getCard(): Promise<Question | undefined> {
    const cards: (CardStruct[] | undefined) = (await chrome.storage.local.get("results"))["results"];
    if (cards === undefined) return undefined
    const index: number = Math.floor(Math.random() * cards.length)
    return {
        question: cards[index].question!,
        answers: [cards[index].answer!, cards[index].answer!, cards[index].answer!, cards[index].answer!],
        image: cards[index].img ?? undefined,
        correctIndex: 0,
    }
    // TODO better randomization
}

